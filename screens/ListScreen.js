import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  Keyboard,
  Image,
  ActivityIndicator,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  AdjustmentsHorizontalIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import BoulderCard from "../components/listComponents/BoulderCard";
import { request } from "../api/requestMethods";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import ModalAddNewBoulder from "../components/listComponents/ModalAddNewBoulder";
import * as ImagePicker from "expo-image-picker";
import { boulderGrades } from "../utils/constants/boulderConstants";

const ListScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.userReducer);
  const { gym } = useSelector((state) => state.gymReducer);
  const {
    spraywalls,
    spraywallIndex,
    filterMinGradeIndex,
    filterMaxGradeIndex,
    filterSortBy,
    filterCircuits,
    filterClimbType,
    filterStatus,
  } = useSelector((state) => state.spraywallReducer);

  const [searchQuery, setSearchQuery] = useState("");
  const [boulders, setBoulders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHeaderTitleVisible, setIsHeaderTitleVisible] = useState(false);
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {isHeaderTitleVisible ? spraywalls[spraywallIndex].name : null}
        </Text>
      ),
    });
  }, [isHeaderTitleVisible]);

  const areFiltersEnabled = () => {
    if (
      filterMinGradeIndex !== 0 ||
      filterMaxGradeIndex !== boulderGrades.length - 1 ||
      filterSortBy !== "popular" ||
      filterCircuits.length !== 0 ||
      filterClimbType !== "boulder" ||
      filterStatus !== "all"
    ) {
      return true;
    }
    return false;
  };

  // This event will be triggered when the screen gains focus (i.e., when you navigate back to it).
  useFocusEffect(
    useCallback(() => {
      // reset search query and fetch all data upon every new focus on screen - a boulder may have been updated
      // setSearchQuery("");
      fetchAllData();
      setHasFilters(areFiltersEnabled);
    }, [
      filterMinGradeIndex,
      filterMaxGradeIndex,
      filterSortBy,
      filterCircuits,
      filterClimbType,
      filterStatus,
      searchQuery,
    ])
  );

  const fetchAllData = async () => {
    setIsLoading(true);
    // extract only the id property from each object in the filterCircuits array
    // serialize the array into a string representation, such as JSON or comma-separated values.
    const circuitIds = filterCircuits.map((circuit) => circuit.id);
    const encodedCircuitIds = encodeURIComponent(JSON.stringify(circuitIds));
    const response = await request(
      "get",
      `list/${spraywalls[spraywallIndex].id}/${user.id}?search=${searchQuery}&minGradeIndex=${filterMinGradeIndex}&maxGradeIndex=${filterMaxGradeIndex}&sortBy=${filterSortBy}&circuits=${encodedCircuitIds}&climbType=${filterClimbType}&status=${filterStatus}`
    );
    if (response.status !== 200) {
      console.log(response.status);
      return;
    }
    if (response.data) {
      setBoulders(response.data);
      setIsLoading(false);
    }
  };

  // Add an event listener to detect changes in keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    // Clean up the event listeners when the component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Optimization --> use the React.useCallback hook to memoize the navigation function and prevent unnecessary re-creation of the function on every render.
  // Providing navigation as a dependency, the navigateToBoulder function will only be re-created when the navigation prop changes, ensuring better performance.
  const navigateToBoulderScreen = useCallback(
    (item) => {
      navigation.navigate("Boulder", { boulder: item });
    },
    [navigation]
  );

  const handleFilterPress = () => {
    navigation.navigate("Filter");
  };

  const handleAddNewBoulderPress = () => {
    setIsModalVisible(true);
  };

  const renderBoulderCards = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigateToBoulderScreen(item)}>
        <BoulderCard boulder={item} />
      </TouchableOpacity>
    );
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 70 && !isHeaderTitleVisible) {
      setIsHeaderTitleVisible(true);
    } else if (scrollY <= 70 && isHeaderTitleVisible) {
      setIsHeaderTitleVisible(false);
    }
  };

  const handleTextInputFocus = () => {
    setIsTextInputFocused(true);
  };

  const handleTextInputBlur = () => {
    setIsTextInputFocused(false);
  };

  const handleCancelSearchPress = () => {
    setSearchQuery("");
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    }
  };

  const headerComponent = (
    <>
      <View
        style={{
          height: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.titleText}>{gym.name}</Text>
        <Text style={styles.subTitleText}>
          {spraywalls[spraywallIndex].name}
        </Text>
      </View>
      <View style={styles.SearchInputAndCancelContainer}>
        <View style={styles.SearchInputContainer}>
          <MagnifyingGlassIcon size={20} color="gray" />
          <TextInput
            style={styles.SearchInput}
            value={searchQuery}
            // onChange doesn't exist in react native. use onChangeText
            onChangeText={(value) => setSearchQuery(value)} // in react native, you don't have to do e.target.value
            placeholder="Search (name, setter, or grade)"
            onFocus={handleTextInputFocus}
            onBlur={handleTextInputBlur}
            autoComplete="off"
          />
          {searchQuery ? (
            <TouchableOpacity
              style={styles.resetSearchQuery}
              onPress={() => setSearchQuery("")}
            >
              <XMarkIcon size={12} color={"white"} />
            </TouchableOpacity>
          ) : null}
        </View>
        {(isTextInputFocused || searchQuery) && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSearchPress}
          >
            <Text style={{ color: "rgb(0, 122, 255)" }}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  const handleCameraPressed = () => {
    setIsModalVisible(false);
    navigation.navigate("Camera", { screen: "EditBoulder" });
  };

  const handleDefaultImagePressed = () => {
    setIsModalVisible(false);
    navigation.navigate("EditBoulder", {
      image: {
        url: spraywalls[spraywallIndex].url,
        width: spraywalls[spraywallIndex].width,
        height: spraywalls[spraywallIndex].height,
      },
    });
  };

  const handleUploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (result) {
      if (!result.canceled) {
        Image.getSize(result.assets[0].uri, (width, height) => {
          setIsModalVisible(false);
          navigation.navigate("EditBoulder", {
            image: {
              uri: "data:image/png;base64," + result.assets[0].base64,
              width: width,
              height: height,
            },
          });
        });
      }
    }
  };

  const renderEmptyComponent = () => {
    return (
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? <ActivityIndicator /> : <Text>No Boulders Found</Text>}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View style={styles.listContainer}>
        {/* List of Boulders */}
        <FlatList
          contentContainerStyle={styles.bouldersList}
          data={boulders}
          renderItem={renderBoulderCards}
          keyExtractor={(item) => item.id}
          initialNumToRender={8} // Render the number of items that are initially visible on the screen
          windowSize={2} // Render an additional number of items to improve scrolling performance
          onScroll={handleScroll}
          ListHeaderComponent={headerComponent}
          ListFooterComponent={<View style={{ height: 90 }} />}
          ListEmptyComponent={renderEmptyComponent}
          keyboardShouldPersistTaps="handled" // click on search bar cancel buttons when Keyboard is visible (or click on boulder cards)
        />
        <Pressable
          style={styles.filterButton(hasFilters)}
          onPress={handleFilterPress}
        >
          <AdjustmentsHorizontalIcon
            size={30}
            color={hasFilters ? "white" : "rgb(0, 122, 255)"}
          />
        </Pressable>
        <Pressable
          style={styles.addNewBoulderButton}
          onPress={handleAddNewBoulderPress}
        >
          <PlusIcon size={30} color={"rgb(0, 122, 255)"} />
        </Pressable>
      </View>
      <ModalAddNewBoulder
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleCameraPressed={handleCameraPressed}
        handleDefaultImagePressed={handleDefaultImagePressed}
        handleUploadImage={handleUploadImage}
      />
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 30,
  },
  subTitleText: {
    fontSize: 24,
  },
  listContainer: {
    flex: 1,
    rowGap: 10,
    paddingHorizontal: 10,
  },
  bouldersList: {
    rowGap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 35,
  },
  searchInput: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 5,
  },
  filterButton: (hasFilters) => ({
    padding: 15,
    backgroundColor: hasFilters ? "rgb(0, 122, 255)" : "white",
    borderRadius: "100%",
    position: "absolute",
    bottom: 35,
    left: 20,
    // adding shadow to add new circuit button
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Required for Android
  }),
  addNewBoulderButton: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: "100%",
    position: "absolute",
    bottom: 35,
    right: 20,
    // adding shadow to add new circuit button
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Required for Android
  },
  SearchInputAndCancelContainer: {
    flexDirection: "row",
  },
  SearchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(229, 228, 226)",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  SearchInput: {
    flex: 1,
    height: 35,
    paddingHorizontal: 5,
    backgroundColor: "rgb(229, 228, 226)",
    borderRadius: 10,
  },
  cancelButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  resetSearchQuery: {
    backgroundColor: "gray",
    width: 18,
    height: 18,
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
