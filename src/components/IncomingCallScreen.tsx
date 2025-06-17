import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCallStore } from '../store/callStore';

export const IncomingCallScreen = () => {
  const { customerName, phoneNumber, isIncomingCall, acceptIncomingCall, rejectIncomingCall } = useCallStore();

  if (!isIncomingCall) return null;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>来电</Text>
        <Text style={styles.name}>{customerName}</Text>
        <Text style={styles.phone}>{phoneNumber}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.rejectButton]}
          onPress={rejectIncomingCall}
        >
          <Text style={styles.buttonText}>拒绝</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.acceptButton]}
          onPress={acceptIncomingCall}
        >
          <Text style={styles.buttonText}>接听</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'space-between',
    padding: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  name: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  phone: {
    color: 'white',
    fontSize: 18,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 50,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#4CD964',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 