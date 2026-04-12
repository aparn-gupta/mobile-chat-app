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
// import { SendHorizontal } from "lucide-react-native";

export default function Index() {
  const [userMessage, setUserMessage] = useState("");
  // const [receivedMessage, setRecievedMessage] = useState("");

  const { receiverId } = useLocalSearchParams();

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
        padding: 60,
      }}
    >
      <Text
        style={{
          marginBottom: 30,
        }}
      >
        Hello
      </Text>

      <ScrollView
        style={{
          padding: 10,
          width: "100%",
          backgroundColor: "beige",
          marginTop: 100,
          minHeight: 100,
        }}
      >
        {allMessages.map((item, i) => {
          return (
            <View
              key={i}
              style={{
                padding: 10,
                backgroundColor: item.rec ? "pink" : "lightblue",
                borderRadius: 10,
                marginBottom: 20,

                alignSelf: item.rec ? "flex-start" : "flex-end",
              }}
            >
              <Text> {item.rec || item.sent}</Text>
            </View>
          );
        })}

        <View
          style={{
            height: 30,
            width: 200,
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
              height: 56,
              width: 300,
              borderColor: "green",
              borderWidth: 1,
              padding: 10,
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
            <Button title="Send" onPress={sendMessage} color={"purple"} />
          </View>
        </View>
      </ScrollView>
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
