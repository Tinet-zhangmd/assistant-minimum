import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import Sound from 'react-native-sound';
import type { CallRecord } from '../types/callRecord';

// mock数据
const MOCK_DETAIL: CallRecord = {
  id: 1000,
  phone: '138****1000',
  callTime: '2025/6/20 17:11:22',
  status: '已接通',
  duration: 57,
  recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};
const MOCK_TRANSCRIPT = [
  { role: 'agent', name: '坐席', time: '14:32:05', text: '您好，我是某某汽车的销售顾问，请问您对我们的车型有兴趣吗？' },
  { role: 'customer', name: '客户', time: '14:32:12', text: '是的，我想了解一下SUV车型的情况，主要是家用' },
  { role: 'agent', name: '坐席', time: '14:32:20', text: '好的，请问您比较关注哪个价位区间的SUV呢？' },
  { role: 'customer', name: '客户', time: '14:32:28', text: '20万左右吧，主要是上下班代步和周末出游' },
  { role: 'agent', name: '坐席', time: '14:32:35', text: '明白了，我们有几款20万左右的SUV很适合您的需求...' },
];
const MOCK_PROFILE = [
  { label: '是否进店', value: '否' },
  { label: '是否试驾', value: '否' },
  { label: '意向车型', value: 'SUV' },
  { label: '关注竞品', value: '本田CR-V, 丰田RAV4' },
  { label: '居住区域', value: '海淀区' },
  { label: '上牌地区', value: '北京' },
  { label: '有无指标', value: '有' },
];
const MOCK_NEEDS = {
  points: ['价格', '油耗', '空间', '配置'],
  purposes: ['代步', '家用', '周末出游'],
};
const MOCK_SUMMARY = `本次通话客户表现出对SUV车型的明确兴趣，预算在20万左右，主要用途为家用代步和周末出游。
客户比较关注油耗和空间配置，对竞品本田CR-V和丰田RAV4有了解。
建议后续重点推荐我们的混动SUV车型，强调油耗优势和空间表现。
客户购车时间较为迫切，可安排试驾邀约。`;

const TABS = [
  { key: 'transcript', label: '转写文本' },
  { key: 'profile', label: '客户画像' },
  { key: 'needs', label: '需求盘点' },
  { key: 'summary', label: '通话小结' },
];

function formatDuration(sec: number) {
  if (!sec) return '0分0秒';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}分${s}秒`;
}

interface Props {
  record: CallRecord;
  onClose: () => void;
}

const CallRecordDetailModal: React.FC<Props> = ({ record, onClose }) => {
  const [tab, setTab] = useState('transcript');
  const [playing, setPlaying] = useState(false);
  const soundRef = useRef<Sound | null>(null);

  // 录音播放
  const handlePlay = () => {
    if (playing) {
      soundRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (soundRef.current) {
      soundRef.current.play((success) => {
        setPlaying(false);
      });
      setPlaying(true);
    } else {
      const s = new Sound(record.recordingUrl, null as any, (error) => {
        if (error) {
          setPlaying(false);
          Alert.alert('音频加载失败');
          return;
        }
        soundRef.current = s;
        s.play((success) => {
          setPlaying(false);
        });
        setPlaying(true);
      });
    }
  };
  // 下载录音（这里只做提示）
  const handleDownload = () => {
    Alert.alert('下载录音功能待实现');
  };

  // 未接通情况
  if (record.status === '未接通') {
    return (
      <View style={styles.modalRoot}>
        {/* 顶部蓝色栏 */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>通话详情</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Icon name="x" type="feather" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.phone}>{record.phone}</Text>
              <Text style={styles.time}>{record.callTime}</Text>
            </View>
            <View style={[styles.statusTag, styles.statusFail]}>
              <Text style={styles.statusTextFail}>未接通</Text>
            </View>
          </View>
          
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>未接通通话</Text>
            <Text style={styles.emptyText}>暂无通话内容</Text>
          </View>
        </View>
      </View>
    );
  }

  // 已接通情况
  return (
    <View style={styles.modalRoot}>
      {/* 顶部蓝色栏 */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>通话详情</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Icon name="x" type="feather" color="#fff" size={24} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.phone}>{record.phone}</Text>
            <Text style={styles.time}>{record.callTime}</Text>
            <Text style={styles.duration}>通话时长: {formatDuration(record.duration)}</Text>
          </View>
          <View style={[styles.statusTag, styles.statusSuccess]}>
            <Text style={styles.statusTextSuccess}>已接通</Text>
          </View>
        </View>
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePlay}>
            <Icon name={playing ? 'pause' : 'play'} type="feather" color="#000" size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
            <Icon name="download" type="feather" color="#000" size={22} />
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabItem, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
              {tab === t.key && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* 内容区 */}
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentScroll}>
          {tab === 'transcript' && (
            <View>
              <Text style={styles.sectionTitle}>对话记录</Text>
              {MOCK_TRANSCRIPT.map((item, idx) => (
                <View
                  key={idx}
                  style={[styles.bubble, item.role === 'agent' ? styles.bubbleAgent : styles.bubbleCustomer]}
                >
                  <Text style={[styles.bubbleName, item.role === 'agent' ? styles.bubbleNameAgent : styles.bubbleNameCustomer]}>
                    {item.role === 'agent' ? '坐席' : '客户'} {item.time}
                  </Text>
                  <Text style={[styles.bubbleText, item.role === 'agent' ? styles.bubbleTextAgent : styles.bubbleTextCustomer]}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
          {tab === 'profile' && (
            <View>
              <Text style={styles.sectionTitle}>客户画像</Text>
              {MOCK_PROFILE.map((item, idx) => (
                <View key={idx} style={styles.profileRow}>
                  <Text style={styles.profileKey}>{item.label}</Text>
                  <Text style={styles.profileValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          )}
          {tab === 'needs' && (
            <View>
              <Text style={styles.sectionTitle}>购车关注点</Text>
              <View style={styles.tagRow}>
                {MOCK_NEEDS.points.map((t, idx) => (
                  <Text key={t} style={styles.tag}>{t}</Text>
                ))}
              </View>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>核心用途</Text>
              <View style={styles.tagRow}>
                {MOCK_NEEDS.purposes.map((t, idx) => (
                  <Text key={t} style={styles.tag}>{t}</Text>
                ))}
              </View>
            </View>
          )}
          {tab === 'summary' && (
            <View>
              <Text style={styles.sectionTitle}>通话小结</Text>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{MOCK_SUMMARY}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    height: 56,
    backgroundColor: '#1677ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  phone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  statusTag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 64,
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: '#111827',
  },
  statusFail: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusTextSuccess: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  statusTextFail: {
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  tabItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    position: 'relative',
    flex: 1,
  },
  tabActive: {
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1677ff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#1677ff',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  contentScroll: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  bubble: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    maxWidth: '85%',
  },
  bubbleAgent: {
    backgroundColor: '#1677ff',
    alignSelf: 'flex-end',
  },
  bubbleCustomer: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  bubbleName: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  bubbleNameAgent: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  bubbleNameCustomer: {
    color: '#666',
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bubbleTextAgent: {
    color: '#fff',
  },
  bubbleTextCustomer: {
    color: '#333',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
  profileRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileKey: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  profileValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
  },
  summaryBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});

export default CallRecordDetailModal; 