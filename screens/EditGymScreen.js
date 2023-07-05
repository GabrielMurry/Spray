import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  Switch,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PlusIcon } from "react-native-heroicons/outline";
import { request } from "../api/requestMethods";
import { useSelector } from "react-redux";

const EditGymScreen = ({ navigation }) => {
  const { spraywalls } = useSelector((state) => state.spraywallReducer);
  const { gymName, gymID } = useSelector((state) => state.gymReducer);
  const [newGymName, setNewGymName] = useState(gymName);
  const [newGymLocation, setNewGymLocation] = useState("");
  const [isCommercialGym, setIsCommercialGym] = useState(true);
  const [spraywallsData, setSpraywallsData] = useState([]);

  //   useEffect(() => {
  //     fetchEditGymData();
  //   }, []);

  //   const fetchEditGymData = async () => {
  //     const response = await request("get", `edit_gym_data/${gymID}`);
  //     if (response.status !== 200) {
  //       console.log(response.status);
  //       return;
  //     }
  //     if (response.data) {
  //       const { name, location, type, spraywalls } = response.data;
  //       setIsCommercialGym("commercial" ? true : false);
  //       setNewGymLocation(location);
  //       setSpraywallsData(spraywalls);
  //     }
  //   };

  const renderHeaderItem = () => (
    <TouchableOpacity
      style={{
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => navigation.navigate("AddNewSprayWall")}
    >
      <PlusIcon size={35} color={"black"} />
    </TouchableOpacity>
  );

  const renderSprayWallItem = ({ item }) => (
    <TouchableOpacity
      style={{
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
      }}
      onPress={() => navigation.navigate("EditSprayWall", { spraywall: item })}
    >
      <Image
        source={{ uri: item.base64 }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        gap: 10,
        paddingHorizontal: 10,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 26 }}>Edit Gym</Text>
      </View>
      <View style={{ borderBottomWidth: 1 }}>
        <Text>Gym</Text>
      </View>
      <Text style={{ fontSize: 16 }}>Gym Type</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "95%",
        }}
      >
        <Text
          style={{
            fontSize: 16,
          }}
        >
          Commercial Gym
        </Text>
        <Switch
          value={isCommercialGym}
          onValueChange={() => setIsCommercialGym(!isCommercialGym)}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "95%",
        }}
      >
        <Text
          style={{
            fontSize: 16,
          }}
        >
          Non-Commercial Gym (Home)
        </Text>
        <Switch
          value={!isCommercialGym}
          onValueChange={() => setIsCommercialGym(!isCommercialGym)}
        />
      </View>
      <Text style={{ fontSize: 16 }}>Gym Name</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          fontSize: 16,
        }}
        value={newGymName}
        onChangeText={(text) => setNewGymName(text)}
      />
      <Text style={{ fontSize: 16 }}>Gym Location</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          fontSize: 16,
        }}
        placeholder={"Current Gym Location"}
        value={newGymLocation}
        onChangeText={(text) => setNewGymLocation(text)}
      />
      <View style={{ borderBottomWidth: 1 }}>
        <Text>Spray Wall</Text>
      </View>
      <Text style={{ fontSize: 16 }}>Spray Walls</Text>
      <FlatList
        data={spraywalls}
        renderItem={renderSprayWallItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        ListHeaderComponent={renderHeaderItem}
        contentContainerStyle={{
          gap: 10,
        }}
      />
    </View>
  );
};

export default EditGymScreen;
