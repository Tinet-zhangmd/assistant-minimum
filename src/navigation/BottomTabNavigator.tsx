import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import PhoneScreen from '../screens/PhoneScreen';
import RecordsScreen from '../screens/RecordsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = '';
        if (route.name === '电话') iconName = 'phone';
        if (route.name === '记录') iconName = 'file-text';
        if (route.name === '看板') iconName = 'calendar';
        if (route.name === '我的') iconName = 'user';

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={1}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Icon 
              name={iconName} 
              type="feather" 
              color={isFocused ? '#2979ff' : '#888'} 
              size={24} 
            />
            <Text style={[
              styles.tabLabel,
              { color: isFocused ? '#2979ff' : '#888' }
            ]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="电话" component={PhoneScreen} />
      <Tab.Screen name="记录" component={RecordsScreen} />
      <Tab.Screen name="看板" component={DashboardScreen} />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 64,
    paddingBottom: 8,
    paddingTop: 4,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 15,
    marginTop: 2,
  },
}); 