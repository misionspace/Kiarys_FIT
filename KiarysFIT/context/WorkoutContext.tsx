import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Reuse types or define new ones for history
export interface WorkoutSet {
    id: string;
    weight: string;
    reps: string;
    completed: boolean;
}

export interface WorkoutExercise {
    id: string;
    name: string;
    muscle: string;
    equipment: string;
    sets: WorkoutSet[];
}

export interface FinishedWorkout {
    id: string;
    name: string;
    date: string; // ISO string
    duration: number; // seconds
    exercises: WorkoutExercise[];
    volume: number; // total tonnage
}

interface WorkoutContextType {
    history: FinishedWorkout[];
    saveWorkout: (workout: Omit<FinishedWorkout, 'id'>) => Promise<void>;
    clearHistory: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType>({
    history: [],
    saveWorkout: async () => { },
    clearHistory: async () => { },
});

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [history, setHistory] = useState<FinishedWorkout[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@kiarysfit_history');
            if (jsonValue != null) {
                setHistory(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    };

    const saveWorkout = async (workoutData: Omit<FinishedWorkout, 'id'>) => {
        try {
            const newWorkout: FinishedWorkout = {
                id: Date.now().toString(),
                ...workoutData,
            };

            const updatedHistory = [newWorkout, ...history];
            setHistory(updatedHistory);
            await AsyncStorage.setItem('@kiarysfit_history', JSON.stringify(updatedHistory));
        } catch (e) {
            console.error("Failed to save workout", e);
            Alert.alert("Error", "No se pudo guardar el entrenamiento.");
        }
    };

    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem('@kiarysfit_history');
            setHistory([]);
        } catch (e) {
            console.error("Failed to clear history", e);
        }
    };

    return (
        <WorkoutContext.Provider value={{ history, saveWorkout, clearHistory }}>
            {children}
        </WorkoutContext.Provider>
    );
};
