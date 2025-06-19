import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import PhoneScreen from '../screens/PhoneScreen';
import RecordsScreen from '../screens/RecordsScreen';
import DashboardScreen from '../screens/DashboardScreen';
// 下面的页面可先用占位组件
const ProfileScreen = () => <></>;

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = '';
          if (route.name === '电话') iconName = 'phone';
          if (route.name === '记录') iconName = 'file-text';
          if (route.name === '看板') iconName = 'calendar';
          if (route.name === '我的') iconName = 'user';
          return <Icon name={iconName} type="feather" color={focused ? '#2979ff' : '#888'} size={24} />;
        },
        tabBarActiveTintColor: '#2979ff',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 15, marginTop: 2 },
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 4 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="电话" component={PhoneScreen} />
      <Tab.Screen name="记录" component={RecordsScreen} />
      <Tab.Screen name="看板" component={DashboardScreen} />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
} 