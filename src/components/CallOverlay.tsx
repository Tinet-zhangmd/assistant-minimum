import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { useCallStore } from '../store/callStore';

export const CallOverlay: React.FC = () => {
  const { isInCall, customerName, phoneNumber, endCall, peerIds, isMuted } = useCallStore();

  if (!isInCall) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="phone" type="feather" color="#fff" size={20} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>销售助理</Text>
          <View style={styles.statusTag}>
            <Text style={styles.statusText}>通话中</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="refresh-cw" type="feather" color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpace}>
            <Icon name="settings" type="feather" color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpace}>
            <Icon name="maximize" type="feather" color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpace}>
            <Icon name="x" type="feather" color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.status}>
            {peerIds.length > 0 ? '通话中' : '等待对方接听...'}
          </Text>
          {peerIds.map((peerId) => (
            <View key={peerId} style={styles.peerContainer}>
              <Text style={styles.peerInfo}>远端用户已加入 (ID: {peerId})</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.muteButton]}
            onPress={useCallStore.getState().toggleMute}
          >
            <Text style={styles.buttonText}>
              {isMuted ? '取消静音' : '静音'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.endCallButton}
            onPress={endCall}
          >
            <Text style={styles.endCallText}>结束通话</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.transcriptionTitle}>实时语音转译</Text>
        <View style={styles.transcriptionStatus}>
          <Text style={styles.statusText}>已停止</Text>
          <Icon name="mic-off" type="feather" color="#666" size={16} style={styles.micIcon} />
        </View>
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
    backgroundColor: '#fff',
  },
  header: {
    height: 44,
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpace: {
    marginLeft: 20,
  },
  statusTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  customerInfo: {
    alignItems: 'center',
  },
  customerName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#666',
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  endCallText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  transcriptionTitle: {
    fontSize: 14,
    color: '#666',
  },
  transcriptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micIcon: {
    marginLeft: 8,
  },
  muteButton: {
    backgroundColor: '#666',
    marginBottom: 10,
    width: 120,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  status: {
    color: '#4CAF50',
    fontSize: 16,
    marginBottom: 20,
  },
  peerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  peerInfo: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
}); 