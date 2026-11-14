import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Keyboard, TouchableWithoutFeedback } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';
import { Play, Pause, RotateCcw, Calculator } from 'lucide-react-native';
import { useTimer } from '../context/TimerContext';

const PRESETS = [30, 60, 90, 120, 180];

export default function RestScreen() {
    const { timeLeft, initialTime, isActive, toggleTimer, resetTimer, addTime, setPreset } = useTimer();
    const [customModalVisible, setCustomModalVisible] = useState(false);
    const [customInput, setCustomInput] = useState('');

    const handleCustomSubmit = () => {
        const seconds = parseInt(customInput);
        if (!isNaN(seconds) && seconds > 0) {
            setPreset(seconds);
            setCustomModalVisible(false);
            setCustomInput('');
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <ScreenContainer style={styles.container}>
            <Text style={styles.title}>Descanso</Text>

            <View style={styles.timerContainer}>
                <View style={[styles.circle, { borderColor: isActive ? Colors.success : Colors.primary }]}>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    <Text style={styles.statusText}>{isActive ? 'Descansando...' : 'Listo'}</Text>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
                    <RotateCcw color={Colors.text} size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.playButton, isActive && styles.pauseButton]}
                    onPress={toggleTimer}
                >
                    {isActive ? (
                        <Pause color={Colors.background} size={32} fill={Colors.background} />
                    ) : (
                        <Play color={Colors.background} size={32} fill={Colors.background} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setCustomModalVisible(true)}
                >
                    <Calculator color={Colors.text} size={24} />
                </TouchableOpacity>
            </View>

            <View style={styles.adjustments}>
                <TouchableOpacity style={styles.adjButton} onPress={() => addTime(30)}>
                    <Text style={styles.adjText}>+30s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adjButton} onPress={() => addTime(60)}>
                    <Text style={styles.adjText}>+1m</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.presets}>
                {PRESETS.map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.presetButton, initialTime === t && styles.presetButtonActive]}
                        onPress={() => setPreset(t)}
                    >
                        <Text style={[styles.presetText, initialTime === t && styles.presetTextActive]}>{t}s</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Modal visible={customModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setCustomModalVisible(false); }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Tiempo Personalizado (s)</Text>
                            <TextInput
                                style={styles.modalInput}
                                keyboardType="numeric"
                                placeholder="Ej: 45"
                                placeholderTextColor={Colors.textSecondary}
                                autoFocus
                                value={customInput}
                                onChangeText={setCustomInput}
                            />
                            <TouchableOpacity style={styles.modalButton} onPress={handleCustomSubmit}>
                                <Text style={styles.modalButtonText}>Establecer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: 20,
    },
    timerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    circle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(30,30,30,0.5)',
    },
    timerText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: Colors.text,
        fontVariant: ['tabular-nums'],
    },
    statusText: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginTop: 8,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40,
        marginBottom: 20,
    },
    controlButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    pauseButton: {
        backgroundColor: Colors.warning,
        shadowColor: Colors.warning,
    },
    adjustments: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 30,
    },
    adjButton: {
        backgroundColor: Colors.card,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    adjText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    presets: {
        flexDirection: 'row',
        gap: 12,
    },
    presetButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: Colors.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.textSecondary,
    },
    presetButtonActive: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(0, 209, 255, 0.1)',
    },
    presetText: {
        color: Colors.text,
        fontSize: 14,
    },
    presetTextActive: {
        color: Colors.primary,
        fontWeight: 'bold',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.card,
        padding: 24,
        borderRadius: 16,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    modalInput: {
        backgroundColor: Colors.background,
        width: '100%',
        padding: 12,
        borderRadius: 8,
        color: Colors.text,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 16,
    },
    modalButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: Colors.background,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
