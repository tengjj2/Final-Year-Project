// screens/RewardsScreen.js
import { View, Text, StyleSheet } from "react-native";

export default function RewardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewards Store</Text>
      <Text style={styles.subtitle}>
        Spend your points to unlock rewards or badges!
      </Text>
      {/* TODO: implement list of rewards */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2d3436",
  },
  subtitle: { fontSize: 16, color: "#636e72", textAlign: "center" },
});
