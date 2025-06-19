import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import CallSessionScreen from './src/screens/CallSessionScreen';
import { socketService } from './src/services/socketService';
import { useCallStore } from './src/store/callStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const initEngine = useCallStore(state => state.initEngine);
  useEffect(() => {
    // 初始化声网引擎
    initEngine();
    
    // 初始化 Socket.IO 连接
    socketService.connect();

    return () => {
      // 在应用退出时断开连接
      socketService.disconnect();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="CallSession" component={CallSessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 