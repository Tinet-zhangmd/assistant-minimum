import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useCallStore } from '../store/callStore';

const MOCK_TRANSCRIPTS = [
  { role: 'agent', name: '销售', time: '10:00', text: '您好，请问您是想了解本田CRV这款车吗？' },
  { role: 'customer', name: '客户', time: '10:01', text: '对的，我想了解一下它的价格和配置。' },
  { role: 'agent', name: '销售', time: '10:02', text: '好的，CRV现在有两种动力版本，分别是...' },
];

type KeyPoint = '开场白' | '看车历史' | '意向车型' | '购车方式' | '居住区域' | '上牌情况' | '购车时间' | '购车预算' | '邀约到店';

const KEY_POINTS: KeyPoint[] = [
  '开场白', '看车历史', '意向车型', '购车方式', '居住区域', '上牌情况', '购车时间', '购车预算', '邀约到店'
];

// 按顺序选中的选项
const SEQUENTIAL_POINTS: KeyPoint[] = ['开场白', '上牌情况', '购车预算'];
const KEY_POINTS_DONE = SEQUENTIAL_POINTS;

const KNOWLEDGE_RECOMMEND = [
  { title: '保养费用', content: '前三年免费保养，每次保养约300-500元', time: '14:32:45' },
  { title: 'SUV油耗问题', content: '我们的混动SUV百公里油耗仅5.8L，非常省油', time: '14:32:30' },
];

const CUSTOMER_PROFILE = {
  是否进店: '否',
  是否试驾: '否',
  意向车型: 'SUV',
  关注竞品: '本田CRV, 丰田RAV4',
  居住区域: '北京市朝阳区',
  上牌地区: '北京',
  有无指标: '是',
  是否置换: '否',
  付款方式: '分期',
  购车时间: '3个月内',
  购车预算: '20万',
};

interface TranscriptItemProps {
  item: {
    role: string;
    name: string;
    time: string;
    text: string;
  };
  onComplete: () => void;
}

