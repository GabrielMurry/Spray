import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import FullScreenImage from "../components/FullScreenImage";
import { request } from "../api/requestMethods";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinkIcon, StarIcon } from "react-native-heroicons/outline";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useSelector } from "react-redux";

const BoulderScreen = ({ route, navigation }) => {
  const { userID } = useSelector((state) => state.userReducer);
  const { username } = useSelector((state) => state.userReducer);

  const [boulder, setBoulder] = useState(route.params.boulder);
  const [image, setImage] = useState({ uri: null, width: null, height: null });
  const [imageFullScreen, setImageFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  const imageScaleDownFactor = image.width > image.height ? 10 : 9;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <FontAwesome
            name="bookmark"
            size={24}
            color="gold"
            style={{ opacity: 0 }}
          />
          <FontAwesome
            name="trophy"
            size={24}
            color="green"
            style={boulder.sentBoulder ? { opacity: 1 } : { opacity: 0 }}
          />
          <FontAwesome
            name="heart"
            size={24}
            color="red"
            style={boulder.personLiked ? { opacity: 1 } : { opacity: 0 }}
          />
        </View>
      ),
    });
  }, [navigation, boulder]);

  // get image base64 uri when on individual boulder screen. Not getting base64 image from list screen since it will take a long time to load every boulder card in list
  useEffect(() => {
    const getData = async () => {
      const response = await request("get", `boulder_image/${boulder.id}`);
      if (response.status !== 200) {
        console.log(response.status);
      }
      if (response.data) {
        setImage({
          uri: response.data.image_uri,
          width: response.data.image_width,
          height: response.data.image_height,
        });
      }
    };

    getData();
  }, []);

  // This event will be triggered when the screen gains focus (i.e., when you navigate back to it).
  useFocusEffect(
    useCallback(() => {
      fetchCertainData();
    }, [])
  );

  // re-fetching certain data (grade, quality, first ascent user) --> in the event of someone successfully sending (climbing) the boulder for the first time
  const fetchCertainData = async () => {
    const response = await request(
      "get",
      `sent_boulder/${boulder.id}/${userID}`
    );
    if (response.status !== 200) {
      console.log(response.status);
    }
    if (response.data) {
      setBoulder({
        ...boulder,
        grade: response.data.grade,
        quality: response.data.quality,
        firstAscent: response.data.firstAscent,
        sentBoulder: response.data.sentBoulder,
      });
    }
  };

  const handleLiked = async () => {
    const method = boulder.personLiked ? "delete" : "post";
    const response = await request(
      method,
      `like_boulder/${boulder.id}/${userID}`
    );
    if (response.status !== 200) {
      console.log(response.status);
    }
    setBoulder({ ...boulder, personLiked: response.data.personLiked });
  };

  const handleBookmarked = async () => {
    console.log("bookmarked");
  };

  const handleSentBoulder = () => {
    navigation.navigate("Send", { boulder: boulder });
  };

  const deleteBoulder = () => {
    Alert.alert(
      "Delete Boulder",
      `Are you sure you want to delete "${boulder.name}"?`,
      [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: async () => {
            const response = await request(
              "delete",
              `delete_boulder/${boulder.id}`
            );
            if (response.status !== 200) {
              console.log(response.status);
              return;
            }
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const showOptions = async () => {
    let options = ["Share", "Report", "Cancel"];
    let destructiveButtonIndex = -1;
    const cancelButtonIndex = 3;
    // if current user is the creator of the boulder, give only them the option to delete
    if (boulder.setter === username) {
      options = ["Share", "Report", "Delete", "Cancel"];
      destructiveButtonIndex = 2;
    }

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            console.log("Share");
            break;

          case 1:
            console.log("Report");
            break;

          case destructiveButtonIndex:
            // Delete
            deleteBoulder();
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  const handleCircuitPressed = () => {
    navigation.navigate('Circuit')
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Titles */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleMain}>{boulder.name}</Text>
        <Text style={styles.titleSecondary}>
          {boulder.grade ?? "Project"}{" "}
          {boulder.quality ? (
            <>
              {" "}
              <StarIcon
                size={20}
                fill={boulder.quality >= 1 ? "gold" : "black"}
                color={boulder.quality >= 1 ? "gold" : "black"}
              />
              <StarIcon
                size={20}
                fill={boulder.quality >= 2 ? "gold" : "black"}
                color={boulder.quality >= 2 ? "gold" : "black"}
              />
              <StarIcon
                size={20}
                fill={boulder.quality === 3 ? "gold" : "black"}
                color={boulder.quality === 3 ? "gold" : "black"}
              />{" "}
            </>
          ) : (
            "Unrated"
          )}
        </Text>
        <Text style={styles.titleThird}>
          Setter: {boulder.setter} FA: {boulder.firstAscent ?? "-"}
        </Text>
      </View>
      {/* Default Image */}
      <View style={styles.imageContainer}>
        <Pressable
          style={styles.image(image, imageScaleDownFactor)}
          onPress={() => setImageFullScreen(true)}
        >
          <View
            style={{
              width: image.width / (imageScaleDownFactor + 0.5),
              height: image.height / (imageScaleDownFactor + 0.5),
            }}
          >
            <Image
              source={{
                uri: image.uri,
              }}
              resizeMode="contain"
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            />
            {isLoading && (
              <ActivityIndicator
                size="large"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </View>
        </Pressable>
      </View>
      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button} onPress={showOptions}>
            <SimpleLineIcons name="options" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="book" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCircuitPressed}
          >
            {boulder.personLiked ? (
              <LinkIcon size={24} />
            ) : (
              <LinkIcon size={24} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleBookmarked}>
            {boulder.personLiked ? (
              <FontAwesome name="bookmark" size={24} color="gold" />
            ) : (
              <FontAwesome name="bookmark-o" size={24} color="gold" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLiked}>
            {boulder.personLiked ? (
              <FontAwesome name="heart" size={24} color="red" />
            ) : (
              <FontAwesome name="heart-o" size={24} color="red" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSentBoulder}>
            {boulder.sentBoulder ? (
              <AntDesign name="checkcircle" size={28} color="green" />
            ) : (
              <AntDesign name="checkcircleo" size={28} color="green" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <FullScreenImage
        imageFullScreen={imageFullScreen}
        uri={image.uri}
        image={{
          width: image.width,
          height: image.height,
        }}
        onRequestClose={() => setImageFullScreen(false)}
      />
    </SafeAreaView>
  );
};

export default BoulderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    height: "15%",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 5,
  },
  titleMain: {
    fontWeight: "bold",
    fontSize: 30,
  },
  titleSecondary: {
    fontSize: 20,
  },
  titleThird: {
    fontSize: 14,
  },
  imageContainer: {
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: (image, imageScaleDownFactor) => ({
    minHeight: 425,
    minWidth: "95%",
    padding: 10,
    borderColor: "black",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 10,
    backgroundColor: "#FFFBF1",
    justifyContent: "center",
    alignItems: "center",
    width: image.width / imageScaleDownFactor,
    height: image.height / imageScaleDownFactor,
    // adding shadow to image
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Required for Android
  }),
  buttonsContainer: {
    justifyContent: "center",
    gap: 20,
    padding: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#FFFBF1",
    justifyContent: "center",
    alignItems: "center",
    // adding shadow to button
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Required for Android
  },
});
