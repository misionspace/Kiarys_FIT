import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';
import { Calendar, Clock, ChevronRight, TrendingUp, X } from 'lucide-react-native';
import { useWorkout, FinishedWorkout } from '../context/WorkoutContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const { history } = useWorkout();
    const [selectedWorkout, setSelectedWorkout] = useState<FinishedWorkout | null>(null);

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    };

    const renderItem = ({ item }: { item: FinishedWorkout }) => (
        <TouchableOpacity style={styles.card} onPress={() => setSelectedWorkout(item)}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.workoutName}>{item.name}</Text>
                    <View style={styles.metaRow}>
                        <Calendar size={14} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{formatDate(item.date)}</Text>
                        <View style={styles.separator} />
                        <Clock size={14} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{formatDuration(item.duration)}</Text>
                    </View>
                </View>
                <ChevronRight color={Colors.textSecondary} />
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <TrendingUp size={16} color={Colors.success} />
                    <Text style={styles.statValue}>{item.volume}t</Text>
                    <Text style={styles.statLabel}>Volumen</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenContainer>
            <Text style={styles.header}>Historial</Text>

            {history.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No hay entrenamientos guardados aún.</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            {/* Detail Modal */}
            <Modal visible={!!selectedWorkout} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
                        <TouchableOpacity onPress={() => setSelectedWorkout(null)}>
                            <X color={Colors.text} size={24} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        {selectedWorkout?.exercises.map((ex, i) => (
                            <View key={i} style={styles.detailCard}>
                                <Text style={styles.detailExerciseName}>{ex.name}</Text>
                                {ex.sets.map((set, si) => (
                                    <View key={si} style={styles.detailSetRow}>
                                        <Text style={styles.detailSetNum}>{si + 1}</Text>
                                        <Text style={styles.detailSetData}>{set.weight}kg x {set.reps}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    workoutName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginLeft: 4,
    },
    separator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.textSecondary,
        marginHorizontal: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        color: Colors.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    statLabel: {
        color: Colors.textSecondary,
        fontSize: 12,
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    modalContent: {
        paddingBottom: 40,
    },
    detailCard: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    detailExerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    detailSetRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailSetNum: {
        width: 30,
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    detailSetData: {
        color: Colors.text,
    }
});
