import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import Colors from './constants/Colors';

import { WorkoutProvider } from './context/WorkoutContext';

import { TimerProvider } from './context/TimerContext';

export default function App() {
    return (
        <SafeAreaProvider>
            <WorkoutProvider>
                <TimerProvider>
                    <NavigationContainer>
                        <RootNavigator />
                        <StatusBar style="light" backgroundColor={Colors.background} />
                    </NavigationContainer>
                </TimerProvider>
            </WorkoutProvider>
        </SafeAreaProvider>
    );
}
