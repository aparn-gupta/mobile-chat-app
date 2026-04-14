import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { connectSocket } from "./lib/socket";
import { useRouter } from "expo-router";
import { setCurrentUser } from "./lib/currentUser";

export const serverName = "http://localhost:3001";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const router = useRouter();

  console.log(username, password);

  const handleRegister = async () => {
    try {
      const url = `${serverName}/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Login error");

      connectSocket(username);
      setCurrentUser(username);
      router.push("/users");
    } catch (err: any) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <View
      style={{
        borderWidth: 1,
        padding: 80,
      }}
    >
      <Text style={{ color: "red", padding: 16 }}>{error?.toString()}</Text>
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
        <Button title="Go" onPress={handleRegister} />
      </View>
    </View>
  );
};

export default Login;
