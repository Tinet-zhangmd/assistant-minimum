import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import Sound from 'react-native-sound';
import type { CallRecord } from '../types/callRecord';

// mock数据
const MOCK_DETAIL: CallRecord = {
  id: 1000,
  phone: '138****1000',
  callTime: '2025/6/19 11:55:13',
  status: '已接通',
  duration: 293,
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
  if (!sec) return '0秒';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m}分${s}秒` : `${s}秒`;
}

interface Props {
  record: CallRecord;
  onClose: () => void;
}

const windowHeight = Dimensions.get('window').height;
const cardTopRadius = 24;
const cardMarginBottom = 24;
const cardMarginHorizontal = 8;
const cardInset = 8;

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
        {/* 顶部蓝色栏，独立一层 */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>通话详情</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Icon name="x" type="feather" color="#fff" size={28} />
          </TouchableOpacity>
        </View>
        {/* 白色内容卡片，带圆角和阴影，嵌入蓝色栏下方 */}
        <View style={styles.cardBox}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.phone}>{record.phone}</Text>
              <Text style={styles.time}>{record.callTime}</Text>
              <Text style={styles.duration}>通话时长: {formatDuration(record.duration)}</Text>
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
      {/* 顶部蓝色栏，独立一层 */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>通话详情</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Icon name="x" type="feather" color="#fff" size={28} />
        </TouchableOpacity>
      </View>
      {/* 白色内容卡片，带圆角和阴影，嵌入蓝色栏下方 */}
      <View style={styles.cardBox}>
        <View style={styles.cardHeaderRow}>
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
          <TouchableOpacity style={styles.iconBtn} onPress={handlePlay}>
            <Icon name={playing ? 'pause' : 'play'} type="feather" color="#2979ff" size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleDownload}>
            <Icon name="download" type="feather" color="#2979ff" size={28} />
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
            </TouchableOpacity>
          ))}
        </View>
        {/* 内容区 */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentScroll}>
          {tab === 'transcript' && (
            <View>
              <Text style={styles.sectionTitle}>对话记录</Text>
              {MOCK_TRANSCRIPT.map((item, idx) => (
                <View
                  key={idx}
                  style={[styles.bubble, item.role === 'agent' ? styles.bubbleAgent : styles.bubbleCustomer]}
                >
                  <Text style={styles.bubbleName}>{item.name} {item.time}</Text>
                  <Text style={styles.bubbleText}>{item.text}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topBar: {
    width: '98%',
    height: 64,
    backgroundColor: '#2979ff',
    borderTopLeftRadius: cardTopRadius,
    borderTopRightRadius: cardTopRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
    marginBottom: -cardTopRadius + cardInset, // 让白色卡片嵌入蓝色栏
    alignSelf: 'center',
    shadowColor: 'transparent', // 不要阴影
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
  },
  closeBtn: {
    padding: 8,
    marginLeft: 8,
  },
  cardBox: {
    width: '98%',
    backgroundColor: '#fff',
    borderRadius: cardTopRadius,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    minHeight: windowHeight * 0.7,
    maxHeight: windowHeight * 0.95,
    paddingTop: cardTopRadius - cardInset, // 顶部内边距让内容不被圆角遮挡
    marginBottom: cardMarginBottom,
    marginHorizontal: cardMarginHorizontal,
    alignSelf: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  phone: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  time: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
  },
  duration: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
  },
  statusTag: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
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
  statusTextSuccess: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  statusTextFail: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f6f8fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e3e7',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f6f8fa',
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 8,
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f6f8fa',
  },
  tabActive: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#2979ff',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  contentScroll: {
    paddingBottom: 32,
    minHeight: 200,
    paddingHorizontal: 0,
  },
  bubble: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    maxWidth: '90%',
  },
  bubbleAgent: {
    backgroundColor: '#2979ff',
    alignSelf: 'flex-end',
  },
  bubbleCustomer: {
    backgroundColor: '#f6f8fa',
    alignSelf: 'flex-start',
  },
  bubbleName: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 16,
    color: '#222',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  profileKey: {
    color: '#888',
    fontSize: 16,
  },
  profileValue: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#f6f8fa',
    color: '#222',
    fontSize: 15,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  summaryBox: {
    backgroundColor: '#f6f8fa',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e0e3e7',
    marginTop: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 24,
  },
  emptyBox: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default CallRecordDetailModal; 