import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import HistorySummaryModal from '../components/HistorySummaryModal';
import { useCallStore } from '../store/callStore';

const DIAL_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

const RECENT_CALLS = [
  { number: '138****1234', time: '刚刚', status: '已接通' },
  { number: '186****5678', time: '5分钟前', status: '未接通' },
  { number: '159****9876', time: '1小时前', status: '已接通' },
];

function isValidPhone(phone: string) {
  // 简单校验：11位手机号或带区号座机
  return /^1[3-9]\d{9}$/.test(phone) || /^0\d{2,3}-?\d{7,8}$/.test(phone);
}

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const startCall = useCallStore(state => state.startCall);

  const handleDial = (key: string) => {
    setPhone((prev) => prev + key);
  };
  const handleClear = () => setPhone('');
  const handleDelete = () => setPhone((prev) => prev.slice(0, -1));

  const handleCall = () => {
    if (isValidPhone(phone)) {
      setModalVisible(true);
    }
  };

  const handleStartCall = async () => {
    setModalVisible(false);
    try {
      await startCall('未知客户', phone);
      navigation.navigate('CallSession', { phone });
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <HistorySummaryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleStartCall}
        phone={phone}
        callCount={3}
      />
      <View style={styles.titleBar}>
        <Text style={styles.title}>电话外呼</Text>
      </View>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 32}} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>输入电话号码</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入手机号或座机号"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={20}
        />
        <View style={styles.dialPad}>
          {DIAL_KEYS.map((row, i) => (
            <View key={i} style={styles.dialRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.dialKey}
                  onPress={() => handleDial(key)}
                >
                  <Text style={styles.dialKeyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearText}>清空</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.callBtn, isValidPhone(phone) ? styles.callBtnActive : styles.callBtnDisabled]}
            disabled={!isValidPhone(phone)}
            onPress={handleCall}
          >
            <Icon name="phone" type="feather" color="#fff" size={20} />
            <Text style={styles.callText}>拨号</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentBox}>
          <Text style={styles.recentTitle}>最近通话</Text>
          {RECENT_CALLS.map((item) => (
            <View style={styles.recentItem} key={item.number}>
              <Icon name="phone" type="feather" color="#b0b0b0" size={20} style={styles.recentIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recentNumber}>{item.number}</Text>
                <Text style={styles.recentTime}>{item.time}</Text>
              </View>
              <View style={[styles.statusTag, item.status === '已接通' ? styles.statusSuccess : styles.statusFail]}>
                <Text style={[styles.statusText, item.status === '未接通' ? styles.statusTextFail : {}]}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBar: {
    backgroundColor: '#2563ef',
    paddingTop: 0,
    paddingBottom: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginLeft: 24,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    fontSize: 18,
    color: 'rgb(2, 8, 23)',
    padding: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  dialPad: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dialKey: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
  },
  dialKeyText: {
    fontSize: 20,
    color: 'rgb(2, 8, 23)',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    width: '80%',
  },
  clearBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e3e7',
    marginRight: 12,
  },
  clearText: {
    color: '#333',
    fontSize: 18,
  },
  callBtn: {
    flex: 2,
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnActive: {
    backgroundColor: '#22bb66',
  },
  callBtnDisabled: {
    backgroundColor: '#d3d7df',
  },
  callText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
  recentBox: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#e2e8f0',
    shadowOpacity: 0.01,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  recentIcon: {
    marginRight: 12,
  },
  recentNumber: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  recentTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusTag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSuccess: {
    backgroundColor: '#111827',
  },
  statusFail: {
    backgroundColor: '#f1f3f6',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextFail: {
    color: '#111827',
  },
}); 