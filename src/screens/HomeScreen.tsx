import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

// 临时数据
const mockTasks = [
  {
    id: 1,
    customerName: '张三',
    phoneNumber: '13800138000',
    priority: '高',
    description: '潜在客户跟进',
  },
  {
    id: 2,
    customerName: '李四',
    phoneNumber: '13900139000',
    priority: '中',
    description: '产品介绍',
  },
];

export const HomeScreen: React.FC<Props> = () => {
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const navigation = useNavigation<NavigationProps>();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 模拟加载数据
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCardPress = (customerName: string, phoneNumber: string) => {
    navigation.navigate('Call', { customerName, phoneNumber });
  };

  const renderTaskCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => handleCardPress(item.customerName, item.phoneNumber)}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.customerName}</Text>
            <View style={styles.priorityTag}>
              <Text style={styles.priorityText}>{item.priority}</Text>
            </View>
          </View>
        </View>
        <View style={styles.phoneContainer}>
          <Text style={styles.phone}>{item.phoneNumber}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>待处理任务</Text>
        <Text style={styles.subtitle}>点击任务开始销售辅助</Text>
      </View>
      <FlatList
        data={mockTasks}
        renderItem={renderTaskCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
  },
  listContainer: {
    padding: 12,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  priorityTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  priorityText: {
    color: '#FF9800',
    fontSize: 12,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phone: {
    color: '#666',
    fontSize: 14,
  },
  description: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
}); 