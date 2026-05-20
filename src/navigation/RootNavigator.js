import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { AppContext } from '../context/AppContext';

import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import UploadQuestionScreen from '../screens/UploadQuestionScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { userProfile, isLoading, theme } = useContext(AppContext);
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const isLoggedIn = userProfile && userProfile.isLoggedIn;
  const isOnboarded = userProfile && userProfile.year;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
            <Stack.Screen 
              name="UploadQuestion" 
              component={UploadQuestionScreen} 
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
