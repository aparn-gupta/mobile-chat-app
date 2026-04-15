import { Stack } from "expo-router";
import { Text, Image, View } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
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
                borderRadius: "50%",
              }}
            />
            <Text style={{ color: "black", fontSize: 18, paddingLeft: 8 }}>
              My Chat
            </Text>
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
