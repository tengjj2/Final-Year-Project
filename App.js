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

// Create the stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // Manage the navigation state and linking
    <NavigationContainer>
      {/* Home Screen */}
      <Stack.Navigator initialRouteName="Home">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
