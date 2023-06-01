import { View, Text, StyleSheet } from "react-native";
import React from "react";

const GymCard = ({ gym }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textName}>{gym.name}</Text>
      <Text>{gym.location}</Text>
    </View>
  );
};

export default GymCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFBF1",
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    // adding shadow to gym card
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Required for Android
  },
  textName: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
