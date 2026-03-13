// screens/SettingsScreen.js
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { resetAllAppData } from "../helpers/settingsHelper";

export default function SettingsScreen() {
  const [resetting, setResetting] = useState(false);

  const handleResetApp = async () => {
    Alert.alert(
      "Danger Zone",
      "Are you sure you want to reset all app data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setResetting(true);
            const success = await resetAllAppData();
            setResetting(false);
            if (success) {
              Alert.alert("Reset Complete", "All app data has been cleared.");
            } else {
              Alert.alert(
                "Error",
                "Failed to reset app data. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        Manage your account, notifications, and app preferences.
      </Text>

      {/* Danger Zone */}
      <View style={styles.dangerZone}>
        <Ionicons
          name="alert-circle"
          size={36}
          color="#d63031"
          style={{ alignSelf: "center", marginBottom: 10 }}
        />
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <Text style={styles.dangerDesc}>
          Reset all app data. This action will permanently clear{" "}
          <Text style={{ fontWeight: "bold" }}>
            points, earned badges, completed tasks and quizzes, rewards, and app preferences
          </Text>
          . Once reset, this data cannot be recovered. Please proceed with
          caution.
        </Text>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetApp}
          disabled={resetting}
        >
          <Text style={styles.resetButtonText}>
            {resetting ? "Resetting..." : "Reset All App Data"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2d3436",
  },
  subtitle: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 20,
  },
  dangerZone: {
    marginTop: 40,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#ffe6e6",
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d63031",
    marginBottom: 8,
    textAlign: "center",
  },
  dangerDesc: {
    fontSize: 14,
    color: "#b71c1c",
    marginBottom: 16,
    textAlign: "center",
  },
  resetButton: {
    backgroundColor: "#d63031",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
