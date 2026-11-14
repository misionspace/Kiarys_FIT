import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Dumbbell, History, Clock, FileText } from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import HistoryScreen from '../screens/HistoryScreen';
import RestScreen from '../screens/RestScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.tabBar,
                    borderTopColor: 'transparent',
                },
                tabBarActiveTintColor: Colors.tabIconSelected,
                tabBarInactiveTintColor: Colors.tabIconDefault,
                tabBarShowLabel: true,
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Entrenar"
                component={WorkoutScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Historial"
                component={HistoryScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Descanso"
                component={RestScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Ejercicios"
                component={ExercisesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}
