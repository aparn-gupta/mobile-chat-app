import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { getCurrentUser } from "./lib/currentUser";

// import "./app.css";

type Users = {
  username: string;
  id: number;
  email: string;
};

const Users = () => {
  const [usersList, setUsersList] = useState<Users[]>([]);

  const url = `http://localhost:3001/list`;

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
          {getCurrentUser()}{" "}
        </Text>
      </View>

      <ScrollView style={{ padding: 5, borderRadius: 16 }}>
        {usersList.map((item, i) => {
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
        })}
      </ScrollView>
    </View>
  );
};

export default Users;
