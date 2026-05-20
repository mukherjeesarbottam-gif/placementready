import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Code, Brain, FileText, User, Map, Calendar, Globe } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/theme';

import DashboardScreen from '../screens/DashboardScreen';
import DSATrackerScreen from '../screens/DSATrackerScreen';
import AptitudeTrackerScreen from '../screens/AptitudeTrackerScreen';
import ResumeScreen from '../screens/ResumeScreen';
import RoadmapScreen from '../screens/RoadmapScreen';
import DailyPlannerScreen from '../screens/DailyPlannerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommunityScreen from '../screens/CommunityScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { theme } = useContext(AppContext);
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? colors.background.dark : colors.background.light,
        },
        headerTintColor: isDark ? colors.text.dark : colors.text.light,
        tabBarStyle: {
          backgroundColor: isDark ? colors.card.dark : colors.card.light,
          borderTopColor: isDark ? colors.border.dark : colors.border.light,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textMuted.dark : colors.textMuted.light,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Globe color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Planner" 
        component={DailyPlannerScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="DSA" 
        component={DSATrackerScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Code color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Aptitude" 
        component={AptitudeTrackerScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Brain color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Resume" 
        component={ResumeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Roadmap" 
        component={RoadmapScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
