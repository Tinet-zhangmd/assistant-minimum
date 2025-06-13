import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useCallStore } from '../store/callStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Call'>;

const CallScreen: React.FC<Props> = ({ route }) => {
  const { customerName, phoneNumber } = route.params;
  const { startCall } = useCallStore();

  const handleStartCall = async () => {
    await startCall(customerName, phoneNumber);
  };

  return (
    <View style={styles.container}>
      <View style={styles.customerInfo}>
        <Text style={styles.name}>{customerName}</Text>
        <Text style={styles.phone}>{phoneNumber}</Text>
      </View>

      <TouchableOpacity 
        style={styles.callButton}
        onPress={handleStartCall}
      >
        <Icon name="phone" type="feather" color="#fff" size={16} style={styles.callIcon} />
        <Text style={styles.callButtonText}>开始通话</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CD964',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  callIcon: {
    marginRight: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CallScreen;
