import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

interface ScreenContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export default function ScreenContainer({ children, style }: ScreenContainerProps) {
    return (
        <SafeAreaView style={[styles.container, style]}>
            <View style={styles.content}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        padding: 16,
    },
});
