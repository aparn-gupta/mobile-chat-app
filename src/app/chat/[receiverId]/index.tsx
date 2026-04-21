import { serverName } from "@/app/login";
import { useLocalSearchParams } from "expo-router";
import * as secureStore from "expo-secure-store";
import { SendHorizontal } from "lucide-react-native";
import { useEffect, useState, useRef, useCallback } from "react";

import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  KeyboardAvoidingView,
  RefreshControl,
} from "react-native";
import { connectSocket } from "../../lib/socket";

// import { SendHorizontal } from "lucide-react-native";

type messageBody = {
  conversationId: string;
  id: string;
  message: string;
  receiver: string;
  sender: string;
  timestamp: string;
};

export default function Index() {
  const [userMessage, setUserMessage] = useState("");
  const { receiverId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const { width, height } = useWindowDimensions();
  const [currentUser, setCurrentUser] = useState("");
  let currentUserRef = useRef(null);
  let socketRef = useRef(null);
  const [allMessages, setAllMessages] = useState([]);

  const formatDate = (dateStr) => {
    const date = new Date(Number(dateStr)); // Current time

    // console.log(date);

    const options = {
      // timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    const formatter = new Intl.DateTimeFormat("en-CA", options);

    return formatter.format(date);
  };

  const handleMessage = (data) => {
    // const notificationSound = new Audio("/notification.mp3");

    // notificationSound.play();

    if (data.sender == receiverId) {
      console.log("Recieved Message" + data);

      setAllMessages((prev) => [
        ...prev,
        { [receiverId]: data.userMessage, timestamp: data.timestamp },
      ]);
    }
  };

  const fetchMessages = async () => {
    try {
      const url = `${serverName}/all_messages?sender=${currentUserRef.current}&receiver=${receiverId}`;

      const res = await fetch(url);
      const result = await res.json();
      console.log(result);

      let messagesArr = [];

      result.messages.forEach((item: messageBody) => {
        messagesArr.push({
          [item.sender]: item.message,
          timestamp: item.timestamp,
        });
      });

      console.log(messagesArr);
      setAllMessages(messagesArr);

      // setAllMessages(result.messages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let s;

    const getUser = async () => {
      if (Platform.OS == "web") {
        setCurrentUser(sessionStorage.getItem("user"));
        currentUserRef.current = sessionStorage.getItem("user");
      } else {
        const user = await secureStore.getItemAsync("user");
        currentUserRef.current = user;

        setCurrentUser(user);
      }

      if (currentUserRef.current) {
        fetchMessages();
        socketRef.current = connectSocket(currentUserRef.current);
        s = socketRef.current;

        if (s) {
          s.on("receiveMesssage", handleMessage);

          s.on("disconnect", () => {
            console.log("socket disconnected");
          });

          s.on("reconnect_attempt", () => {
            console.log("reconnecting...");
          });
        }
      }
    };

    getUser();

    return () => {
      socketRef.current?.off("receiveMesssage");
    };
  }, []);

  // console.log("messaging user: " + receiverId);

  console.log(allMessages);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const sendMessage = () => {
    // console.log(userMessage, currentUser);
    // console.log(getCurrentUser());

    console.log({
      senderId: socketRef.current.id, //Connected Client Id
      sender: currentUserRef.current,
      receiver: receiverId,
      userMessage: userMessage,
      timestamp: Date.now().toString(),
    });

    if (!userMessage.trim()) return;

    socketRef.current?.emit("sendMessage", {
      senderId: socketRef.current.id, //Connected Client Id
      sender: currentUserRef.current,
      receiver: receiverId,
      userMessage: userMessage,
      timestamp: Date.now().toString(),
    });
    console.log("socket message sent");

    setAllMessages((prev) => [
      ...prev,
      {
        [currentUserRef.current]: userMessage,
        timestamp: Date.now().toString(),
      },
    ]);

    setUserMessage("");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: 8,
          backgroundColor: "#E8F3DC",
          // height: height,
          flex: 1,
        }}
      >
        {/* <Text
        style={{
          marginBottom: 0,
          textAlign: "right",
        }}
      >
        {currentUser}
      </Text> */}

        <View
          style={{
            padding: 16,
            width: "100%",
            // height: height * 0.88,
            backgroundColor: "#E8F3DC",
            // backgroundColor: "red",
            borderRadius: 20,
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <ScrollView
            // ref={(ref) => {
            //   this.scrollView = ref;
            // }}
            // onContentSizeChange={() =>
            //   this.scrollView.scrollToEnd({ animated: true })
            // }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            // style={{ height: height * 70 }}
            style={{ flex: 1 }}
          >
            {allMessages?.length ? (
              allMessages.map((item, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      padding: 10,
                      backgroundColor: item[receiverId] ? "pink" : "lightblue",
                      borderRadius: 10,
                      marginBottom: 20,
                      width: "75%",
                      flex: 1,

                      alignSelf: item[receiverId] ? "flex-start" : "flex-end",
                    }}
                  >
                    <Text>
                      {" "}
                      {item[receiverId] || item[currentUserRef.current]}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text style={{ fontSize: 10 }}>
                        {formatDate(item.timestamp)}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={{ flex: 1 }}>
                <Text>No messages</Text>
              </View>
            )}
          </ScrollView>

          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,

              display: "flex",
              flexDirection: "row",
              // justifyContent: "space-between",
              flex: 1,
              width: width,
              // backgroundColor: "red",
              alignSelf: "center",
              position: "fixed",
              bottom: 12,
            }}
          >
            <TextInput
              onChangeText={setUserMessage}
              value={userMessage}
              style={{
                height: 48,
                flex: 1,
                width: 400,
                backgroundColor: "#fff",
                borderRadius: 10,
                // borderColor: "green",
                // borderWidth: 1,
                paddingVertical: 5,
                paddingHorizontal: 10,
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
                height: 24,

                marginLeft: 2,
                width: 24,
                flex: 1,
              }}
            >
              <Pressable
                onPress={sendMessage}
                style={{
                  height: 24,
                  width: 24,
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <SendHorizontal color={"#175E18"} size={36} fill={"#01B949"} />
              </Pressable>
              {/* <Button title="Send" onPress={sendMessage} color={"#01B949"} /> */}
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
