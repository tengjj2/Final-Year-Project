// App.js

// Load i18n configuration
import "./i18n";

// React and hooks
import { useTranslation } from "react-i18next";
import React, { useContext } from "react";

// React Navigation
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

// Root component of the app
export default function App() {
  return (
    <ThemeProvider>
      <MainStack />
    </ThemeProvider>
  );
}

// Main navigation stack
function MainStack() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.primary,
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: t("homeTitle") }}
        />
        {/* Preparedness Zone */}
        <Stack.Screen
          name="PreparednessZone"
          component={PreparednessZone}
          options={{ title: t("preparednessZoneTitle") }}
        />
        {/* Task/Quiz Screen */}
        <Stack.Screen
          name="TaskScreen"
          component={TaskScreen}
          options={{ title: t("taskScreenTitle") }}
        />
        {/* Emergency Mode */}
        <Stack.Screen
          name="EmergencyMode"
          component={EmergencyMode}
          options={{ title: t("emergencyModeTitle") }}
        />
        {/* Resource Hub */}
        <Stack.Screen
          name="ResourceHub"
          component={ResourceHub}
          options={{ title: t("resourceHubTitle") }}
        />
        {/* Rewards Screen */}
        <Stack.Screen
          name="Rewards"
          component={RewardsScreen}
          options={{ title: t("rewardsTitle") }}
        />
        {/* Settings */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: t("settingsTitle") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
