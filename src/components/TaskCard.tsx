import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Task } from '../types/task';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('Call', {
      customerName: task.name,
      phoneNumber: task.phone,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{task.name}</Text>
            {task.isPriority && (
              <View style={styles.priorityTag}>
                <Text style={styles.priorityText}>优先</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.phone}>{task.phone}</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
  phone: {
    color: '#666',
    fontSize: 14,
    marginBottom: 6,
  },
  description: {
    color: '#666',
    fontSize: 14,
    lineHeight: 18,
  },
});

export default TaskCard; 