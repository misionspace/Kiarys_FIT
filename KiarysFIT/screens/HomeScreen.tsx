import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';
import { Dumbbell, Clock, Calendar, ChevronRight, FileText, TrendingUp } from 'lucide-react-native';
import { useWorkout } from '../context/WorkoutContext';
import { useTimer } from '../context/TimerContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { history } = useWorkout();
    const { timeLeft, isActive } = useTimer();

    const lastWorkout = history.length > 0 ? history[0] : null;

    // Calculate weekly stats
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekWorkouts = history.filter(w => new Date(w.date) >= startOfWeek);

    const workoutsCount = weekWorkouts.length;
    const totalDuration = weekWorkouts.reduce((acc, curr) => acc + curr.duration, 0);
    const totalVolume = weekWorkouts.reduce((acc, curr) => acc + curr.volume, 0);

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        return `${hrs}h ${Math.floor((seconds % 3600) / 60)}m`;
    };

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.header}>Hola, Fernando 👋</Text>
                <Text style={styles.subHeader}>Listo para entrenar hoy?</Text>

                {/* Resumen Semanal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Esta Semana</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{workoutsCount}</Text>
                            <Text style={styles.statLabel}>Entrenos</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{formatDuration(totalDuration)}</Text>
                            <Text style={styles.statLabel}>Tiempo</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{totalVolume.toFixed(1)}t</Text>
                            <Text style={styles.statLabel}>Volumen</Text>
                        </View>
                    </View>
                </View>

                {/* Último Entrenamiento */}
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Historial')}>
                    <View style={styles.cardIcon}>
                        <Calendar color={Colors.primary} size={24} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Último Entrenamiento</Text>
                        {lastWorkout ? (
                            <Text style={styles.cardSubtitle}>{lastWorkout.name} • {new Date(lastWorkout.date).toLocaleDateString()}</Text>
                        ) : (
                            <Text style={styles.cardSubtitle}>Sin historial reciente</Text>
                        )}

                    </View>
                    <ChevronRight color={Colors.textSecondary} size={20} />
                </TouchableOpacity>

                {/* Descanso Actual */}
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Descanso')}>
                    <View style={[styles.cardIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                        <Clock color={Colors.success} size={24} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Descanso</Text>
                        {isActive ? (
                            <Text style={[styles.cardSubtitle, { color: Colors.success, fontWeight: 'bold' }]}>
                                En curso: {formatTimer(timeLeft)}
                            </Text>
                        ) : (
                            <Text style={styles.cardSubtitle}>Temporizador inactivo</Text>
                        )}
                    </View>
                    <ChevronRight color={Colors.textSecondary} size={20} />
                </TouchableOpacity>

                {/* Progreso */}
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Progress')}>
                    <View style={[styles.cardIcon, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                        <TrendingUp color={'#9C27B0'} size={24} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Progreso</Text>
                        <Text style={styles.cardSubtitle}>Peso, medidas y fotos</Text>
                    </View>
                    <ChevronRight color={Colors.textSecondary} size={20} />
                </TouchableOpacity>

                {/* Ejercicios */}
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Ejercicios')}>
                    <View style={[styles.cardIcon, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                        <FileText color={Colors.warning} size={24} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Biblioteca de Ejercicios</Text>
                        <Text style={styles.cardSubtitle}>Explorar base de datos</Text>
                    </View>
                    <ChevronRight color={Colors.textSecondary} size={20} />
                </TouchableOpacity>

                {/* Acceso Rápido Entrenar */}
                <TouchableOpacity
                    style={[styles.featuredCard, { marginTop: 10 }]}
                    onPress={() => navigation.navigate('Entrenar')}
                >
                    <Dumbbell color={Colors.background} size={32} />
                    <Text style={styles.featuredTitle}>Iniciar Entrenamiento</Text>
                </TouchableOpacity>

            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    subHeader: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        width: '31%',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    actionCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 209, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    featuredCard: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    featuredTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.background,
    },
});
