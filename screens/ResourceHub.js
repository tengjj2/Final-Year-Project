// screens/ResourceHub.js

// React hooks
import { useState } from "react";

// React Native components
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

// Helpers
import {
  getCountries,
  getEmergencyContacts,
  getSafetyTips,
  getShelters,
} from "../helpers/resourceHelper";

export default function ResourceHub() {
  const countries = getCountries();

  // Component state
  const [country, setCountry] = useState(countries[0]);
  const [tab, setTab] = useState("emergency");

  // Resource data for current country
  const emergencyContacts = getEmergencyContacts(country);
  const shelters = getShelters(country);
  const safetyTips = getSafetyTips();

  // Function to call a number
  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  // Function to open address in Google Maps
  const openMap = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
    Linking.openURL(url);
  };

  // UI Component
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resource Hub</Text>

      {/* Country Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {countries.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.countryChip, country === c && styles.activeChip]}
            onPress={() => setCountry(c)}
          >
            <Text
              style={[styles.chipText, country === c && styles.activeChipText]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["emergency", "shelters", "tips"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t === "emergency"
                ? "Emergency"
                : t === "shelters"
                  ? "Shelters"
                  : "Safety Tips"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Emergency Contacts */}
      {tab === "emergency" &&
        emergencyContacts.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => callNumber(item.number)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardAction}>📞 {item.number}</Text>
          </TouchableOpacity>
        ))}

      {/* Shelters */}
      {tab === "shelters" &&
        shelters.map((shelter) => (
          <TouchableOpacity
            key={shelter.id}
            style={styles.card}
            onPress={() => openMap(shelter.address)}
          >
            <Text style={styles.cardTitle}>{shelter.name}</Text>
            <Text style={styles.cardText}>{shelter.address}</Text>
            <Text style={styles.mapHint}>📍 Open in Maps</Text>
          </TouchableOpacity>
        ))}

      {/* Safety Tips */}
      {tab === "tips" &&
        safetyTips.map((tip) => (
          <View key={tip.id} style={styles.card}>
            <Text style={styles.cardTitle}>{tip.title}</Text>
            {tip.tips.map((t, i) => (
              <Text key={i} style={styles.bullet}>
                • {t}
              </Text>
            ))}
          </View>
        ))}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },

  /* Country Selector */
  countryChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#dfe6e9",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 15,
  },

  activeChip: {
    backgroundColor: "#0984e3",
  },

  chipText: {
    color: "#2d3436",
    fontWeight: "500",
  },

  activeChipText: {
    color: "#fff",
  },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    marginBottom: 15,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#dcdde1",
    borderRadius: 20,
    marginRight: 8,
  },

  activeTab: {
    backgroundColor: "#6c5ce7",
  },

  tabText: {
    color: "#2d3436",
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* Cards */
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  cardText: {
    fontSize: 14,
    color: "#636e72",
  },

  cardAction: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0984e3",
  },

  mapHint: {
    marginTop: 6,
    color: "#0984e3",
    fontSize: 13,
  },

  bullet: {
    fontSize: 14,
    marginTop: 4,
  },
});