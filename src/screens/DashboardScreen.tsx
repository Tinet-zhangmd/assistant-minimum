import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';

// Mock数据
const MOCK_CALL_DATA = {
  today: {
    outbound: 45,
    connected: 32
  },
  weekly: [
    { date: '06/13', outbound: 53, connected: 45 },
    { date: '06/14', outbound: 47, connected: 25 },
    { date: '06/15', outbound: 48, connected: 14 },
    { date: '06/16', outbound: 42, connected: 28 },
    { date: '06/17', outbound: 53, connected: 50 },
    { date: '06/18', outbound: 45, connected: 5 },
    { date: '06/19', outbound: 65, connected: 24 }
  ],
  failureReasons: [
    { reason: '客户在忙', count: 12 },
    { reason: '停机', count: 8 },
    { reason: '关机', count: 3 },
    { reason: '无人接听', count: 6 },
    { reason: '无法接通', count: 4 },
    { reason: '其他', count: 2 }
  ],
  duration: {
    average: '5分32秒',
    total: '3小时42分钟'
  }
};

const MOCK_CUSTOMER_DATA = {
  today: {
    outbound: 38,
    connected: 28
  },
  weekly: [
    { date: '06/13', outbound: 42, contacted: 20 },
    { date: '06/14', outbound: 46, contacted: 5 },
    { date: '06/15', outbound: 22, contacted: 14 },
    { date: '06/16', outbound: 45, contacted: 12 },
    { date: '06/17', outbound: 23, contacted: 12 },
    { date: '06/18', outbound: 46, contacted: 17 },
    { date: '06/19', outbound: 48, contacted: 37 }
  ],
  results: [
    { level: '高意向', count: 6, color: '#ffebee' },
    { level: '中意向', count: 8, color: '#fff3e0' },
    { level: '低意向', count: 7, color: '#fff9c4' },
    { level: '未明确意向', count: 4, color: '#e3f2fd' },
    { level: '无效客户', count: 3, color: '#f5f5f5' }
  ]
};

const { width: screenWidth } = Dimensions.get('window');
const maxBarWidth = screenWidth * 0.45; // 条形图最大宽度

const DashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calls'); // calls or customers

  // 找出最大值用于计算比例
  const maxCallValue = Math.max(
    ...MOCK_CALL_DATA.weekly.map(d => Math.max(d.outbound, d.connected)),
    ...MOCK_CUSTOMER_DATA.weekly.map(d => Math.max(d.outbound, d.contacted))
  );

  // 计算条形图宽度的辅助函数
  const calculateBarWidth = (value: number) => {
    return (value / maxCallValue) * maxBarWidth;
  };

  // 计算进度条宽度的辅助函数
  const calculateProgressWidth = (connected: number, outbound: number) => {
    return maxBarWidth * (connected / outbound);
  };

  const renderCallsContent = () => (
    <ScrollView style={styles.content}>
      {/* 今日通话概览 */}
      <Text style={styles.sectionTitle}>今日通话概览</Text>
      <View style={styles.cardRow}>
        <View style={styles.overviewCard}>
          <Icon name="phone-outgoing" type="material-community" color="#2979ff" size={32} />
          <Text style={styles.cardNumber}>{MOCK_CALL_DATA.today.outbound}</Text>
          <Text style={styles.cardLabel}>外呼通话数</Text>
        </View>
        <View style={styles.overviewCard}>
          <Icon name="phone-check" type="material-community" color="#4caf50" size={32} />
          <Text style={styles.cardNumber}>{MOCK_CALL_DATA.today.connected}</Text>
          <Text style={styles.cardLabel}>接通通话数</Text>
        </View>
      </View>

      {/* 本周通话趋势 */}
      <Text style={styles.sectionTitle}>本周通话趋势</Text>
      <View style={styles.chartCard}>
        {MOCK_CALL_DATA.weekly.map((day) => (
          <View key={day.date} style={styles.chartRow}>
            <View style={styles.dateColumn}>
              <Text style={styles.dateText}>{day.date}</Text>
            </View>
            <View style={styles.dataColumn}>
              <View style={styles.textContainer}>
                <Text style={styles.outboundText}>外呼: {day.outbound}</Text>
                <Text style={styles.connectedText}>接通: {day.connected}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: calculateProgressWidth(day.connected, day.outbound) }
                  ]} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 未接通原因分布 */}
      <Text style={styles.sectionTitle}>未接通原因分布</Text>
      <View style={styles.reasonsCard}>
        <View style={styles.reasonsGrid}>
          {MOCK_CALL_DATA.failureReasons.map((item) => (
            <View key={item.reason} style={styles.reasonItem}>
              <Text style={styles.reasonCount}>{item.count}</Text>
              <Text style={styles.reasonText}>{item.reason}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 通话时长统计 */}
      <View style={styles.cardRow}>
        <View style={[styles.durationCard, styles.flex1]}>
          <Text style={styles.durationNumber}>{MOCK_CALL_DATA.duration.average}</Text>
          <Text style={styles.durationLabel}>今日平均通话时长</Text>
        </View>
        <View style={[styles.durationCard, styles.flex1]}>
          <Text style={[styles.durationNumber, styles.totalDuration]}>{MOCK_CALL_DATA.duration.total}</Text>
          <Text style={styles.durationLabel}>今日总通话时长</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderCustomersContent = () => (
    <ScrollView style={styles.content}>
      {/* 今日客户概览 */}
      <Text style={styles.sectionTitle}>今日客户概览</Text>
      <View style={styles.cardRow}>
        <View style={styles.overviewCard}>
          <Icon name="account-multiple" type="material-community" color="#9c27b0" size={32} />
          <Text style={styles.cardNumber}>{MOCK_CUSTOMER_DATA.today.outbound}</Text>
          <Text style={styles.cardLabel}>外呼客户数</Text>
        </View>
        <View style={styles.overviewCard}>
          <Icon name="trending-up" type="material-community" color="#ff9800" size={32} />
          <Text style={styles.cardNumber}>{MOCK_CUSTOMER_DATA.today.connected}</Text>
          <Text style={styles.cardLabel}>接通客户数</Text>
        </View>
      </View>

      {/* 本周客户联系趋势 */}
      <Text style={styles.sectionTitle}>本周客户联系趋势</Text>
      <View style={styles.chartCard}>
        {MOCK_CUSTOMER_DATA.weekly.map((day) => (
          <View key={day.date} style={styles.chartRow}>
            <View style={styles.dateColumn}>
              <Text style={styles.dateText}>{day.date}</Text>
            </View>
            <View style={styles.dataColumn}>
              <View style={styles.textContainer}>
                <Text style={styles.outboundText}>外呼: {day.outbound}</Text>
                <Text style={styles.connectedText}>联系: {day.contacted}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: calculateProgressWidth(day.contacted, day.outbound) }
                  ]} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 沟通结果分布 */}
      <Text style={styles.sectionTitle}>沟通结果分布</Text>
      <View style={styles.resultsCard}>
        {MOCK_CUSTOMER_DATA.results.map((item) => (
          <View key={item.level} style={styles.resultItem}>
            <View style={[styles.resultTag, { backgroundColor: item.color }]}>
              <Text style={styles.resultText}>{item.level}</Text>
            </View>
            <Text style={styles.resultCount}>{item.count}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>数据看板</Text>
      </View>

      {/* Tab切换栏 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'calls' && styles.activeTab]}
          onPress={() => setActiveTab('calls')}
        >
          <Text style={[styles.tabText, activeTab === 'calls' && styles.activeTabText]}>通话统计</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'customers' && styles.activeTab]}
          onPress={() => setActiveTab('customers')}
        >
          <Text style={[styles.tabText, activeTab === 'customers' && styles.activeTabText]}>客户盘点</Text>
        </TouchableOpacity>
      </View>

      {/* 内容区 */}
      {activeTab === 'calls' ? renderCallsContent() : renderCustomersContent()}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2979ff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2979ff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginVertical: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  chartRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  dateColumn: {
    width: 60,
  },
  dateText: {
    fontSize: 15,
    color: '#666',
  },
  dataColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  textContainer: {
    width: 100,
  },
  outboundText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  connectedText: {
    fontSize: 15,
    color: '#4CAF50',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2979ff',
    borderRadius: 4,
  },
  reasonsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reasonItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  reasonCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  durationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  durationNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2979ff',
    marginBottom: 8,
  },
  totalDuration: {
    color: '#4caf50',
  },
  durationLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultText: {
    fontSize: 14,
    color: '#222',
  },
  resultCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
});

export default DashboardScreen;