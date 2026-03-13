// screens/EmergencyMode.js

import { useState, useCallback } from "react";
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

import {
  sendNotification,
  getCurrentEmergency,
  clearCurrentEmergency,
  getRandomEmergency,
  getEmergencyInstructions,
  getEmergencyContacts,
} from "../helpers/emergencyHelper";
import { getDeviceCountry } from "../helpers/locationHelper";

export default function EmergencyMode() {
  const [deviceCountry, setDeviceCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationTimeout, setLocationTimeout] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(getCurrentEmergency());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContacts, setModalContacts] = useState([]);
  const allowedCountries = ["Singapore", "England", "Japan"];

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

  const simulateEmergency = () => {
    const country = deviceCountry || selectedCountry;
    if (!country || !allowedCountries.includes(country)) {
      Alert.alert(
        "No location selected",
        "Please enable location or select your country.",
      );
      return;
    }

    const emergency = getRandomEmergency();
    if (!emergency) {
      clearCurrentEmergency();
      setCurrentAlert(null);
      Alert.alert("No emergencies available.");
      return;
    }

    sendNotification(emergency);
    setCurrentAlert(emergency);
  };

  const clearEmergency = () => {
    clearCurrentEmergency();
    setCurrentAlert(null);
    Alert.alert("Emergency cleared", "There are no active emergencies now.");
  };

  const openEmergencyModal = () => {
    const country = deviceCountry || selectedCountry;
    if (!country || !allowedCountries.includes(country)) {
      Alert.alert(
        "No location selected",
        "Please enable location or select your country.",
      );
      return;
    }

    const contacts = getEmergencyContacts(country);
    if (!contacts || contacts.length === 0) {
      Alert.alert(
        "No contacts found",
        `Emergency numbers for ${country} are not available.`,
      );
      return;
    }

    setModalContacts(contacts);
    setModalVisible(true);
  };

  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`);
    setModalVisible(false);
  };

  const country = deviceCountry || selectedCountry;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Current Emergency */}
      {currentAlert && (
        <View style={styles.alertBox}>
          <Text style={styles.emergencyHeader}>EMERGENCY MODE</Text>
          <Text style={styles.alertTitle}>{currentAlert.title}</Text>
          <Text style={styles.alertMessage}>{currentAlert.message}</Text>

          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>What you should do:</Text>
            {getEmergencyInstructions(currentAlert).map((step, index) => (
              <Text key={index} style={styles.instructionItem}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* No Emergency Status Card */}
      {!currentAlert && (
        <View style={styles.noAlertBox}>
          <Ionicons name="shield-checkmark" size={40} color="#0f8f84" />
          <Text style={styles.noAlertTitle}>No Active Emergencies</Text>
          <Text style={styles.noAlertText}>
            Everything is currently safe. You can simulate an emergency to
            practice your response.
          </Text>
        </View>
      )}

      {/* Location Display */}
      <Text style={styles.subtitle}>Detected Location:</Text>
      {loadingLocation ? (
        <ActivityIndicator size="small" color="#0f8f84" />
      ) : deviceCountry ? (
        <Text style={styles.locationText}>{deviceCountry}</Text>
      ) : (
        <>
          <Text style={styles.locationText}>
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
      <TouchableOpacity style={styles.actionButton} onPress={simulateEmergency}>
        <View style={styles.buttonRow}>
          <Ionicons name="alert-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Simulate Emergency</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#636e72" }]}
        onPress={clearEmergency}
      >
        <View style={styles.buttonRow}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Clear Emergency</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#d35400" }]}
        onPress={openEmergencyModal}
      >
        <View style={styles.buttonRow}>
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.buttonText}>Call Emergency Services</Text>
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
            <Text style={styles.modalTitle}>
              Emergency Contacts for {country}
            </Text>
            <ScrollView style={{ maxHeight: 250 }}>
              {modalContacts.map((contact, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.modalItem}
                  onPress={() => callNumber(contact.number)}
                >
                  <Text style={styles.modalItemText}>
                    {contact.name} – {contact.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.actionButton, { marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f6fa",
  },

  /* Emergency Alert */
  alertBox: {
    padding: 20,
    marginBottom: 25,
    backgroundColor: "#c0392b",
    borderRadius: 16,
    elevation: 3,
  },
  emergencyHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1.2,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  alertMessage: {
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },

  /* No Emergency Card */
  noAlertBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    alignItems: "center",
    elevation: 2,
  },

  noAlertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3436",
    marginTop: 10,
    marginBottom: 4,
  },

  noAlertText: {
    fontSize: 14,
    color: "#636e72",
    textAlign: "center",
  },

  /* Location */
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: "#2d3436",
    fontWeight: "600",
  },
  locationText: {
    fontSize: 16,
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

  /* Buttons */
  actionButton: {
    backgroundColor: "#0f8f84",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  /* Modal */
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
    fontSize: 18,
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
    fontSize: 16,
    color: "#2d3436",
  },
});
