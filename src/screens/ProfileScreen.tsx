import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useCallStore } from '../store/callStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { socketService } from '../services/socketService';

// Mock数据
const USER_INFO = {
  name: '张三',
  department: '销售部',
  position: '销售顾问',
  phone: '138****1234'
};

const SYSTEM_INFO = {
  version: 'v1.0.0',
  lastUpdate: '2024-01-15',
  status: '正常'
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isCallActive, endCall } = useCallStore();

  const handleLogout = async () => {
    if (isCallActive) {
      Alert.alert(
        '退出提醒',
        '您当前正在通话中，退出登录将结束当前通话。是否继续？',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '确定退出',
            style: 'destructive',
            onPress: async () => {
              await endCall();
              socketService.disconnect();
              // TODO: 实现退出登录逻辑
              console.log('退出登录');
            },
          },
        ],
      );
    } else {
      socketService.disconnect();
      // TODO: 实现退出登录逻辑
      console.log('退出登录');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
      </View>

      {/* 用户信息卡片 */}
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{USER_INFO.name[0]}</Text>
          </View>
          <View style={styles.userDetail}>
            <Text style={styles.userName}>{USER_INFO.name}</Text>
            <Text style={styles.userPosition}>{USER_INFO.department} · {USER_INFO.position}</Text>
            <Text style={styles.userPhone}>{USER_INFO.phone}</Text>
          </View>
        </View>
      </View>

      {/* 系统信息卡片 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>系统信息</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>应用版本</Text>
          <Text style={styles.infoValue}>{SYSTEM_INFO.version}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>最后更新</Text>
          <Text style={styles.infoValue}>{SYSTEM_INFO.lastUpdate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>服务状态</Text>
          <Text style={[styles.infoValue, styles.statusNormal]}>{SYSTEM_INFO.status}</Text>
        </View>
      </View>

      {/* 退出登录按钮 */}
      <TouchableOpacity 
        style={[styles.logoutButton, isCallActive && styles.logoutButtonDisabled]} 
        onPress={handleLogout}
      >
        <Icon name="logout" type="material-community" color="#fff" size={20} />
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  header: {
    height: 56,
    backgroundColor: '#2979ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    color: '#2979ff',
    fontWeight: 'bold',
  },
  userDetail: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  userPosition: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 15,
    color: '#666',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
  },
  statusNormal: {
    color: '#4caf50',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4d4f',
    borderRadius: 8,
    height: 48,
    marginHorizontal: 16,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default ProfileScreen; 