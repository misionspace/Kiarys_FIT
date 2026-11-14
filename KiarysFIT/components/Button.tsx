import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import Colors from '../constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary': return Colors.primary;
            case 'secondary': return Colors.card;
            case 'danger': return Colors.danger;
            default: return Colors.primary;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary': return '#000000'; // Black text on bright primary
            default: return Colors.text;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}
            onPress={onPress}
        >
            <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
