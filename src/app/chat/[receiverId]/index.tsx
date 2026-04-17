import { serverName } from "@/app/login";
import { useLocalSearchParams } from "expo-router";
import * as secureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { connectSocket } from "../../lib/socket";

// import { SendHorizontal } from "lucide-react-native";

export default function Index() {
  const [userMessage, setUserMessage] = useState("");
  // const [receivedMessage, setRecievedMessage] = useState("");

  const { receiverId } = useLocalSearchParams();

  const { height } = useWindowDimensions();

  let currentUser =
    Platform.OS == "web"
      ? sessionStorage.getItem("user")
      : secureStore.getItemAsync("user");

  console.log("messaging user: " + receiverId);

  const [allMessages, setAllMessages] = useState<
    { rec?: string; sent?: string }[]
  >([]);

  const fetchMessages = async () => {
    try {
      const url = `${serverName}/all_messages?sender=${currentUser}&receiver=${receiverId}`;

      const res = await fetch(url);
      const result = await res.json();
      console.log(result);
      // setAllMessages(result.messages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // const currentUser = getCurrentUser();

    let s = connectSocket(currentUser);

    s.on("disconnect", () => {
      console.log("socket disconnected");
      connectSocket(currentUser);
    });

    s.on("receiveMesssage", (data: string) => {
      const notificationSound = new Audio("/notification.mp3");

      notificationSound.play();

      console.log("Recieved Message" + data);
      setAllMessages((prev) => [...prev, { rec: data }]);
    });
  }, []);

  const sendMessage = () => {
    console.log(userMessage, currentUser);
    // console.log(getCurrentUser());

    let s = connectSocket();

    s.emit("sendMessage", {
      senderId: s.id, //Connected Client Id
      sender: currentUser,
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
      <Text
        style={{
          marginBottom: 0,
          textAlign: "right",
        }}
      >
        {currentUser}
      </Text>

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
          {allMessages?.length ? (
            allMessages.map((item, i) => {
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
            })
          ) : (
            <View>
              <Text>No messages</Text>
            </View>
          )}
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
