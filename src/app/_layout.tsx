import { Stack } from "expo-router";
import * as secureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, Platform, Text, useWindowDimensions, View } from "react-native";

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const getUser = async () => {
      if (Platform.OS == "web") {
        setCurrentUser(sessionStorage.getItem("user"));
      } else {
        const user = await secureStore.getItemAsync("user");

        setCurrentUser(user);
      }
    };

    getUser();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: width * 0.97,
              alignSelf: "center",
              height: 64,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                // justifyContent: "space-between",
              }}
            >
              <Image
                source={{
                  // uri: "https://img.freepik.com/premium-vector/chat-logo-design_93835-108.jpg",
                  uri: "https://freepngimg.com/png/159738-photos-speech-chat-icon-free-hd-image",
                }}
                style={{
                  height: 30,
                  width: 30,
                  resizeMode: "contain",
                  borderRadius: 50,
                }}
              />
              <Text
                style={{
                  color: "black",
                  fontSize: 18,
                  paddingLeft: 1,
                  textAlign: "right",
                }}
              >
                My Chat
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Text>{currentUser} </Text>
            </View>
          </View>
        ),
        headerStyle: { backgroundColor: "#A2C963" },
        // headerTitle: "",
      }}
    >
      <Stack.Screen
        name="index"
        // options={{ title: "Login" }}
      />
      <Stack.Screen
        name="chat/[receiverId]/index"
        // options={{ title: "Chat", headerShown: false }}
      />

      <Stack.Screen
        name="users"
        // options={{ title: "Users", headerShown: false }}
      />
    </Stack>
  );
}
