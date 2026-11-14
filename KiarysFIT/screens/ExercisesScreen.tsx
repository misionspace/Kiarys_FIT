import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';
import { Search, Filter, Dumbbell, X, Info } from 'lucide-react-native';
import { EXERCISES_DATA, Exercise } from '../data/exercises';

const FILTERS = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

export default function ExercisesScreen() {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const filteredExercises = EXERCISES_DATA.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === 'Todos' || ex.muscle === activeFilter || (activeFilter === 'Brazos' && (ex.muscle === 'Bíceps' || ex.muscle === 'Tríceps'));
        return matchesSearch && matchesFilter;
    });

    const getLevelColor = (level?: string) => {
        switch (level) {
            case 'Principiante': return Colors.success;
            case 'Intermedio': return Colors.warning;
            case 'Avanzado': return Colors.danger;
            default: return Colors.textSecondary;
        }
    };

    return (
        <ScreenContainer>
            <Text style={styles.header}>Biblioteca</Text>

            <View style={styles.searchContainer}>
                <Search color={Colors.textSecondary} size={20} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar ejercicio..."
                    placeholderTextColor={Colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredExercises}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.exerciseItem} onPress={() => setSelectedExercise(item)}>
                        <View style={styles.iconContainer}>
                            <Dumbbell color={Colors.text} size={24} />
                        </View>
                        <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{item.name}</Text>
                            <Text style={styles.exerciseMeta}>{item.muscle} • {item.equipment}</Text>
                        </View>
                        <View style={[styles.levelBadge, { borderColor: getLevelColor(item.level) }]}>
                            <Text style={[styles.levelText, { color: getLevelColor(item.level) }]}>{item.level || 'General'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />

            <Modal visible={!!selectedExercise} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedExercise(null)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
                        <TouchableOpacity onPress={() => setSelectedExercise(null)}>
                            <X color={Colors.text} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={styles.tagContainer}>
                            <View style={[styles.tag, { backgroundColor: Colors.card }]}>
                                <Text style={styles.tagText}>{selectedExercise?.muscle}</Text>
                            </View>
                            <View style={[styles.tag, { backgroundColor: Colors.card }]}>
                                <Text style={styles.tagText}>{selectedExercise?.equipment}</Text>
                            </View>
                            <View style={[styles.tag, { borderColor: getLevelColor(selectedExercise?.level), borderWidth: 1 }]}>
                                <Text style={[styles.tagText, { color: getLevelColor(selectedExercise?.level) }]}>{selectedExercise?.level}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ejecución</Text>
                            <Text style={styles.description}>{selectedExercise?.description || 'Sin descripción disponible.'}</Text>
                        </View>

                        {selectedExercise?.secondaryMuscles && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Músculos Secundarios</Text>
                                <Text style={styles.description}>{selectedExercise.secondaryMuscles.join(', ')}</Text>
                            </View>
                        )}

                        {selectedExercise?.benefits && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Beneficios</Text>
                                {selectedExercise.benefits.map((benefit, index) => (
                                    <View key={index} style={styles.bulletPoint}>
                                        <View style={styles.bullet} />
                                        <Text style={styles.description}>{benefit}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
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
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        color: Colors.text,
        marginLeft: 8,
        fontSize: 16,
    },
    filtersContainer: {
        marginBottom: 16,
        height: 40,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.card,
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
    },
    filterText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    filterTextActive: {
        color: Colors.background,
        fontWeight: 'bold',
    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    exerciseMeta: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    levelBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    levelText: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        flex: 1,
    },
    modalContent: {
        paddingBottom: 40,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    tag: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    tagText: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    description: {
        color: Colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.textSecondary,
        marginRight: 12,
    },
});
