import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { connectSocket } from "../../lib/socket";
import { Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getCurrentUser } from "@/app/lib/currentUser";
import { useWindowDimensions } from "react-native";

// import { SendHorizontal } from "lucide-react-native";

export default function Index() {
  const [userMessage, setUserMessage] = useState("");
  // const [receivedMessage, setRecievedMessage] = useState("");

  const { receiverId } = useLocalSearchParams();

  const { height } = useWindowDimensions();

  console.log("messaging user: " + receiverId);

  const [allMessages, setAllMessages] = useState<
    { rec?: string; sent?: string }[]
  >([]);
  useEffect(() => {
    // const testServer = () => {
    //   fetch("http://localhost:3000")
    //     .then((res) => res.json())
    //     .then((data) => console.log(data));
    // };
    // testServer();
    let s = connectSocket();

    s.on("receiveMesssage", (data: string) => {
      const notificationSound = new Audio("/notification.mp3");

      notificationSound.play();

      console.log("Recieved Message" + data);
      setAllMessages((prev) => [...prev, { rec: data }]);
    });
  }, []);

  const sendMessage = () => {
    console.log(userMessage);

    let s = connectSocket();

    s.emit("sendMessage", {
      senderId: s.id, //Connected Client Id
      sender: getCurrentUser(),
      receiver: receiverId,
      userMessage: userMessage,
    });

    setAllMessages((prev) => [...prev, { sent: userMessage }]);

    setUserMessage("");
  };

  return (
    <View
      style={{
        padding: 8,
        backgroundColor: "#E8F3DC",
      }}
    >
      {/* <Text
        style={{
          marginBottom: 0,
        }}
      >
        Hello
      </Text> */}

      <View
        style={{
          padding: 16,
          width: "100%",
          height: height * 0.85,
          backgroundColor: "#E8F3DC",
          borderRadius: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ScrollView>
          {allMessages.map((item, i) => {
            return (
              <View
                key={i}
                style={{
                  padding: 10,
                  backgroundColor: item.rec ? "pink" : "lightblue",
                  borderRadius: 10,
                  marginBottom: 20,
                  width: "75%",

                  alignSelf: item.rec ? "flex-start" : "flex-end",
                }}
              >
                <Text> {item.rec || item.sent}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View
          style={{
            height: 30,
            width: "100%",
            marginBottom: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            onChangeText={setUserMessage}
            value={userMessage}
            style={{
              height: 48,
              width: "90%",
              backgroundColor: "#fff",
              borderRadius: 10,
              // borderColor: "green",
              // borderWidth: 1,
              padding: 24,
            }}
          />

          {/* <Pressable
            onPress={sendMessage}
            style={{
              height: 28,
              width: 48,
              borderWidth: 1,
              marginBottom: 10,
              backgroundColor: "purple",
            }}
          >
            <Text> Send</Text>
          </Pressable> */}
          <View
            style={{
              height: 56,
              width: 56,
              display: "flex",
              justifyContent: "center",
              marginLeft: 10,
            }}
          >
            <Button title="Send" onPress={sendMessage} color={"#01B949"} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
