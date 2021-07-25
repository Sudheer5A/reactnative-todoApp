import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import Task from "../components/Task";
import { auth, db } from "../firebase";
import firebase from "firebase";
import { useEffect, useLayoutEffect } from "react";
import { Button } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const userID = auth.currentUser.email;
  const name = auth.currentUser.displayName;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "ToDo",
      headerShown: false,
    });
  });

  const handleAddTask = () => {
    Keyboard.dismiss();
    try {
      if (task) {
        db.collection("todos").doc(userID).collection("usertodos").add({
          timestamp: firebase.firestore.Timestamp.now(),
          todoMessage: task,
        });
      } else {
        ToastAndroid.showWithGravity(
          "Enter text to add todo..",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    } catch (err) {
      alert(err.message);
    }
    setTask("");
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("todos")
      .doc(userID)
      .collection("usertodos")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setTaskItems(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    return unsubscribe;
  }, []);

  const signOut = () => {
    auth
      .signOut()
      .then(() => navigation.replace("Login"))
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <StatusBar type="auto" />
      <View style={styles.infoHeader}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={24}
            color="black"
          />
          <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
        <Button title="Logout" type="clear" onPress={signOut} />
      </View>

      <View style={styles.tasksWrapper}>
        <Text style={styles.title}>Today's Tasks</Text>
        <ScrollView>
          <View style={styles.items}>
            {taskItems.map(({ id, data }) => {
              return (
                <Task
                  key={id}
                  id={id}
                  timestamp={data.timestamp}
                  text={data.todoMessage}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behaviour={Platform.OS == "android" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={"Write a task"}
          value={task}
          onChangeText={(text) => setTask(text)}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Ionicons name="ios-add-outline" size={30} color="black" />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  infoHeader: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  name: { fontSize: 20, textTransform: "capitalize", fontWeight: "700" },
  tasksWrapper: {
    maxHeight: 600,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    padding: 10,
    bottom: 2,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 150,
    backgroundColor: "white",
  },
  input: {
    paddingVertical: 10,
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: "#f3f3f3",
    borderRadius: 15,
    marginRight: 10,
  },
  addWrapper: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c0c0c0",
  },
});
