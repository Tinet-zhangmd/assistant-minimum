import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Overlay, Button, Icon } from '@rneui/themed';

// mock数据
type CustomerProfile = {
  carType: string;
  testDrive: string;
  competitors: string;
  region: string;
  licenseRegion: string;
  indicator: string;
  replacement: string;
  payment: string;
  buyTime: string;
  budget: string;
};

type Todo = { text: string };
type Focus = { text: string };
type Barrier = { text: string };
type CallRecord = {
  date: string;
  desc: string;
  status: string;
  duration: string;
};

const mockProfile: CustomerProfile = {
  carType: 'SUV',
  testDrive: '否',
  competitors: '本田CRV, 丰田RAV4',
  region: '北京市朝阳区',
  licenseRegion: '北京',
  indicator: '是',
  replacement: '否',
  payment: '分期',
  buyTime: '3个月内',
  budget: '20万',
};
const mockTodos: Todo[] = [
  { text: '邀约客户到店试驾' },
  { text: '发送详细配置对比表' },
  { text: '了解具体购车时间安排' },
];
const mockFocus: Focus[] = [
  { text: '价格优惠幅度' },
  { text: '车辆配置详情' },
  { text: '油耗表现' },
  { text: '后期保养费用' },
];
const mockBarriers: Barrier[] = [
  { text: '对价格有异议，希望更多优惠' },
  { text: '担心油耗偏高' },
  { text: '需要与家人商量' },
];
const mockCallRecords: CallRecord[] = [
  {
    date: '2024-01-15',
    desc: '初次沟通，了解基本需求',
    status: '已接通',
    duration: '8分32秒',
  },
  {
    date: '2024-01-10',
    desc: '价格咨询，表达购买意向',
    status: '已接通',
    duration: '5分18秒',
  },
  {
    date: '2024-01-08',
    desc: '车型介绍，约定下次沟通',
    status: '已接通',
    duration: '3分45秒',
  },
];

interface HistorySummaryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  phone: string;
  callCount: number;
}

