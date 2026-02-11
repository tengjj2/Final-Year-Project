// screens/EmergencyMode.js

// React hooks
import { useState, useCallback } from "react";

// React Native components
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";

// Dropdown picker component
import { Picker } from "@react-native-picker/picker";

// Navigation hook to run logic when screen comes into focus
import { useFocusEffect } from "@react-navigation/native";

// Helpers
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
  // Component state
  const [deviceCountry, setDeviceCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationTimeout, setLocationTimeout] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(getCurrentEmergency());

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContacts, setModalContacts] = useState([]);

  // Fetch device location
  // Runs everytime the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchLocation = async () => {
        setLoadingLocation(true);
        setLocationTimeout(false);

        const country = await getDeviceCountry(10000); // Timeout 10s
        if (!isActive) return;

        if (country) {
          setDeviceCountry(country);
        } else {
          setDeviceCountry(null);
          setLocationTimeout(true);
        }

        setLoadingLocation(false);
      };

      fetchLocation();
      return () => {
        isActive = false; // Clean up if component unmounts
      };
    }, []),
  );

  // Simulate emergency
  const simulateEmergency = () => {
    const country = deviceCountry || selectedCountry;
    if (!country) {
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

  // Clear emergency
  const clearEmergency = () => {
    clearCurrentEmergency();
    setCurrentAlert(null);
    Alert.alert("Emergency cleared", "There are no active emergencies now.");
  };

  // Emergency contacts modal
  const openEmergencyModal = () => {
    const country = deviceCountry || selectedCountry;
    if (!country) {
      Alert.alert(
        "No country selected",
        "Please enable location or select your country first.",
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

  // Call number in device dialer
  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`);
    setModalVisible(false);
  };

  const country = deviceCountry || selectedCountry;

  // UI Component
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

      {/* Location Display */}
      <Text style={styles.subtitle}>Detected Location:</Text>

      {loadingLocation ? (
        <ActivityIndicator size="small" color="#2e86de" />
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
              <Picker.Item label="Singapore" value="Singapore" />
              <Picker.Item label="Malaysia" value="Malaysia" />
              <Picker.Item label="USA" value="USA" />
              <Picker.Item label="Japan" value="Japan" />
            </Picker>
          </View>
        </>
      )}

      {/* Action Buttons*/}
      <View style={styles.buttonGroup}>
        <Button
          title="Simulate Emergency"
          onPress={simulateEmergency}
          color="#c0392b"
        />
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title="Clear Emergency"
          onPress={clearEmergency}
          color="#7f8c8d"
        />
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title="Call Emergency Services"
          onPress={openEmergencyModal}
          color="#d35400"
        />
      </View>

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

            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              color="#7f8c8d"
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  /* Emergency Section */
  emergencyHeader: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1.5,
  },

  alertBox: {
    padding: 20,
    marginBottom: 25,
    backgroundColor: "#c0392b",
    borderRadius: 12,
  },

  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 6,
  },

  alertMessage: {
    fontSize: 16,
    color: "#ffffff",
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
    color: "#ffffff",
    marginBottom: 8,
  },

  instructionItem: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 6,
  },

  /* Location */
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
  },

  locationText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },

  /* Buttons */
  buttonGroup: {
    marginTop: 10,
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
    borderRadius: 10,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  modalItemText: {
    fontSize: 16,
  },
});