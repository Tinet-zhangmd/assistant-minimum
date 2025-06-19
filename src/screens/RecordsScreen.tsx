import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon, Overlay, ListItem } from '@rneui/themed';
import { useCallRecordStore } from '../store/callRecordStore';
import type { CallRecord, CallStatus, CallRecordFilter } from '../types/callRecord';
import { useNavigation } from '@react-navigation/native';
import DropdownSelect, { DropdownOption } from '../components/DropdownSelect';

const STATUS_OPTIONS: DropdownOption[] = [
  { label: '全部', value: undefined },
  { label: '未接通', value: '未接通' },
  { label: '已接通', value: '已接通' },
];
const DURATION_OPTIONS: DropdownOption[] = [
  { label: '全部', value: undefined },
  { label: '0-1分钟', value: '0-1分钟' },
  { label: '1-5分钟', value: '1-5分钟' },
  { label: '5分钟以上', value: '5分钟以上' },
];

function formatDuration(sec: number) {
  if (!sec) return '--';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const PAGE_SIZE = 20;

export default function RecordsScreen() {
  const navigation = useNavigation();
  const {
    records, total, page, pageSize, loading, filter,
    loadRecords, setFilter, resetFilter
  } = useCallRecordStore();

  useEffect(() => {
    loadRecords(1);
  }, []);

  // 统计
  const totalConnected = React.useMemo(() => records.filter(r => r.status === '已接通').length, [records]);

  // 分页
  const totalPages = Math.ceil(total / pageSize);

  // 筛选
  const [statusIdx, setStatusIdx] = React.useState(1); // 默认未接通
  const [durationIdx, setDurationIdx] = React.useState(0);
  const statusValue = STATUS_OPTIONS[statusIdx].value;
  const durationValue = DURATION_OPTIONS[durationIdx].value;

  const handleStatusChange = (val: any, idx: number) => {
    setStatusIdx(idx);
    setFilter({ ...filter, status: STATUS_OPTIONS[idx].value });
  };
  const handleDurationChange = (val: any, idx: number) => {
    setDurationIdx(idx);
    setFilter({ ...filter, durationRange: DURATION_OPTIONS[idx].value as CallRecordFilter['durationRange'] });
  };
  const handleReset = () => {
    setStatusIdx(1);
    setDurationIdx(0);
    resetFilter();
  };

  // 跳转详情
  const handleRecordPress = (item: CallRecord) => {
    // @ts-ignore
    navigation.navigate('CallRecordDetail' as never, { recordId: item.id } as never);
  };

  // 分页切换
  const handlePrev = () => {
    if (page > 1) loadRecords(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) loadRecords(page + 1);
  };

  // 卡片
  const renderItem = ({ item }: { item: CallRecord }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleRecordPress(item)}>
      <View style={styles.cardLeft}>
        <View style={styles.iconCircle}>
          <Icon name="phone" type="feather" color="#2979ff" size={28} />
        </View>
      </View>
      <View style={styles.cardMid}>
        <Text style={styles.phone}>{item.phone}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Icon name="clock" type="feather" color="#b0b0b0" size={16} />
          <Text style={styles.time}>{item.callTime}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <View style={[styles.statusTag, item.status === '已接通' ? styles.statusSuccess : styles.statusFail]}>
          <Text style={item.status === '已接通' ? styles.statusTextSuccess : styles.statusTextFail}>{item.status}</Text>
        </View>
        <Text style={styles.arrow}>&gt;</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f8fa' }}>
      {/* 顶部蓝色栏 */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>通话记录</Text>
      </View>
      {/* 统计 */}
      <View style={styles.statsRow}>
        <View style={styles.statsBox}>
          <Text style={styles.statsNum}>{total}</Text>
          <Text style={styles.statsLabel}>总通话</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={[styles.statsNum, { color: '#22bb66' }]}>{totalConnected}</Text>
          <Text style={styles.statsLabel}>已接通</Text>
        </View>
      </View>
      {/* 筛选栏 */}
      <View style={styles.filterBar}>
        <View style={styles.filterCol}>
          <Icon name="filter" type="feather" color="#b0b0b0" size={18} style={{ marginRight: 4, alignSelf: 'flex-start' }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.filterLabel}>通话结果</Text>
            <DropdownSelect
              options={STATUS_OPTIONS}
              value={statusValue}
              onChange={handleStatusChange}
              dropdownWidth={110}
            />
          </View>
        </View>
        <View style={styles.filterCol}>
          <View style={{ flex: 1 }}>
            <Text style={styles.filterLabel}>通话时长</Text>
            <DropdownSelect
              options={DURATION_OPTIONS}
              value={durationValue}
              onChange={handleDurationChange}
              dropdownWidth={110}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetText}>重置</Text>
        </TouchableOpacity>
      </View>
      {/* 列表 */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2979ff" />
        ) : (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
      {/* 分页栏 */}
      <View style={styles.pageBar}>
        <TouchableOpacity style={styles.pageBtn} onPress={handlePrev} disabled={page === 1}>
          <Text style={[styles.pageBtnText, page === 1 && { color: '#ccc' }]}>上一页</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>第 {page} 页，共 {totalPages} 页</Text>
        <TouchableOpacity style={styles.pageBtn} onPress={handleNext} disabled={page === totalPages}>
          <Text style={[styles.pageBtnText, page === totalPages && { color: '#ccc' }]}>下一页</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#2979ff',
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  statsBox: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  statsNum: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2979ff',
    textAlign: 'center',
  },
  statsLabel: {
    fontSize: 16,
    color: '#888',
    marginTop: 2,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  filterCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterSelect: {
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 4,
  },
  filterSelectText: {
    fontSize: 16,
    color: '#222',
  },
  resetBtn: {
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 8,
  },
  resetText: {
    color: '#2979ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    marginRight: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMid: {
    flex: 1,
  },
  phone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  time: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusTag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusSuccess: {
    backgroundColor: '#2979ff',
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
  arrow: {
    color: '#b0b0b0',
    fontSize: 22,
    fontWeight: 'bold',
  },
  pageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f6f8fa',
  },
  pageBtnText: {
    color: '#2979ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    color: '#222',
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e3e7',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 90,
    marginLeft: 4,
  },
  dropdownText: {
    fontSize: 16,
    color: '#222',
  },
  dropdownOverlay: {
    padding: 0,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    minWidth: 120,
    marginTop: 8,
  },
  dropdownItem: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  dropdownItemActive: {
    backgroundColor: '#f6f8fa',
  },
  dropdownItemText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '400',
  },
  filterLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 4,
  },
});