import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Call'>;

const CallScreen: React.FC<Props> = ({ route }) => {
  const { customerName, phoneNumber } = route.params;

  return (
    <View style={styles.container}>


      {/* 客户信息区域 */}
      <View style={styles.customerInfo}>
        <View>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Icon name="phone" type="feather" color="#fff" size={16} style={styles.callIcon} />
          <Text style={styles.callButtonText}>开始通话</Text>
        </TouchableOpacity>
      </View>
      {/* 底部状态栏 */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>实时语音转译</Text>
        <View style={styles.statusRight}>
          <Text style={styles.statusText}>已停止</Text>
          <Icon name="mic-off" type="feather" color="#666" size={16} style={styles.micIcon} />
        </View>
      </View>
      

      {/* 主要内容区域 */}
      <View style={styles.content}>
        {/* 聊天内容将在这里显示 */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },


  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIcon: {
    marginRight: 4,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusBar: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CallScreen;
