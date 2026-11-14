import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProgressScreen from '../screens/ProgressScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={BottomTabNavigator} />
            <Stack.Screen
                name="Progress"
                component={ProgressScreen}
                options={{
                    presentation: 'modal',
                    headerShown: false // ProgressScreen has its own header
                }}
            />
        </Stack.Navigator>
    );
}
