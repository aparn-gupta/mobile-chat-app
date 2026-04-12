import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";
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
    <ScrollView>
      {usersList.map((item, i) => {
        return (
          <View
            key={i}
            className="user"
            style={{
              height: 48,
              backgroundColor: "pink",
              width: "100%",
              borderColor: "#fff",
              borderWidth: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Text
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: { receiverId: item.id },
                })
              }
            >
              {item.username}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Users;
