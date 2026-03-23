// helpers/bottomNavigation.js

// Imports for navigation and UI
import React, { useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "./themeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Tab configuration (used to render navigation buttons)
const TAB_ITEMS = [
  { key: "PreparednessZone", icon: "school-outline", label: "Preparedness" },
  { key: "ResourceHub", icon: "library-outline", label: "Resource Hub" },
  { key: "Home", icon: "home-outline", label: "Home" },
  { key: "EmergencyMode", icon: "warning-outline", label: "Emergency" },
  { key: "Settings", icon: "settings-outline", label: "Settings" },
];

// Bottom navigation component
export default function BottomNavigation({ activeKey }) {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.primary, paddingBottom: insets.bottom || 10 },
      ]}
    >
      {TAB_ITEMS.map((item) => {
        const isActive = activeKey === item.key;

        // Special styling for the Home Button (center button)
        if (item.key === "Home") {
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.homeButton,
                {
                  backgroundColor: isActive ? "#fff" : theme.primary,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isActive ? 0.3 : 0,
                  shadowRadius: 3,
                  elevation: isActive ? 5 : 0,
                },
              ]}
              onPress={() => navigation.navigate(item.key)}
            >
              <Ionicons
                name={item.icon}
                size={isActive ? 32 : 28}
                color={isActive ? theme.primary : "#fff"}
              />
            </TouchableOpacity>
          );
        }

        // Regular navigation buttons
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tabButton}
            onPress={() => navigation.navigate(item.key)}
          >
            <View
              // Show white background "bubble" when active
              style={[
                isActive && {
                  backgroundColor: "#fff",
                  borderRadius: 25,
                  padding: 6,
                  marginBottom: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={isActive ? 40 : 24}
                color={isActive ? theme.primary : "#fff"}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                  fontWeight: isActive ? "bold" : "600",
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 105,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },

  homeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
});
