import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { connectSocket } from "./lib/socket";
import { useRouter } from "expo-router";
import { setCurrentUser } from "./lib/currentUser";

const Login = () => {
  const [userName, setUsername] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    connectSocket(userName);
    setCurrentUser(userName);
    router.push("/users");
  };

  return (
    <View
      style={{
        borderWidth: 1,
        padding: 80,
      }}
    >
      <TextInput
        onChangeText={setUsername}
        value={userName}
        style={{
          height: 56,
          width: 300,
          borderColor: "green",
          borderWidth: 1,
          padding: 10,
        }}
      />
      <View
        style={{
          width: 300,
        }}
      >
        <Button title="Go" onPress={handleRegister} />
      </View>
    </View>
  );
};

export default Login;
