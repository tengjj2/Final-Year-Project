// App.js

// Import i18n
import "./i18n";
import { useTranslation } from "react-i18next";
import React, { useContext } from "react";

// React Navigation Imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Theme Context
import { ThemeProvider, ThemeContext } from "./helpers/themeContext";

// Screens
import EmergencyMode from "./screens/EmergencyMode";
import HomeScreen from "./screens/HomeScreen";
import PreparednessZone from "./screens/PreparednessZone";
import ResourceHub from "./screens/ResourceHub";
import TaskScreen from "./screens/TaskScreen";
import RewardsScreen from "./screens/RewardsScreen";
import SettingsScreen from "./screens/SettingsScreen";

// Create the stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <MainStack />
    </ThemeProvider>
  );
}

// Separate component so we can consume ThemeContext
function MainStack() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext); // Get current theme from context

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.primary, // Stack header reflects current theme
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: t("homeTitle") }}
        />
        <Stack.Screen
          name="PreparednessZone"
          component={PreparednessZone}
          options={{ title: t("preparednessZoneTitle") }}
        />
        <Stack.Screen
          name="TaskScreen"
          component={TaskScreen}
          options={{ title: t("taskScreenTitle") }}
        />
        <Stack.Screen
          name="EmergencyMode"
          component={EmergencyMode}
          options={{ title: t("emergencyModeTitle") }}
        />
        <Stack.Screen
          name="ResourceHub"
          component={ResourceHub}
          options={{ title: t("resourceHubTitle") }}
        />
        <Stack.Screen
          name="Rewards"
          component={RewardsScreen}
          options={{ title: t("rewardsTitle") }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: t("settingsTitle") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
