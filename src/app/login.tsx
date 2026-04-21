import { useRouter } from "expo-router";
import * as secureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { setCurrentUser } from "./lib/currentUser";
import { connectSocket } from "./lib/socket";

// export const serverName = "http://localhost:3000";
export const serverName =
  "https://mychat-app-aparnas-projects-5f64a891.vercel.app";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const { width, height } = useWindowDimensions();

  console.log(username, password);

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Username and password are required!");
      // alert("Username and Password are required");
    }
    try {
      const url = `${serverName}/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error("Login error");
      console.log(result);

      connectSocket(username);
      setCurrentUser(username);

      Platform.OS == "web"
        ? sessionStorage.setItem("user", username)
        : await secureStore.setItemAsync("user", username);

      router.push("/users");
    } catch (err: any) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: height,
        width: width,
      }}
    >
      <View
        style={{
          padding: 6,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: "",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: height,
            width: width,
            flex: 1,
          }}
        >
          <View
            style={{
              width: "70%",
              backgroundColor: "",
              flex: 1,
            }}
          >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-start",
                flex: 1,
              }}
            >
              <Text style={{ color: "red", padding: 16 }}>
                {error?.toString()}
              </Text>
              <TextInput
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
                style={{
                  height: 56,
                  width: "100%",
                  borderColor: "green",
                  alignSelf: "center",
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 8,
                  margin: 10,
                }}
              />

              <TextInput
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                style={{
                  height: 56,
                  width: "100%",
                  borderColor: "green",
                  alignSelf: "center",
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 8,
                  margin: 10,
                }}
              />

              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  margin: 10,
                  flex: 1,
                }}
              >
                <Button title="Go" onPress={handleRegister} color={"#016F01"} />
              </View>
            </ScrollView>
            {/* </TouchableWithoutFeedback> */}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