const HistorySummaryModal: React.FC<HistorySummaryModalProps> = ({
  visible,
  onClose,
  onConfirm,
  phone,
  callCount,
}) => {
  const [tab, setTab] = useState<'profile' | 'record'>('profile');

  return (
    <Overlay
      isVisible={visible}
      overlayStyle={styles.overlay}
      backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onBackdropPress={onClose}
      animationType="slide"
    >
      <View style={styles.container}>
        {/* 顶部栏 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>历史沟通总结</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>关闭</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.phoneText}>{phone} · 历史通话 {callCount} 次</Text>
        {/* Tab 切换 */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'profile' && styles.tabBtnActive]}
            onPress={() => setTab('profile')}
          >
            <Text style={[styles.tabText, tab === 'profile' && styles.tabTextActive]}>客户盘点</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'record' && styles.tabBtnActive]}
            onPress={() => setTab('record')}
          >
            <Text style={[styles.tabText, tab === 'record' && styles.tabTextActive]}>历史通话记录</Text>
          </TouchableOpacity>
        </View>
        {/* 内容区 */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
          {tab === 'profile' ? (
            <View>
              {/* 客户画像信息 */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>客户画像信息</Text>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>意向车型：</Text>
                  <Text style={styles.profileValue}>{mockProfile.carType}</Text>
                  <Text style={styles.profileLabel}>是否试驾：</Text>
                  <Text style={styles.profileValue}>{mockProfile.testDrive}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>关注竞品：</Text>
                  <Text style={styles.profileValue}>{mockProfile.competitors}</Text>
                  <Text style={styles.profileLabel}>居住区域：</Text>
                  <Text style={styles.profileValue}>{mockProfile.region}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>上牌地区：</Text>
                  <Text style={styles.profileValue}>{mockProfile.licenseRegion}</Text>
                  <Text style={styles.profileLabel}>有无指标：</Text>
                  <Text style={styles.profileValue}>{mockProfile.indicator}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>是否置换：</Text>
                  <Text style={styles.profileValue}>{mockProfile.replacement}</Text>
                  <Text style={styles.profileLabel}>付款方式：</Text>
                  <Text style={styles.profileValue}>{mockProfile.payment}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>购车时间：</Text>
                  <Text style={styles.profileValue}>{mockProfile.buyTime}</Text>
                  <Text style={styles.profileLabel}>购车预算：</Text>
                  <Text style={styles.profileValue}>{mockProfile.budget}</Text>
                </View>
              </View>
              {/* 历史沟通待办 */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>历史沟通待办</Text>
                {mockTodos.map((item, idx) => (
                  <View key={idx} style={styles.todoItem}>
                    <View style={styles.todoDot} />
                    <Text style={styles.todoText}>{item.text}</Text>
                  </View>
                ))}
              </View>
              {/* 客户关注点 */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>客户关注点</Text>
                <View style={styles.focusWrap}>
                  {mockFocus.map((item, idx) => (
                    <View key={idx} style={styles.focusTag}>
                      <Text style={styles.focusTagText}>{item.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {/* 客户购车阻力点 */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>客户购车阻力点</Text>
                {mockBarriers.map((item, idx) => (
                  <View key={idx} style={styles.barrierItem}>
                    <View style={styles.barrierDot} />
                    <Text style={styles.barrierText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>历史通话记录</Text>
              {mockCallRecords.map((item, idx) => (
                <View key={idx} style={styles.callRecordItem}>
                  <View style={styles.callRecordRow}>
                    <Icon name="phone" type="feather" color="#3B6CFF" size={18} containerStyle={{ marginRight: 6 }} />
                    <Text style={styles.callRecordDate}>{item.date}</Text>
                    <Text style={styles.callRecordStatus}>{item.status}</Text>
                    <Text style={styles.callRecordDuration}>{item.duration}</Text>
                  </View>
                  <Text style={styles.callRecordDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        {/* 按钮区 */}
        <View style={styles.footer}>
          <Button
            title="取消"
            type="outline"
            buttonStyle={styles.cancelBtn}
            titleStyle={styles.cancelBtnText}
            onPress={onClose}
          />
          <Button
            title="确认，开始拨号"
            buttonStyle={styles.confirmBtn}
            titleStyle={styles.confirmBtnText}
            onPress={onConfirm}
          />
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    padding: 0,
    borderRadius: 8,
    width: '92%',
    maxWidth: 420,
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    transform: [
      { translateY: -325 }
    ],
    backgroundColor: '#fff',
    height: 650,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E6EB',
    backgroundColor: '#fff',
  },
  closeText: {
    color: '#222',
    fontSize: 14,
  },
  phoneText: {
    fontSize: 14,
    color: '#8A8F99',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F7F8FA',
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 12,
    height: 36,
    padding: 2,
  },
  tabBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#E5E6EB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#8A8F99',
  },
  tabTextActive: {
    color: '#222',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileLabel: {
    fontSize: 13,
    color: '#8A8F99',
    width: 70,
  },
  profileValue: {
    fontSize: 13,
    color: '#222',
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  todoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFA940',
    marginRight: 8,
  },
  todoText: {
    fontSize: 13,
    color: '#222',
  },
  focusWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  focusTag: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  focusTagText: {
    fontSize: 13,
    color: '#222',
  },
  barrierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  barrierDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4D4F',
    marginRight: 8,
  },
  barrierText: {
    fontSize: 13,
    color: '#222',
  },
  callRecordItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  callRecordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  callRecordDate: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginRight: 8,
  },
  callRecordStatus: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#222',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  callRecordDuration: {
    fontSize: 12,
    color: '#8A8F99',
  },
  callRecordDesc: {
    fontSize: 13,
    color: '#8A8F99',
    marginLeft: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelBtn: {
    borderColor: '#E5E6EB',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
    minWidth: 100,
    height: 36,
  },
  cancelBtnText: {
    color: '#222',
    fontSize: 14,
  },
  confirmBtn: {
    backgroundColor: '#3B6CFF',
    borderRadius: 6,
    minWidth: 140,
    height: 36,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HistorySummaryModal; 