const TranscriptItem: React.FC<TranscriptItemProps> = ({ item, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentLength = 0;
    const textLength = item.text.length;
    
    const interval = setInterval(() => {
      if (currentLength <= textLength) {
        setDisplayText(item.text.slice(0, currentLength));
        currentLength++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete();
      }
    }, 50); // 每个字符的打印间隔

    return () => clearInterval(interval);
  }, [item.text]);

  return (
    <View style={{flexDirection: 'row', marginBottom: 6, alignItems: 'flex-end'}}>
      <Text style={{color: item.role === 'agent' ? '#2979ff' : '#22bb66', fontWeight: 'bold', marginRight: 4}}>
        {item.name}
      </Text>
      <Text style={{color: '#888', fontSize: 13, marginRight: 4}}>{item.time}</Text>
      <Text style={{color: '#222', fontSize: 15}}>{displayText}</Text>
      {!isComplete && <Text style={{color: '#222', fontSize: 15}}>|</Text>}
    </View>
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'CallSession'>;

export default function CallSessionScreen() {
  const [status, setStatus] = useState<'connecting'|'active'>('connecting');
  const [timer, setTimer] = useState(0);
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0);
  const navigation = useNavigation();
  const route = useRoute<Props['route']>();
  const { phone } = route.params;
  const { endCall } = useCallStore();

  // 背景色动画值
  const bgAnims = useRef(KEY_POINTS.map(() => new Animated.Value(0))).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  // 执行选中动画
  const animateSelection = (index: number) => {
    const pointIndex = KEY_POINTS.indexOf(SEQUENTIAL_POINTS[index]);
    if (pointIndex === -1) return;

    // 背景色渐变动画
    Animated.timing(bgAnims[pointIndex], {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      // 动画完成后，如果还有下一个选项，继续动画
      if (index < SEQUENTIAL_POINTS.length - 1) {
        setTimeout(() => {
          setCurrentIndex(index + 1);
          animateSelection(index + 1);
        }, 800); // 间隔800ms后开始下一个动画
      }
    });
  };

  // 开始动画序列
  useEffect(() => {
    setTimeout(() => {
      animateSelection(0);
    }, 500);
  }, []);

  useEffect(() => {
    if (status === 'active') {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // 模拟3秒后通话接通
  useEffect(() => {
    if (status === 'connecting') {
      const t = setTimeout(() => setStatus('active'), 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleTranscriptComplete = () => {
    if (currentTranscriptIndex < MOCK_TRANSCRIPTS.length - 1) {
      setTimeout(() => {
        setCurrentTranscriptIndex(prev => prev + 1);
      }, 500); // 每句话之间的间隔
    }
  };

  const handleHangup = async () => {
    await endCall();
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fafbfc'}}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <Text style={styles.phone}>{phone}</Text>
        <Text style={styles.statusText}>
          {status === 'connecting' ? '正在连接...' : `通话中 ${formatTime(timer)}`}
        </Text>
      </View>
      {/* 操作按钮区 */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => useCallStore.getState().toggleMute()}
        >
          <Icon 
            name={useCallStore.getState().isMuted ? "mic-off" : "mic"} 
            type="feather" 
            color="#222" 
            size={28} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.hangupBtn]} 
          onPress={handleHangup}
        >
          <Icon name="phone-off" type="feather" color="#fff" size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="volume-2" type="feather" color="#222" size={28} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 32}}>
        {/* 实时转写 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>实时转写</Text>
          {MOCK_TRANSCRIPTS.slice(0, currentTranscriptIndex + 1).map((item, idx) => (
            <TranscriptItem 
              key={idx} 
              item={item} 
              onComplete={idx === currentTranscriptIndex ? handleTranscriptComplete : () => {}}
            />
          ))}
        </View>
        {/* 沟通要点 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>沟通要点</Text>
          <View style={styles.keyPointsGrid}>
            {KEY_POINTS.map((k, idx) => {
              const sequentialIndex = SEQUENTIAL_POINTS.indexOf(k);
              const isSequential = sequentialIndex !== -1;
              
              // 计算背景色
              const backgroundColor = isSequential
                ? bgAnims[idx].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#f5f6fa', '#e6f9ed']
                  })
                : '#f5f6fa';

              // 计算文字颜色
              const textColor = isSequential
                ? bgAnims[idx].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#666666', '#22bb66']
                  })
                : '#666666';

              return (
                <Animated.View
                  key={k}
                  style={[
                    styles.keyPointItem,
                    { backgroundColor }
                  ]}
                >
                  <Animated.Text style={[
                    styles.keyPointText,
                    { color: textColor }
                  ]}>
                    {k}
                  </Animated.Text>
                  {isSequential && (
                    <Animated.View
                      style={[
                        styles.checkmark,
                        {
                          opacity: bgAnims[idx]
                        }
                      ]}
                    >
                      <Icon name="check-circle" type="feather" size={16} color="#22bb66" />
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })}
          </View>
        </View>
        {/* 知识推荐 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>知识推荐</Text>
          {KNOWLEDGE_RECOMMEND.map((item, idx) => (
            <View key={idx} style={styles.knowledgeItem}>
              <Text style={styles.knowledgeTitle}>{item.title}</Text>
              <Text style={styles.knowledgeContent}>{item.content}</Text>
              <Text style={styles.knowledgeTime}>{item.time}</Text>
            </View>
          ))}
        </View>
        {/* 客户画像 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>客户画像</Text>
          {Object.entries(CUSTOMER_PROFILE).map(([k, v]) => (
            <View key={k} style={styles.profileRow}>
              <Text style={styles.profileKey}>{k}</Text>
              <Text style={styles.profileValue}>{v}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2979ff',
    paddingTop: 0,
    paddingBottom: 0,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 24,
  },
  actionBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e3e7',
  },
  hangupBtn: {
    backgroundColor: '#ff4d4f',
    borderWidth: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  keyPointsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  keyPointText: {
    fontSize: 14,
  },
  checkmark: {
    marginLeft: 4,
  },
  knowledgeItem: {
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  knowledgeTitle: {
    fontWeight: 'bold',
    color: '#2979ff',
    fontSize: 15,
  },
  knowledgeContent: {
    color: '#222',
    fontSize: 15,
    marginTop: 2,
  },
  knowledgeTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileKey: {
    color: '#666',
    fontSize: 15,
  },
  profileValue: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold',
  },
}); 