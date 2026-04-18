import { useRouter } from "expo-router";
import * as secureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Button,
  Platform,
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
  const [error, setError] = useState();

  const router = useRouter();

  const { width, height } = useWindowDimensions();

  console.log(username, password);

  const handleRegister = async () => {
    if (!username || !password) {
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

      console.log(result);

      if (!res.ok) throw new Error("Login error");

      connectSocket(username);
      setCurrentUser(username);

      Platform.OS == "web"
        ? sessionStorage.setItem("user", username)
        : secureStore.setItemAsync("user", username);

      router.push("/users");
    } catch (err: any) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <View
      style={{
        padding: 6,
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
        }}
      >
        <Text style={{ color: "red", padding: 16 }}>{error?.toString()}</Text>
        <View style={{ width: "80%", height: "30%", backgroundColor: "" }}>
          <TextInput
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
            style={{
              height: 56,
              width: 300,
              borderColor: "green",
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
              width: 300,
              borderColor: "green",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              margin: 10,
            }}
          />

          <View
            style={{
              width: 300,
              margin: 10,
            }}
          >
            <Button title="Go" onPress={handleRegister} color={"#016F01"} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
