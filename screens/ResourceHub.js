// screens/ResourceHub.js

import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import {
  getCountries,
  getStates,
  getEmergencyContacts,
  getShelters,
  getDisasterInfo,
  loadSavedLocation,
  saveLocation,
  callNumber,
  openMap,
  filterResource,
} from "../helpers/resourceHelper";

import { ThemeContext } from "../helpers/themeContext";
import BottomNavigation from "../helpers/bottomNavigation";

const RESOURCE_OPTIONS = [
  {
    type: "contacts",
    icon: "call-outline",
    title: "Emergency Contacts",
    sub: "Find help fast",
  },
  {
    type: "shelters",
    icon: "location-outline",
    title: "Emergency Shelters",
    sub: "Find nearby safe locations",
  },
  {
    type: "disasterInfo",
    icon: "shield-checkmark-outline",
    title: "Safety Guides",
    sub: "Step-by-step instructions",
  },
  {
    type: "disasters",
    icon: "information-circle-outline",
    title: "Disaster Information",
    sub: "Learn about emergencies",
  },
];

export default function ResourceHub() {
  const countries = getCountries();

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);

  const [locationModal, setLocationModal] = useState(false);
  const [resourceModal, setResourceModal] = useState(false);

  const [step, setStep] = useState("country");
  const [resourceType, setResourceType] = useState(null);

  const [searchText, setSearchText] = useState("");

  const states = getStates(country);
  const emergencyContacts = getEmergencyContacts(country);
  const shelters = getShelters(country, state);
  const disasterInfo = getDisasterInfo();

  const { theme } = useContext(ThemeContext);

  // Load saved location
  useEffect(() => {
    const loadLocation = async () => {
      const { country, state } = await loadSavedLocation();

      if (country && state) {
        setCountry(country);
        setState(state);
      } else {
        setLocationModal(true);
      }
    };

    loadLocation();
  }, []);

  const openResource = (type) => {
    setResourceType(type);
    setSearchText("");
    setResourceModal(true);
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollingContainer}>
        {/* LOCATION */}
        <TouchableOpacity
          style={[
            styles.locationCard,
            { backgroundColor: theme.accent, borderColor: theme.secondary },
          ]}
          onPress={() => {
            setLocationModal(true);
            setStep("country");
          }}
        >
          <Text style={styles.locationLabel}>Current Location:</Text>
          <Text style={[styles.locationText, { color: theme.primary }]}>
            {country && state ? `${state}, ${country}` : "Select Location"}
          </Text>
        </TouchableOpacity>

        {/* INFO */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.accent, borderColor: theme.secondary },
          ]}
        >
          <View style={styles.infoRow}>
            <Ionicons name="warning-outline" size={28} color={theme.primary} />
            <Text style={styles.infoTitle}>Stay Prepared</Text>
          </View>
          <Text style={styles.infoText}>
            Access emergency contacts, shelters, safety guides, and disaster
            information quickly.
          </Text>
        </View>

        {/* BUTTONS */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {RESOURCE_OPTIONS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.resourceButton,
                { backgroundColor: theme.primary },
              ]}
              onPress={() => openResource(item.type)}
            >
              <Ionicons name={item.icon} size={28} color="#fff" />
              <View style={styles.resourceText}>
                <Text style={styles.resourceTitle}>{item.title}</Text>
                <Text style={styles.resourceSubtitle}>{item.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>
              Tap any button above to view emergency resources
            </Text>
          </View>
        </ScrollView>

        {/* LOCATION MODAL */}
        <Modal visible={locationModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {step === "country" ? "Select Country" : "Select Area"}
            </Text>

            {step === "country" &&
              countries.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.countryCard,
                    { backgroundColor: theme.accent },
                  ]}
                  onPress={() => {
                    setCountry(c);
                    setStep("state");
                  }}
                >
                  <Text style={styles.countryText}>{c}</Text>
                </TouchableOpacity>
              ))}

            {step === "state" &&
              states.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.countryCard,
                    { backgroundColor: theme.accent },
                  ]}
                  onPress={() => {
                    setState(s);
                    saveLocation(country, s);
                    setLocationModal(false);
                  }}
                >
                  <Text style={styles.countryText}>{s}</Text>
                </TouchableOpacity>
              ))}

            {step === "state" && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep("country")}
              >
                <Ionicons name="arrow-back" size={26} color={theme.primary} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>

        {/* RESOURCE MODAL */}
        <Modal visible={resourceModal} animationType="slide">
          <View style={styles.modalContainerFull}>
            <TouchableOpacity
              style={styles.backButtonModal}
              onPress={() => setResourceModal(false)}
            >
              <Ionicons name="arrow-back" size={26} color={theme.primary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: theme.accent,
                  borderColor: theme.secondary,
                  color: theme.text,
                },
              ]}
              placeholder=" Search..."
              value={searchText}
              onChangeText={setSearchText}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {resourceType === "contacts" &&
                emergencyContacts
                  .filter((i) => filterResource(i, "contacts", searchText))
                  .map((i, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.card,
                        {
                          backgroundColor: theme.accent,
                          borderColor: theme.secondary,
                        },
                      ]}
                      onPress={() => callNumber(i.number)}
                    >
                      <Text style={styles.cardTitle}>{i.name}</Text>
                      <Text
                        style={[styles.cardAction, { color: theme.primary }]}
                      >
                        {i.number}
                      </Text>
                    </TouchableOpacity>
                  ))}

              {resourceType === "shelters" &&
                shelters
                  .filter((s) => filterResource(s, "shelters", searchText))
                  .map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.card,
                        {
                          backgroundColor: theme.accent,
                          borderColor: theme.secondary,
                        },
                      ]}
                      onPress={() => openMap(s.address)}
                    >
                      <Text style={styles.cardTitle}>{s.name}</Text>
                      <Text style={styles.cardText}>{s.address}</Text>
                    </TouchableOpacity>
                  ))}

              {resourceType === "disasterInfo" &&
                disasterInfo
                  .filter((d) => filterResource(d, "disasterInfo", searchText))
                  .map((d) => (
                    <View
                      key={d.id}
                      style={[
                        styles.card,
                        {
                          backgroundColor: theme.accent,
                          borderColor: theme.secondary,
                        },
                      ]}
                    >
                      <Text style={styles.cardTitle}>{d.title}</Text>
                      {d.instructions.map((inst, i) => (
                        <Text key={i} style={styles.bullet}>
                          - {inst}
                        </Text>
                      ))}
                    </View>
                  ))}

              {resourceType === "disasters" &&
                disasterInfo
                  .filter((d) => filterResource(d, "disasters", searchText))
                  .map((d) => (
                    <View
                      key={d.id}
                      style={[
                        styles.card,
                        {
                          backgroundColor: theme.accent,
                          borderColor: theme.secondary,
                        },
                      ]}
                    >
                      <Text style={styles.cardTitle}>{d.title}</Text>
                      <Text style={styles.cardText}>{d.description}</Text>
                    </View>
                  ))}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>

      {/* Bottom Navigation Bar (sticky) */}
      <BottomNavigation activeKey="ResourceHub" />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  scrollingContainer: {
    padding: 10,
    paddingBottom: 120,
  },

  scrollContainer: { paddingBottom: 30 },

  locationCard: {
    margin: 20,
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#7ed6c9",
    backgroundColor: "#e8f7f5",
    alignItems: "center",
  },
  locationLabel: { fontSize: 15 },
  locationText: { fontSize: 20, fontWeight: "bold", color: "#0f8f84" },

  infoCard: {
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#19b2a5",
    backgroundColor: "#f3fbfa",
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoTitle: { fontSize: 18, marginLeft: 10, fontWeight: "bold" },
  infoText: { fontSize: 15, color: "#444" },

  resourceButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#0f8f84",
  },
  resourceText: { marginLeft: 15 },
  resourceTitle: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  resourceSubtitle: { fontSize: 14, color: "#dff6f4", marginTop: 4 },

  instructionCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#e9ecef",
    alignItems: "center",
  },
  instructionText: { fontSize: 16, textAlign: "center" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardText: { fontSize: 14, marginTop: 4 },
  cardAction: {
    fontSize: 14,
    marginTop: 4,
    color: "#0f8f84",
    fontWeight: "600",
  },
  bullet: { fontSize: 14, marginTop: 4 },

  modalContainer: { flex: 1, padding: 25, backgroundColor: "#f5f6fa" },
  modalContainerFull: { flex: 1, padding: 25, backgroundColor: "#f5f6fa" },

  modalTitle: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },

  countryCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#ecf0f1",
    marginTop: 15,
  },
  countryText: { fontSize: 20, fontWeight: "600" },

  backButton: { flexDirection: "row", marginTop: 30 },
  backButtonModal: { flexDirection: "row", marginBottom: 15 },
  backText: { fontSize: 18, marginLeft: 8 },

  searchInput: {
    margin: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7ed6c9",
    fontSize: 16,
  },
});
