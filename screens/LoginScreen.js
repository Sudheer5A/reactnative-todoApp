import React, { useLayoutEffect } from "react";
import { useEffect, useCallback } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button, Image, Text as HeadText } from "react-native-elements";
import { auth } from "../firebase";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import img from "../assets/20945628.jpg";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const signIn = () => {
    try {
      if (email) {
        setState(true);
        auth.signInWithEmailAndPassword(email, password).catch((error) => {
          setState(false);
          alert(error.message);
        });
      } else {
        alert("Email must be filled");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <HeadText h2 style={{ marginBottom: 10 }}>
        Welcome
      </HeadText>
      <KeyboardAvoidingView behavior="padding" style={{ alignItems: "center" }}>
        <StatusBar type="auto" />
        <Image source={img} style={{ width: 200, height: 200 }} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoFocus
            type="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            type="password"
            secureTextEntry
          />
          <Button
            containerStyle={styles.loginButton}
            title="Sign in"
            onPress={signIn}
            type="clear"
            titleStyle={{ color: "white" }}
          />
          <Button
            style={styles.button}
            title="Register"
            onPress={() => navigation.navigate("Register")}
            type="clear"
            titleStyle={{ color: "gray" }}
          />
          <ActivityIndicator size="small" color="#0000ff" animating={state} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
    height: 230,
  },
  input: {
    paddingVertical: 10,
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    marginTop: 10,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "black",
  },
  button: {
    width: 200,
    marginTop: 20,
  },
});
