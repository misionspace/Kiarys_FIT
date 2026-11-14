import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

interface TimerContextType {
    timeLeft: number;
    initialTime: number;
    isActive: boolean;
    toggleTimer: () => void;
    resetTimer: () => void;
    addTime: (seconds: number) => void;
    setPreset: (seconds: number) => void;
}

const TimerContext = createContext<TimerContextType>({
    timeLeft: 90,
    initialTime: 90,
    isActive: false,
    toggleTimer: () => { },
    resetTimer: () => { },
    addTime: () => { },
    setPreset: () => { },
});

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const [timeLeft, setTimeLeft] = useState(90);
    const [initialTime, setInitialTime] = useState(90);
    const [isActive, setIsActive] = useState(false);

    const appState = useRef(AppState.currentState);
    const backgroundTime = useRef<number | null>(null);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active' &&
                isActive &&
                backgroundTime.current
            ) {
                const now = Date.now();
                const elapsed = Math.floor((now - backgroundTime.current) / 1000);
                setTimeLeft(prev => Math.max(0, prev - elapsed));
            } else if (nextAppState.match(/inactive|background/) && isActive) {
                backgroundTime.current = Date.now();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [isActive]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const addTime = (seconds: number) => {
        setTimeLeft(prev => prev + seconds);
    };

    const setPreset = (seconds: number) => {
        setInitialTime(seconds);
        setTimeLeft(seconds);
        setIsActive(true);
    };

    return (
        <TimerContext.Provider value={{ timeLeft, initialTime, isActive, toggleTimer, resetTimer, addTime, setPreset }}>
            {children}
        </TimerContext.Provider>
    );
};
