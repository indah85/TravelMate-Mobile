import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

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