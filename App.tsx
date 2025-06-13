import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ThemeProvider, createTheme, Text, Icon } from '@rneui/themed';
import HomeScreen from './src/screens/HomeScreen';
import CallScreen from './src/screens/CallScreen';
import { RootStackParamList } from './src/types/navigation';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const Header: React.FC = () => (
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

const NavigationBar: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  
  const navigateToCall = () => {
    navigation.navigate('Call', {
      customerName: '张三',
      phoneNumber: '13800138000'
    });
  };

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity 
        style={styles.toolbarItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="user" type="feather" color="#666" size={20} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.toolbarItem}
        onPress={navigateToCall}
      >
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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.container}>
    <Header />
    <View style={styles.content}>
      {children}
    </View>
    <NavigationBar />
  </View>
);

function NavigationScreenWrapper<T extends keyof RootStackParamList>(
  WrappedComponent: React.ComponentType<NativeStackScreenProps<RootStackParamList, T>>,
  screenName: T
) {
  return function NavigationScreen(props: NativeStackScreenProps<RootStackParamList, T>) {
    return (
      <Layout>
        <WrappedComponent {...props} />
      </Layout>
    );
  };
}

const HomeScreenWithNavigation = NavigationScreenWrapper(HomeScreen, 'Home');
const CallScreenWithNavigation = NavigationScreenWrapper(CallScreen, 'Call');

const App: React.FC = () => {
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
            component={HomeScreenWithNavigation}
          />
          <Stack.Screen
            name="Call"
            component={CallScreenWithNavigation}
          />
        </Stack.Navigator>
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
    height: '100%',
  },
});

export default App; 