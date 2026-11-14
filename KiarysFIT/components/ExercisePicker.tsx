import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Colors from '../constants/Colors';
import Button from './Button';
import { Search, X, Dumbbell } from 'lucide-react-native';
import { EXERCISES_DATA, Exercise } from '../data/exercises';

interface ExercisePickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectExercise: (exercise: Exercise) => void;
}

export default function ExercisePicker({ visible, onClose, onSelectExercise }: ExercisePickerProps) {
    const [search, setSearch] = useState('');

    const filteredExercises = EXERCISES_DATA.filter(ex =>
        ex.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Seleccionar Ejercicio</Text>
                    <TouchableOpacity onPress={onClose}>
                        <X color={Colors.text} size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Search color={Colors.textSecondary} size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar..."
                        placeholderTextColor={Colors.textSecondary}
                        value={search}
                        onChangeText={setSearch}
                        autoFocus
                    />
                </View>

                <FlatList
                    data={filteredExercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => {
                                onSelectExercise(item);
                                setSearch('');
                                onClose();
                            }}
                        >
                            <View style={styles.icon}>
                                <Dumbbell color={Colors.text} size={20} />
                            </View>
                            <View>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemMeta}>{item.muscle}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
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
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.card,
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemName: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    itemMeta: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
