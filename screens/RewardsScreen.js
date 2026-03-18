// screens/RewardsScreen.js
import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getUserProgress, addPoints } from "../helpers/gamification";
import {
  scaleFont,
  loadFontSize,
  updateFontScale,
} from "../helpers/fontHelper";
import {
  defaultTheme,
  darkBlueTheme,
  orangeTheme,
  pinkTheme,
  purchaseTheme,
  loadPurchasedThemes,
} from "../helpers/theme";
import { ThemeContext } from "../helpers/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigation from "../helpers/bottomNavigation";

export default function RewardsScreen() {
  const [points, setPoints] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [purchasedThemes, setPurchasedThemes] = useState([]);

  const THEMES_FOR_SALE = [darkBlueTheme, orangeTheme, pinkTheme];
  const THEME_COST = 50;

  // Access app-wide theme from context
  const { theme: currentTheme, setTheme: setAppTheme /*, resetFlag*/ } =
    useContext(ThemeContext);

  // Load user points, purchased themes, and font only once on mount
  useEffect(() => {
    const init = async () => {
      const size = await loadFontSize();
      updateFontScale(size);
      setFontLoaded(true);

      const userProgress = await getUserProgress();
      setPoints(userProgress.points);

      let purchased = await loadPurchasedThemes();

      // If no themes purchased yet, ensure array saved
      if (!purchased || purchased.length === 0) {
        purchased = [];
        await AsyncStorage.setItem(
          "purchasedThemes",
          JSON.stringify(purchased),
        );
      }

      setPurchasedThemes(purchased);
    };
    init();
  }, []);

  // Redeem a theme
  const handlePurchaseTheme = async (theme) => {
    if (points < THEME_COST) {
      Alert.alert(
        "Not enough points",
        `You need ${THEME_COST} points to redeem this theme.`,
      );
      return;
    }

    await addPoints(-THEME_COST);
    setPoints(points - THEME_COST);

    await purchaseTheme(theme.name);
    setPurchasedThemes([...purchasedThemes, theme.name]);

    await setAppTheme(theme);

    Alert.alert("Success!", `${theme.name} theme redeemed and applied.`);
  };

  // Apply a theme
  const handleSelectTheme = async (theme) => {
    await setAppTheme(theme);
    Alert.alert("Theme Applied!", `${theme.name} theme is now active.`);
  };

  if (!fontLoaded) return null;

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={[styles.container, { backgroundColor: "#f5f6fa" }]}
        contentContainerStyle={styles.content}
      >
        {/* Points Display */}
        <Text
          style={[styles.title, { fontSize: scaleFont(22), color: "#2d3436" }]}
        >
          Your Points
        </Text>
        <View
          style={[
            styles.pointsBox,
            {
              backgroundColor: currentTheme.accent,
              borderColor: currentTheme.secondary,
            },
          ]}
        >
          <Text
            style={[
              styles.pointsText,
              { fontSize: scaleFont(18), color: currentTheme.primary },
            ]}
          >
            {points} points
          </Text>
        </View>

        {/* Available Rewards */}
        <Text style={[styles.sectionTitle, { color: "#2d3436" }]}>
          Available Rewards
        </Text>

        {THEMES_FOR_SALE.map((theme) => (
          <View key={theme.name} style={styles.rewardItem}>
            <View
              style={[styles.colorCircle, { backgroundColor: theme.primary }]}
            />

            <Text style={[styles.rewardText, { color: "#2d3436" }]}>
              {theme.name} Theme ({THEME_COST} points)
            </Text>

            {!purchasedThemes.includes(theme.name) ? (
              <TouchableOpacity
                style={[
                  styles.rewardButton,
                  { backgroundColor: currentTheme.primary },
                ]}
                onPress={() => handlePurchaseTheme(theme)}
              >
                <Text style={styles.rewardButtonText}>Redeem</Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  color: "#636e72",
                  marginLeft: 10,
                  fontSize: scaleFont(14),
                }}
              >
                Purchased
              </Text>
            )}
          </View>
        ))}

        {/* Select/Apply Purchased Themes */}
        <Text style={[styles.sectionTitle, { color: "#2d3436" }]}>
          Select Theme
        </Text>

        <View style={styles.selectContainer}>
          {/* Default always available */}
          <TouchableOpacity
            style={[
              styles.rewardButton,
              { backgroundColor: defaultTheme.primary },
            ]}
            onPress={() => handleSelectTheme(defaultTheme)}
          >
            <Text style={styles.rewardButtonText}>Teal (Default)</Text>
          </TouchableOpacity>

          {/* Dynamically show purchased themes */}
          {THEMES_FOR_SALE.map(
            (theme) =>
              purchasedThemes.includes(theme.name) && (
                <TouchableOpacity
                  key={theme.name}
                  style={[
                    styles.rewardButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={() => handleSelectTheme(theme)}
                >
                  <Text style={styles.rewardButtonText}>{theme.name}</Text>
                </TouchableOpacity>
              ),
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar (no tab highlighted) */}
      <BottomNavigation activeKey="" />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, },
  title: { fontWeight: "bold", marginBottom: 20 },
  pointsBox: {
    padding: 30,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  pointsText: { fontWeight: "bold" },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    fontSize: scaleFont(18),
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  rewardText: {
    fontSize: scaleFont(16),
    flex: 1,
    flexShrink: 1,
  },
  rewardButton: {
    paddingVertical: 10,
    borderRadius: 12,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: scaleFont(14),
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectContainer: {
    flexDirection: "column",
    gap: 10,
  },
});
