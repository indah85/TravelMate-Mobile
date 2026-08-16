import { Tabs } from "expo-router";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkAuthentication = async () => {
        const token =
          await SecureStore.getItemAsync("token");

        setIsAuthenticated(!!token);
      };

      checkAuthentication();
    }, [])
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#157791",
        tabBarInactiveTintColor: "#94a3b8",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >

      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={26}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />

      {/* EXPLORE */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Jelajah",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={26}
              name="magnifyingglass"
              color={color}
            />
          ),
        }}
      />

      {/* FAVORITE */}
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorit",
          href: isAuthenticated
            ? "/(tabs)/favorite"
            : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={26}
              name="heart.fill"
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={26}
              name="person.fill"
              color={color}
            />
          ),
        }}
      />

    </Tabs>
  );
}