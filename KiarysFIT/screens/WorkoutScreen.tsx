import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import ExercisePicker from '../components/ExercisePicker';
import { Plus, MoreHorizontal, Check, Trash2, X, ClipboardList, ChevronRight } from 'lucide-react-native';
import { Exercise, EXERCISES_DATA } from '../data/exercises';
import { useWorkout } from '../context/WorkoutContext';
import { WORKOUT_TEMPLATES } from '../data/templates';

interface WorkoutSet {
    id: string;
    weight: string;
    reps: string;
    completed: boolean;
}

interface WorkoutExercise extends Exercise {
    sets: WorkoutSet[];
}

export default function WorkoutScreen({ navigation }: any) {
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [templateModalVisible, setTemplateModalVisible] = useState(false);
    const [workoutName, setWorkoutName] = useState('Nuevo Entrenamiento');
    const [startTime] = useState(new Date());

    const loadTemplate = (templateId: string) => {
        const template = WORKOUT_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        setWorkoutName(template.name);

        const newExercises: WorkoutExercise[] = template.exercises
            .map(te => {
                const exerciseData = EXERCISES_DATA.find(e => e.id === te.exerciseId);
                if (!exerciseData) return null;

                const initialSets: WorkoutSet[] = Array.from({ length: te.sets }).map(() => ({
                    id: Math.random().toString(36).substr(2, 9),
                    weight: '',
                    reps: '',
                    completed: false
                }));

                return {
                    ...exerciseData,
                    sets: initialSets
                };
            })
            .filter((e): e is WorkoutExercise => e !== null);

        setExercises(newExercises);
        setTemplateModalVisible(false);
    };

    const addExercise = (exercise: Exercise) => {
        setExercises(prev => [...prev, { ...exercise, sets: [{ id: Date.now().toString(), weight: '', reps: '', completed: false }] }]);
    };

    const removeExercise = (exerciseIndex: number) => {
        Alert.alert(
            "Eliminar Ejercicio",
            "¿Estás seguro?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        setExercises(prev => prev.filter((_, i) => i !== exerciseIndex));
                    }
                }
            ]
        );
    };

    const addSet = (exerciseIndex: number) => {
        setExercises(prev => prev.map((ex, i) => {
            if (i !== exerciseIndex) return ex;
            const lastSet = ex.sets[ex.sets.length - 1];
            const newSet: WorkoutSet = {
                id: Date.now().toString(),
                weight: lastSet ? lastSet.weight : '',
                reps: lastSet ? lastSet.reps : '',
                completed: false
            };
            return { ...ex, sets: [...ex.sets, newSet] };
        }));
    };

    const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
        setExercises(prev => prev.map((ex, i) => {
            if (i !== exerciseIndex) return ex;
            const newSets = [...ex.sets];
            newSets[setIndex] = { ...newSets[setIndex], [field]: value };
            return { ...ex, sets: newSets };
        }));
    };

    const toggleSet = (exerciseIndex: number, setIndex: number) => {
        setExercises(prev => prev.map((ex, i) => {
            if (i !== exerciseIndex) return ex;
            const newSets = [...ex.sets];
            newSets[setIndex] = { ...newSets[setIndex], completed: !newSets[setIndex].completed };
            return { ...ex, sets: newSets };
        }));
    };

    const removeSet = (exerciseIndex: number, setIndex: number) => {
        setExercises(prev => prev.map((ex, i) => {
            if (i !== exerciseIndex) return ex;
            if (ex.sets.length <= 1) return ex; // Don't remove the last set
            return { ...ex, sets: ex.sets.filter((_, si) => si !== setIndex) };
        }));
    };

    const { saveWorkout } = useWorkout();

    const finishWorkout = () => {
        if (exercises.length === 0) {
            Alert.alert("Entrenamiento Vacío", "Añade ejercicios antes de terminar.");
            return;
        }

        Alert.alert(
            "Terminar Entrenamiento",
            "¿Guardar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Terminar",
                    onPress: async () => {
                        // Calculate total volume (tonnage)
                        let totalVolume = 0;
                        exercises.forEach(ex => {
                            ex.sets.forEach(set => {
                                if (set.completed && set.weight && set.reps) {
                                    totalVolume += parseFloat(set.weight) * parseFloat(set.reps);
                                }
                            });
                        });

                        // Convert volume to 'tons' if heavy, or keep kg
                        // Simple logic: just sum of weight * reps
                        const volumeInTons = totalVolume / 1000;

                        await saveWorkout({
                            name: workoutName,
                            date: new Date().toISOString(),
                            duration: (new Date().getTime() - startTime.getTime()) / 1000,
                            exercises: exercises,
                            volume: parseFloat(volumeInTons.toFixed(2))
                        });

                        setExercises([]);
                        setWorkoutName('Nuevo Entrenamiento');
                        navigation.navigate('Historial');
                    }
                }
            ]
        );
    };

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <View>
                    <TextInput
                        style={styles.titleInput}
                        value={workoutName}
                        onChangeText={setWorkoutName}
                        placeholder="Nombre del entreno"
                        placeholderTextColor={Colors.textSecondary}
                    />
                    <Text style={styles.subtitle}>En progreso • {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <Button title="Terminar" onPress={finishWorkout} style={{ paddingVertical: 8, paddingHorizontal: 16 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {exercises.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Comienza añadiendo un ejercicio</Text>
                        <View style={styles.emptyButtons}>
                            <Button title="Añadir Ejercicio" onPress={() => setPickerVisible(true)} />
                            <TouchableOpacity style={styles.templateButton} onPress={() => setTemplateModalVisible(true)}>
                                <ClipboardList color={Colors.primary} size={20} />
                                <Text style={styles.templateButtonText}>Usar Plantilla</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    exercises.map((exercise, exerciseIndex) => (
                        <View key={`${exercise.id}-${exerciseIndex}`} style={styles.exerciseCard}>
                            <View style={styles.exerciseHeader}>
                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                                <TouchableOpacity onPress={() => removeExercise(exerciseIndex)}>
                                    <MoreHorizontal color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.tableHeader}>
                                <Text style={styles.colSet}>SET</Text>
                                <Text style={styles.colPrev}>PREV</Text>
                                <Text style={styles.colInput}>KG</Text>
                                <Text style={styles.colInput}>REPS</Text>
                                <Text style={styles.colCheck}>✓</Text>
                            </View>

                            {exercise.sets.map((set, setIndex) => (
                                <View key={set.id} style={[styles.setRow, set.completed && styles.setRowCompleted]}>
                                    <Text style={styles.colSet}>{setIndex + 1}</Text>
                                    <Text style={styles.colPrev}>-</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={set.weight}
                                        onChangeText={(val) => updateSet(exerciseIndex, setIndex, 'weight', val)}
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor={Colors.textSecondary}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={set.reps}
                                        onChangeText={(val) => updateSet(exerciseIndex, setIndex, 'reps', val)}
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor={Colors.textSecondary}
                                    />
                                    <TouchableOpacity
                                        style={[styles.checkButton, set.completed && styles.checkButtonActive]}
                                        onPress={() => toggleSet(exerciseIndex, setIndex)}
                                        onLongPress={() => removeSet(exerciseIndex, setIndex)}
                                    >
                                        <Check color={set.completed ? '#000' : Colors.textSecondary} size={16} />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exerciseIndex)}>
                                <Plus color={Colors.primary} size={16} />
                                <Text style={styles.addSetText}>Añadir Serie</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                {exercises.length > 0 && (
                    <Button
                        title="Añadir Ejercicio"
                        variant="secondary"
                        onPress={() => setPickerVisible(true)}
                        style={{ marginBottom: 20 }}
                    />
                )}
            </ScrollView>

            <ExercisePicker
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                onSelectExercise={addExercise}
            />

            <Modal visible={templateModalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Elige una Rutina</Text>
                        <TouchableOpacity onPress={() => setTemplateModalVisible(false)}>
                            <X color={Colors.text} size={24} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={WORKOUT_TEMPLATES}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.templateItem} onPress={() => loadTemplate(item.id)}>
                                <View style={styles.templateIcon}>
                                    <ClipboardList color={Colors.primary} size={24} />
                                </View>
                                <View>
                                    <Text style={styles.templateName}>{item.name}</Text>
                                    <Text style={styles.templateCount}>{item.exercises.length} Ejercicios</Text>
                                </View>
                                <ChevronRight color={Colors.textSecondary} size={20} style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        minWidth: 150,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
        marginBottom: 20,
        fontSize: 16,
    },
    emptyButtons: {
        gap: 16,
        alignItems: 'center',
        width: '100%',
    },
    templateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        gap: 8,
    },
    templateButtonText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    exerciseCard: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 4,
    },
    setRowCompleted: {
        opacity: 0.5,
    },
    colSet: { width: 30, textAlign: 'center', color: Colors.textSecondary, fontWeight: 'bold' },
    colPrev: { flex: 1, textAlign: 'center', color: Colors.textSecondary, fontSize: 12 },
    colInput: { flex: 1, textAlign: 'center', color: Colors.textSecondary, fontSize: 12 },
    colCheck: { width: 40, textAlign: 'center', color: Colors.textSecondary },

    input: {
        flex: 1,
        backgroundColor: Colors.background,
        color: Colors.text,
        textAlign: 'center',
        borderRadius: 4,
        paddingVertical: 4,
        marginHorizontal: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    checkButtonActive: {
        backgroundColor: Colors.success,
    },
    addSetButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        marginTop: 8,
    },
    addSetText: {
        color: Colors.primary,
        fontWeight: '600',
        marginLeft: 8,
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
        marginBottom: 20,
        marginTop: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    templateItem: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    templateIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 209, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    templateName: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    templateCount: {
        color: Colors.textSecondary,
        fontSize: 14,
    }
});
