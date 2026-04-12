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
    <View>
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
      <Button title="Go" onPress={handleRegister} />
    </View>
  );
};

export default Login;
