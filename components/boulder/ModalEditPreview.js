import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import FullScreenImage from "../image/FullScreenImage";
import { request } from "../../api/requestMethods";
import { useSelector } from "react-redux";
import CustomInput from "../custom/CustomInput";
import CustomButton from "../custom/CustomButton";
import * as Haptics from "expo-haptics";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { colors } from "../../utils/styles";
import { addNewBoulder } from "../../redux/actions";
import { useDispatch } from "react-redux";

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
  isModalVisible,
  setIsModalVisible,
  navigation,
  resultImageUri,
}) => {
  const dispatch = useDispatch();
  const { spraywalls, spraywallIndex } = useSelector(
    (state) => state.spraywallReducer
  );
  const { user } = useSelector((state) => state.userReducer);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isMatching, setIsMatching] = useState(true);
  const [isFeetFollowHands, setIsFeetFollowHands] = useState(true);
  const [isKickboardOn, setIsKickboardOn] = useState(false);
  const [imageFullScreen, setImageFullScreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async ({ publish }) => {
    if (name === "") {
      setError(true);
      return;
    }
    data = {
      name,
      description,
      publish,
      matching: isMatching,
      feetFollowHands: isFeetFollowHands,
      kickboardOn: isKickboardOn,
      url: resultImageUri.split(",")[1], // using the default image has complete base64 as image.uri --> remove the 'data:image/png;base64' in the beginning of string
      width: image.width,
      height: image.height,
      setter: user.id,
      spraywall: spraywalls[spraywallIndex].id,
    };
    setIsLoading(true);
    const response = await request(
      "post",
      `api/list/${spraywalls[spraywallIndex].id}`,
      data
    );
    if (response) {
      dispatch(addNewBoulder(response.data));
      handleVibrate();
      navigation.navigate("Boulder-Home", {
        boulderId: response.data.id,
        fromScreen: "EditBoulder",
        toScreen: "List",
      });
    } else {
      console.error("Failed to upload new boulder.");
    }
    setIsLoading(false);
    setIsModalVisible(!isModalVisible);
  };

  const handleVibrate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  useEffect(() => {
    if (error) {
      setError(false);
    }
  }, [name]);

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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingBottom: 5,
            }}
          >
            <TouchableOpacity
              style={{ width: 50 }}
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <ChevronLeftIcon size={25} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 24 }}>Publish</Text>
          </View>
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
                gap: 10,
              }}
            >
              <CustomInput
                value={name}
                setValue={(value) => setName(value)}
                placeholder="Boulder Name"
                secureTextEntry={false}
                error={error}
                bordered={true}
                rounded={true}
              />
              <TextInput
                value={description}
                onChangeText={(value) => setDescription(value)}
                placeholder={"Boulder Description (optional)"}
                keyboardType="default" // twitter???
                style={{
                  borderColor: "#e8e8e8",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  minHeight: 100, // Adjust the height as needed
                  textAlignVertical: "top", // Align the text at the top of the input
                }}
                multiline={true}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 30,
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
                  paddingHorizontal: 30,
                }}
              >
                <Text style={styles.toggleLabel}>Feet Follow Hands</Text>
                <Switch
                  value={isFeetFollowHands}
                  onValueChange={setIsFeetFollowHands}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 30,
                }}
              >
                <Text style={styles.toggleLabel}>
                  All Kickboard Footholds Allowed
                </Text>
                <Switch
                  value={isKickboardOn}
                  onValueChange={setIsKickboardOn}
                />
              </View>
            </View>
          </ScrollView>
          {/* Drafts / Publish Buttons */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <CustomButton
              onPress={() => handleConfirm({ publish: false })}
              text="Drafts"
              type="TERTIARY"
              width="45%"
              bgColor={"rgba(245, 245, 245, 255)"}
              disabled={isLoading}
            />
            <CustomButton
              onPress={() => handleConfirm({ publish: true })}
              text="Publish"
              width="45%"
              bgColor={colors.primary}
              disabled={isLoading}
            />
          </View>
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