import { StatusBar } from "expo-status-bar";
import React from "react";
import { useLayoutEffect } from "react";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { Button, Text } from "react-native-elements";
import { auth } from "../firebase";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {},
    });
  }, [navigation]);

  const register = () => {
    try {
      if (email && password && name) {
        setState(true);
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((authUser) => {
            authUser.user.updateProfile({
              displayName: name,
            });
          })
          .catch((error) => {
            setState(false);
            alert(error.message);
          });
      } else {
        alert("Fields must not be empty..");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="auto" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create an account
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          autofocus
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <Button
        containerStyle={styles.button}
        title="Register"
        onPress={register}
        type="clear"
        titleStyle={{ color: "white" }}
      />
      <ActivityIndicator size="small" color="#0000ff" animating={state} />
      <View style={{ height: 50 }} />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  button: {
    width: 200,
    marginTop: 30,
    backgroundColor: "black",
  },
  inputContainer: {
    width: 300,
    height: 190,
  },
  input: {
    paddingVertical: 10,
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    marginTop: 10,
  },
});
