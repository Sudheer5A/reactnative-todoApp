import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../firebase";

const Task = ({ text, timestamp, id }) => {
  const createdDate = new Date(timestamp.seconds * 1000).toLocaleDateString();
  const createdTime = new Date(timestamp.seconds * 1000).toLocaleTimeString();

  const userID = auth.currentUser.email;
  const deleteDoc = () => {
    db.collection("todos").doc(userID).collection("usertodos").doc(id).delete();
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <Text style={styles.itemText}>{text}</Text>
      </View>
      <View style={styles.itemRight}>
        <View>
          <Text style={{ fontSize: 10, opacity: 0.7 }}>{createdDate}</Text>
          <Text style={{ fontSize: 10, opacity: 0.7 }}>{createdTime}</Text>
        </View>
        <TouchableOpacity onPress={deleteDoc}>
          <MaterialIcons name="delete-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#eefbff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: "#55bcf6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "55%",
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: "#55bcf6",
    borderWidth: 2,
    borderRadius: 5,
  },
  itemRight: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
export default Task;
