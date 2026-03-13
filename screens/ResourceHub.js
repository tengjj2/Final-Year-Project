import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  getCountries,
  getStates,
  getEmergencyContacts,
  getShelters,
  getDisasterInfo,
} from "../helpers/resourceHelper";

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

  // Load saved location
  useEffect(() => {
    const loadLocation = async () => {
      const savedCountry = await AsyncStorage.getItem("country");
      const savedState = await AsyncStorage.getItem("state");

      if (savedCountry && savedState) {
        setCountry(savedCountry);
        setState(savedState);
      } else {
        setLocationModal(true);
      }
    };
    loadLocation();
  }, []);

  // Save location
  const saveLocation = async (c, s) => {
    await AsyncStorage.setItem("country", c);
    await AsyncStorage.setItem("state", s);
  };

  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const openMap = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
    Linking.openURL(url);
  };

  const openResource = (type) => {
    setResourceType(type);
    setSearchText(""); // reset search on new resource
    setResourceModal(true);
  };

  // Filtering for search
  const filterResource = (item, type) => {
    const lowerSearch = searchText.toLowerCase();
    if (type === "contacts") {
      return item.name.toLowerCase().includes(lowerSearch);
    } else if (type === "shelters") {
      return (
        item.name.toLowerCase().includes(lowerSearch) ||
        item.address.toLowerCase().includes(lowerSearch)
      );
    } else if (type === "disasterInfo") {
      return (
        item.title.toLowerCase().includes(lowerSearch) ||
        item.instructions.some((t) => t.toLowerCase().includes(lowerSearch))
      );
    } else if (type === "disasters") {
      return (
        item.title.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch)
      );
    }
    return true;
  };

  return (
    <View style={styles.container}>
      {/* LOCATION CARD */}
      <TouchableOpacity
        style={styles.locationCard}
        onPress={() => {
          setLocationModal(true);
          setStep("country");
        }}
      >
        <Text style={styles.locationLabel}>Current Location:</Text>
        <Text style={styles.locationText}>
          {country && state ? `${state}, ${country}` : "Select Location"}
        </Text>
      </TouchableOpacity>

      {/* INFO CARD */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="warning-outline" size={28} color="#0f8f84" />
          <Text style={styles.infoTitle}>Stay Prepared</Text>
        </View>
        <Text style={styles.infoText}>
          Access emergency contacts, shelters, safety guides, and disaster
          information quickly.
        </Text>
      </View>

      {/* RESOURCE BUTTONS */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <TouchableOpacity
          style={styles.resourceButton}
          onPress={() => openResource("contacts")}
        >
          <Ionicons name="call-outline" size={28} color="#fff" />
          <View style={styles.resourceText}>
            <Text style={styles.resourceTitle}>Emergency Contacts</Text>
            <Text style={styles.resourceSubtitle}>
              Find help fast when you need it
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourceButton}
          onPress={() => openResource("shelters")}
        >
          <Ionicons name="location-outline" size={28} color="#fff" />
          <View style={styles.resourceText}>
            <Text style={styles.resourceTitle}>Emergency Shelters</Text>
            <Text style={styles.resourceSubtitle}>
              Find nearby safe locations
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourceButton}
          onPress={() => openResource("disasterInfo")}
        >
          <Ionicons name="shield-checkmark-outline" size={28} color="#fff" />
          <View style={styles.resourceText}>
            <Text style={styles.resourceTitle}>Safety Guides</Text>
            <Text style={styles.resourceSubtitle}>
              Step-by-step emergency instructions
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourceButton}
          onPress={() => openResource("disasters")}
        >
          <Ionicons name="information-circle-outline" size={28} color="#fff" />
          <View style={styles.resourceText}>
            <Text style={styles.resourceTitle}>Disaster Information</Text>
            <Text style={styles.resourceSubtitle}>
              Learn about different emergencies
            </Text>
          </View>
        </TouchableOpacity>

        {/* INSTRUCTION CARD */}
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
                style={styles.countryCard}
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
                style={styles.countryCard}
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
              <Ionicons name="arrow-back" size={26} color="#0f8f84" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {/* RESOURCE MODAL */}
      <Modal visible={resourceModal} animationType="slide">
        <View style={styles.modalContainerFull}>
          {/* BACK BUTTON */}
          <TouchableOpacity
            style={styles.backButtonModal}
            onPress={() => setResourceModal(false)}
          >
            <Ionicons name="arrow-back" size={26} color="#0f8f84" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* SEARCH BAR */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* RESOURCE CONTENT */}
          <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
            {/* CONTACTS */}
            {resourceType === "contacts" &&
              emergencyContacts
                .filter((item) => filterResource(item, "contacts"))
                .map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.card}
                    onPress={() => callNumber(item.number)}
                  >
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardAction}>{item.number}</Text>
                  </TouchableOpacity>
                ))}

            {/* SHELTERS */}
            {resourceType === "shelters" &&
              shelters
                .filter((s) => filterResource(s, "shelters"))
                .map((shelter) => (
                  <TouchableOpacity
                    key={shelter.id}
                    style={styles.card}
                    onPress={() => openMap(shelter.address)}
                  >
                    <Text style={styles.cardTitle}>{shelter.name}</Text>
                    <Text style={styles.cardText}>{shelter.address}</Text>
                  </TouchableOpacity>
                ))}

            {/* SAFETY GUIDES (step-by-step instructions) */}
            {resourceType === "disasterInfo" &&
              disasterInfo
                .filter((item) => filterResource(item, "disasterInfo"))
                .map((item) => (
                  <View key={item.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {item.instructions.map((inst, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {inst}
                      </Text>
                    ))}
                  </View>
                ))}

            {/* DISASTER INFORMATION (title + description) */}
            {resourceType === "disasters" &&
              disasterInfo
                .filter((d) => filterResource(d, "disasters"))
                .map((disaster) => (
                  <View key={disaster.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{disaster.title}</Text>
                    <Text style={styles.cardText}>{disaster.description}</Text>
                  </View>
                ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
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
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
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
  resourceTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  resourceSubtitle: { color: "#dff6f4", marginTop: 4 },
  instructionCard: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#e9ecef",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardText: { marginTop: 4, color: "#555" },
  cardAction: { marginTop: 4, color: "#0f8f84", fontWeight: "600" },
  bullet: { marginTop: 4 },
  modalContainer: { flex: 1, padding: 25, backgroundColor: "#f5f6fa" },
  modalContainerFull: { flex: 1, padding: 25, backgroundColor: "#f5f6fa" },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  countryCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#ecf0f1",
    marginTop: 15,
  },
  countryText: { fontSize: 20, fontWeight: "600" },
  backButton: { flexDirection: "row", alignItems: "center", marginTop: 30 },
  backButtonModal: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  backText: { fontSize: 18, marginLeft: 8, color: "#0f8f84" },
  searchInput: {
    marginHorizontal: 20,
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7ed6c9",
    backgroundColor: "#e8f7f5",
    fontSize: 16,
  },
});
