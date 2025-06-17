import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ThemeProvider, createTheme, Text, Icon } from '@rneui/themed';
import { HomeScreen } from './src/screens/HomeScreen';
import { CallScreen } from './src/screens/CallScreen';
import { RootStackParamList } from './src/types/navigation';
import { CallOverlay } from './src/components/CallOverlay';
import { IncomingCallScreen } from './src/components/IncomingCallScreen';
import { socketService } from './src/services/socketService';
import { useCallStore } from './src/store/callStore';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Icon name="phone" type="feather" color="#fff" size={20} style={styles.headerIcon} />
      <Text style={styles.headerTitle}>销售助理</Text>
    </View>
    <View style={styles.headerRight}>
      <TouchableOpacity>
        <Icon name="refresh-cw" type="feather" color="#fff" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconSpace}>
        <Icon name="settings" type="feather" color="#fff" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconSpace}>
        <Icon name="maximize" type="feather" color="#fff" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconSpace}>
        <Icon name="x" type="feather" color="#fff" size={20} />
      </TouchableOpacity>
    </View>
  </View>
);

const NavigationBar = () => {
  const navigation = useNavigation<NavigationProps>();
  
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity 
        style={styles.toolbarItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="user" type="feather" color="#666" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarItem}>
        <Icon name="message-square" type="feather" color="#666" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarItem}>
        <Icon name="book-open" type="feather" color="#666" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarItem}>
        <Icon name="clock" type="feather" color="#666" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarItem}>
        <Icon name="file-text" type="feather" color="#666" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarItem}>
        <Icon name="user" type="feather" color="#666" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const HomeScreenWithLayout = (props: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <HomeScreen {...props} />
      </View>
      <NavigationBar />
    </View>
  );
};

const App = () => {
  useEffect(() => {
    // 初始化 Socket.IO 连接
    const socket = socketService.connect();

    // 初始化语音引擎
    useCallStore.getState().initEngine();

    return () => {
      // 清理连接
      socketService.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreenWithLayout}
          />
          <Stack.Screen
            name="Call"
            component={CallScreen}
          />
        </Stack.Navigator>
        <CallOverlay />
        <IncomingCallScreen />
      </NavigationContainer>
    </ThemeProvider>
  );
};

const theme = createTheme({});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    height: 44,
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpace: {
    marginLeft: 20,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  toolbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App; 