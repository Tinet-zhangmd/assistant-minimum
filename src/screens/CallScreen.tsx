import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useCallStore } from '../store/callStore';
import { CallOverlay } from '../components/CallOverlay';

type Props = NativeStackScreenProps<RootStackParamList, 'Call'>;

export const CallScreen: React.FC<Props> = ({ route }) => {
  const { customerName, phoneNumber } = route.params;
  const startCall = useCallStore(state => state.startCall);

  useEffect(() => {
    // 进入页面时自动开始通话
    startCall(customerName, phoneNumber);
  }, [customerName, phoneNumber]);

  return (
    <View style={styles.container}>
      <CallOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
 