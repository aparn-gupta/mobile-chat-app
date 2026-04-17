import { useRouter } from "expo-router";
import * as secureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { serverName } from "./login";

// import "./app.css";

type Users = {
  username: string;
  id: number;
  email: string;
};

const Users = () => {
  const [usersList, setUsersList] = useState<Users[]>([]);

  const url = `${serverName}/list`;

  let currentUser =
    Platform.OS == "web"
      ? sessionStorage.getItem("user")
      : secureStore.getItemAsync("user");

  const router = useRouter();

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.items);
        setUsersList(data.items);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <View>
      <View
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Text style={{ color: "#015C00", fontWeight: 600 }}>
          {/* {getCurrentUser()}{" "} */}
          {currentUser}
        </Text>
      </View>

      <ScrollView style={{ padding: 5, borderRadius: 16 }}>
        {usersList.length ? (
          usersList.map((item, i) => {
            return (
              <Pressable
                key={i}
                className="user"
                style={({ pressed }) => ({
                  height: 48,
                  color: pressed ? "#fff" : "black",

                  backgroundColor: pressed ? "#82B640" : "#E8F3DC",
                  width: "100%",
                  borderColor: "#fff",
                  borderWidth: 1,
                  display: "flex",
                  justifyContent: "center",
                  padding: 6,
                })}
              >
                <Text onPress={() => router.push(`/chat/${item.username}`)}>
                  {item.username}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <View>
            <Text>No users found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Users;
