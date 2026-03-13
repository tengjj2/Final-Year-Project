// App.js

// React Navigation Imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
    // Manage the navigation state and linking
    <NavigationContainer>
      {/* Home Screen */}
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0f8f84",
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
          options={{ title: "Disaster Preparedness" }}
        />
        {/* Preparedness Zone Screen */}
        <Stack.Screen
          name="PreparednessZone"
          component={PreparednessZone}
          options={{ title: "Preparedness Zone" }}
        />
        {/* Task / Quiz Screen */}
        <Stack.Screen
          name="TaskScreen"
          component={TaskScreen}
          options={{ title: "Task / Quiz" }}
        />
        {/* Emergency Mode Screen */}
        <Stack.Screen
          name="EmergencyMode"
          component={EmergencyMode}
          options={{ title: "Emergency Mode" }}
        />
        {/* Resource Hub Screen */}
        <Stack.Screen
          name="ResourceHub"
          component={ResourceHub}
          options={{ title: "Resource Hub" }}
        />

        {/* Rewards Screen */}
        <Stack.Screen
          name="Rewards"
          component={RewardsScreen}
          options={{ title: "Rewards Store" }}
        />

        {/* Settings Screen */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
