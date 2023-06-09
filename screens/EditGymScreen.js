import { View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import SettingsButton from "../components/editGymComponents/SettingsButton";

const EditGymScreen = ({ navigation }) => {
  const { spraywalls } = useSelector((state) => state.spraywallReducer);
  const { gym } = useSelector((state) => state.gymReducer);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "rgba(245,245,245,255)", // Set your desired color here
      },
    });
  }, [navigation]);

  const handleEditItemPressed = (item) => {
    navigation.navigate("Edit", { item });
  };

  const GYM_DATA = [
    {
      id: 1,
      title: "Gym Type",
    },
    {
      id: 2,
      title: "Gym Name",
    },
    {
      id: 3,
      title: "Gym Location",
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(245,245,245,255)",
        paddingHorizontal: 10,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 26 }}>Edit Gym</Text>
      </View>
      {/* gym settings */}
      <View
        style={{
          paddingHorizontal: 15,
          paddingBottom: 10,
          paddingTop: 20,
        }}
      >
        <Text style={{ fontSize: 14 }}>Gym</Text>
      </View>
      <View style={{ backgroundColor: "white", borderRadius: 5 }}>
        {GYM_DATA.map((item) => (
          <SettingsButton
            key={item.id}
            title={item.title}
            onPress={() => handleEditItemPressed(item)}
          />
        ))}
      </View>
      {/* spray wall settings */}
      <View
        style={{
          paddingHorizontal: 15,
          paddingBottom: 10,
          paddingTop: 20,
        }}
      >
        <Text style={{ fontSize: 14 }}>Spray Wall</Text>
      </View>
      <View style={{ backgroundColor: "white", borderRadius: 5 }}>
        {spraywalls.map((item, index) => (
          <SettingsButton
            key={item.id}
            title={item.name}
            onPress={() =>
              navigation.navigate("EditSprayWall", { index: index })
            }
          />
        ))}
        <View
          style={{
            borderRadius: 5,
            borderWidth: 1,
          }}
        >
          <SettingsButton
            title={"Add New Spray Wall"}
            onPress={() => navigation.navigate("AddNewSprayWall")}
          />
        </View>
      </View>
      {/* delete gym */}
      <View
        style={{
          paddingHorizontal: 15,
          paddingBottom: 10,
          paddingTop: 20,
        }}
      >
        <Text style={{ fontSize: 14, color: "red" }}>Delete</Text>
      </View>
      <View
        style={{
          backgroundColor: "red",
          borderRadius: 5,
        }}
      >
        <SettingsButton
          title={"Delete Gym"}
          textColor={"white"}
          destructive={true}
        />
      </View>
    </View>
  );
};

export default EditGymScreen;
