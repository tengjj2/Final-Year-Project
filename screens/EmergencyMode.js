// screens/EmergencyMode.js

import { useState, useCallback, useEffect, useContext } from "react";
import { ThemeContext } from "../helpers/themeContext";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomNavigation from "../helpers/bottomNavigation";

import {
  allowedCountries,
  getCurrentEmergency,
  clearCurrentEmergency,
  getEmergencyInstructions,
  simulateEmergencyLogic,
  getEmergencyContactsSafe,
} from "../helpers/emergencyHelper";

import { getDeviceCountry } from "../helpers/locationHelper";
import {
  loadFontSize,
  updateFontScale,
  scaleFont,
} from "../helpers/fontHelper";

export default function EmergencyMode() {
  // State variables
  const [deviceCountry, setDeviceCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationTimeout, setLocationTimeout] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(getCurrentEmergency());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContacts, setModalContacts] = useState([]);
  const [fontSize, setFontSize] = useState("medium");

  const { theme: currentTheme } = useContext(ThemeContext);

  // Load font size from storage on mount
  useEffect(() => {
    const fetchFontSize = async () => {
      const savedSize = await loadFontSize();
      setFontSize(savedSize);
      updateFontScale(savedSize);
    };
    fetchFontSize();
  }, []);

  // Update current location on focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchLocation = async () => {
        setLoadingLocation(true);
        setLocationTimeout(false);

        const country = await getDeviceCountry(10000);
        if (!isActive) return;

        if (country) setDeviceCountry(country);
        else {
          setDeviceCountry(null);
          setLocationTimeout(true);
        }

        setLoadingLocation(false);
      };
      fetchLocation();
      return () => {
        isActive = false;
      };
    }, []),
  );

  // Emergency simulation and clearing
  const simulateEmergency = () => {
    const result = simulateEmergencyLogic(deviceCountry, selectedCountry);

    if (result.error) {
      Alert.alert("Error", result.error);
      return;
    }

    setCurrentAlert(result.data);
  };

  const clearEmergency = () => {
    clearCurrentEmergency();
    setCurrentAlert(null);
    Alert.alert("Emergency cleared", "There are no active emergencies now.");
  };

  // Emergency contacts modal
  const openEmergencyModal = () => {
    const result = getEmergencyContactsSafe(deviceCountry, selectedCountry);

    if (result.error) {
      Alert.alert("Error", result.error);
      return;
    }

    setModalContacts(result.data);
    setModalVisible(true);
  };

  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`);
    setModalVisible(false);
  };

  const country = deviceCountry || selectedCountry;

  // Font helper function
  const f = (size) => scaleFont(size);

  // JSX Render
  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Current Emergency */}
        {currentAlert && (
          <View style={styles.alertBox}>
            <Text style={[styles.emergencyHeader, { fontSize: f(24) }]}>
              EMERGENCY MODE
            </Text>
            <Text style={[styles.alertTitle, { fontSize: f(20) }]}>
              {currentAlert.title}
            </Text>
            <Text style={[styles.alertMessage, { fontSize: f(16) }]}>
              {currentAlert.message}
            </Text>

            <View style={styles.instructionsBox}>
              <Text style={[styles.instructionsTitle, { fontSize: f(16) }]}>
                What you should do:
              </Text>
              {getEmergencyInstructions(currentAlert).map((step, index) => (
                <Text
                  key={index}
                  style={[styles.instructionItem, { fontSize: f(14) }]}
                >
                  {index + 1}. {step}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* No Emergency Card */}
        {!currentAlert && (
          <View style={styles.noAlertBox}>
            <Ionicons
              name="shield-checkmark"
              size={40}
              color={currentTheme.primary}
            />
            <Text style={[styles.noAlertTitle, { fontSize: f(18) }]}>
              No Active Emergencies
            </Text>
            <Text style={[styles.noAlertText, { fontSize: f(14) }]}>
              Everything is currently safe. You can simulate an emergency to
              practice your response.
            </Text>
          </View>
        )}

        {/* Location Display */}
        <Text style={[styles.subtitle, { fontSize: f(18) }]}>
          Detected Location:
        </Text>
        {loadingLocation ? (
          <ActivityIndicator size="small" color={currentTheme.primary} />
        ) : deviceCountry ? (
          <Text style={[styles.locationText, { fontSize: f(16) }]}>
            {deviceCountry}
          </Text>
        ) : (
          <>
            <Text style={[styles.locationText, { fontSize: f(16) }]}>
              {locationTimeout
                ? "Can't find your location, select your country"
                : "No location detected"}
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <Picker.Item label="Select country" value="" />
                {allowedCountries.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>
          </>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: currentTheme.primary },
          ]}
          onPress={simulateEmergency}
        >
          <View style={styles.buttonRow}>
            <Ionicons name="alert-circle" size={20} color="#fff" />
            <Text style={[styles.buttonText, { fontSize: f(16) }]}>
              Simulate Emergency
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#636e72" }]}
          onPress={clearEmergency}
        >
          <View style={styles.buttonRow}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={[styles.buttonText, { fontSize: f(16) }]}>
              Clear Emergency
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#d35400" }]}
          onPress={openEmergencyModal}
        >
          <View style={styles.buttonRow}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={[styles.buttonText, { fontSize: f(16) }]}>
              Call Emergency Services
            </Text>
          </View>
        </TouchableOpacity>

        {/* Emergency Contacts Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { fontSize: f(18) }]}>
                Emergency Contacts for {country}
              </Text>
              <ScrollView style={{ maxHeight: 250 }}>
                {modalContacts.map((contact, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.modalItem}
                    onPress={() => callNumber(contact.number)}
                  >
                    <Text style={[styles.modalItemText, { fontSize: f(16) }]}>
                      {contact.name} – {contact.number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.actionButton, { marginTop: 10 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, { fontSize: f(16) }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* Bottom Navigation Bar (sticky) */}
      <BottomNavigation activeKey="EmergencyMode" />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },

  alertBox: {
    padding: 20,
    marginBottom: 25,
    backgroundColor: "#c0392b",
    borderRadius: 16,
    elevation: 3,
  },
  emergencyHeader: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1.2,
  },

  alertTitle: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },

  alertMessage: {
    color: "#fff",
    textAlign: "center",
  },

  instructionsBox: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.4)",
  },

  instructionsTitle: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },

  instructionItem: {
    color: "#fff",
    marginBottom: 6,
  },

  noAlertBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    alignItems: "center",
    elevation: 2,
  },

  noAlertTitle: {
    fontWeight: "bold",
    color: "#2d3436",
    marginTop: 10,
    marginBottom: 4,
  },

  noAlertText: {
    color: "#636e72",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 5,
    color: "#2d3436",
    fontWeight: "600",
  },

  locationText: {
    fontWeight: "500",
    marginBottom: 10,
    color: "#2d3436",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  actionButton: {
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },

  modalTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2d3436",
    textAlign: "center",
  },

  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  modalItemText: {
    color: "#2d3436",
  },
});
