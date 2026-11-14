import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export interface MeasurementLog {
    id: string;
    date: string; // ISO string
    weight?: number;
    waist?: number;
    chest?: number;
    hip?: number;
    photoUri?: string;
}

interface ProgressContextType {
    logs: MeasurementLog[];
    addLog: (log: Omit<MeasurementLog, 'id'>) => Promise<void>;
    deleteLog: (id: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType>({
    logs: [],
    addLog: async () => { },
    deleteLog: async () => { },
});

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
    const [logs, setLogs] = useState<MeasurementLog[]>([]);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const storedLogs = await AsyncStorage.getItem('progress_logs');
            if (storedLogs) {
                setLogs(JSON.parse(storedLogs));
            }
        } catch (error) {
            console.error('Failed to load progress logs:', error);
        }
    };

    const saveLogs = async (newLogs: MeasurementLog[]) => {
        try {
            await AsyncStorage.setItem('progress_logs', JSON.stringify(newLogs));
            setLogs(newLogs);
        } catch (error) {
            console.error('Failed to save progress logs:', error);
        }
    };

    const addLog = async (logData: Omit<MeasurementLog, 'id'>) => {
        const newLog: MeasurementLog = {
            ...logData,
            id: Date.now().toString(),
        };

        // If there is a photo, save it to permanent storage
        if (newLog.photoUri) {
            const fileName = newLog.photoUri.split('/').pop();
            const newPath = FileSystem.documentDirectory + fileName!;
            try {
                await FileSystem.copyAsync({
                    from: newLog.photoUri,
                    to: newPath
                });
                newLog.photoUri = newPath;
            } catch (e) {
                console.error("Error saving photo:", e);
            }
        }

        const updatedLogs = [newLog, ...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        await saveLogs(updatedLogs);
    };

    const deleteLog = async (id: string) => {
        const logToDelete = logs.find(l => l.id === id);
        if (logToDelete?.photoUri) {
            try {
                await FileSystem.deleteAsync(logToDelete.photoUri, { idempotent: true });
            } catch (e) {
                console.error("Error deleting photo:", e);
            }
        }
        const updatedLogs = logs.filter(l => l.id !== id);
        await saveLogs(updatedLogs);
    };

    return (
        <ProgressContext.Provider value={{ logs, addLog, deleteLog }}>
            {children}
        </ProgressContext.Provider>
    );
};
