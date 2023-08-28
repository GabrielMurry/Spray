import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import FullScreenImage from "./FullScreenImage";
import { request } from "../api/requestMethods";
import { useSelector } from "react-redux";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import * as Haptics from "expo-haptics";

const TAGS = [
  { name: "crimp", selected: false },
  { name: "pinch", selected: false },
  { name: "endurance", selected: false },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHRINK_SCALE = 0.3;

const ModalEditPreview = ({
  image,
  imageScaleDownFactor,
  isModalVisible,
  setIsModalVisible,
  navigation,
  resultImageUri,
}) => {
  const { user } = useSelector((state) => state.userReducer);
  const { spraywalls, spraywallIndex } = useSelector(
    (state) => state.spraywallReducer
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isMatching, setIsMatching] = useState(true);
  const [isPublish, setIsPublish] = useState(true);
  const [imageFullScreen, setImageFullScreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [tags, setTags] = useState(TAGS);

  const handleTagPress = (index) => {
    const updatedTags = [...tags];
    updatedTags[index].selected = !updatedTags[index].selected;
    setTags(updatedTags);
  };

  const handleConfirm = async () => {
    setIsConfirmLoading(true);
    data = {
      name,
      description,
      matching: isMatching,
      publish: isPublish,
      image_data: resultImageUri.split(",")[1], // using the default image has complete base64 as image.uri --> remove the 'data:image/png;base64' in the beginning of string
      image_width: image.width,
      image_height: image.height,
    };
    const response = await request(
      "post",
      `add_boulder/${spraywalls[spraywallIndex].id}/${user.id}`,
      data
    );
    if (response.status !== 200) {
      console.log(response.status);
      setIsConfirmLoading(false);
      return;
    }
    if (response.data) {
      handleVibrate();
      navigation.navigate("Boulder", {
        boulder: response.data,
        fromScreen: "EditBoulder",
        toScreen: "Home",
      });
      setIsConfirmLoading(false);
    }
    setIsModalVisible(!isModalVisible);
  };

  const handleVibrate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <SafeAreaView style={styles.modalContent}>
          {/* Add modal content here */}
          {/* Manipulated Image Section */}
          <ScrollView>
            <Pressable
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT * SHRINK_SCALE,
                padding: 10,
              }}
              onPress={() => setImageFullScreen(true)}
            >
              <Image
                source={{ uri: resultImageUri }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
              />
              {isImageLoading ? (
                <ActivityIndicator
                  size="large"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                />
              ) : null}
            </Pressable>
            {/* Input Data Section */}
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: "center",
              }}
            >
              <Text>Boulder Name</Text>
              <CustomInput
                value={name}
                setValue={(value) => setName(value)}
                placeholder="Boulder Name"
                secureTextEntry={false}
              />
              <Text>Boulder Notes</Text>
              <TextInput
                value={description}
                onChangeText={(value) => setDescription(value)}
                placeholder={"Boulder Notes"}
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  minHeight: 100, // Adjust the height as needed
                  textAlignVertical: "top", // Align the text at the top of the input
                }}
                multiline={true}
              />
              {/* <CustomInput
              value={description}
              setValue={(value) => setDescription(value)}
              placeholder="Boulder Description"
              secureTextEntry={false}
            /> */}
              <View style={{ marginTop: 10, gap: 10, paddingHorizontal: 40 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.toggleLabel}>Matching Allowed</Text>
                  <Switch value={isMatching} onValueChange={setIsMatching} />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.toggleLabel}>Publish</Text>
                  <Switch value={isPublish} onValueChange={setIsPublish} />
                </View>
              </View>
              <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                <Text>Tags</Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  {tags.map((tag, index) => (
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        backgroundColor: tag.selected ? "blue" : "lightgray",
                        borderRadius: 10,
                      }}
                      onPress={() => handleTagPress(index)}
                      key={index}
                    >
                      <Text>{tag.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            {/* Cancel / Confirm Buttons */}
            <View
              style={{
                paddingHorizontal: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <CustomButton
                onPress={() => setIsModalVisible(!isModalVisible)}
                text="Cancel"
                type="TERTIARY"
                width="40%"
              />
              <CustomButton
                onPress={handleConfirm}
                text="Confirm"
                width="40%"
                isLoading={isConfirmLoading}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
      <FullScreenImage
        imageFullScreen={imageFullScreen}
        url={resultImageUri}
        width={image.width}
        height={image.height}
        onRequestClose={() => setImageFullScreen(false)}
      />
    </Modal>
  );
};

export default ModalEditPreview;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalContent: {
    flex: 1,
  },
  displayContainer: {
    flex: 1,
  },
  columnContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  buttonTextSmall: {
    width: 125,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  buttonTextBig: {
    width: 125,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  buttonContainerIcon: {
    width: "100%",
    alignItems: "center",
  },
  buttonIconSmall: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
    // shadow
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Required for Android
  },
  buttonIconBig: {
    width: 60,
    height: 60,
    backgroundColor: "rgb(0, 122, 255)",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
    // shadow
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Required for Android
  },
});
