export interface WorkoutTemplate {
    id: string;
    name: string;
    exercises: {
        exerciseId: string;
        sets: number;
    }[];
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
    {
        id: 'torso',
        name: 'Torso (Upper Body)',
        exercises: [
            { exerciseId: 'chest_1', sets: 4 }, // Press Banca
            { exerciseId: 'back_2', sets: 4 },  // Remo Barra
            { exerciseId: 'shoulders_1', sets: 3 }, // Press Militar
            { exerciseId: 'back_1', sets: 3 },  // Dominadas
        ]
    },
    {
        id: 'pierna',
        name: 'Pierna (Lower Body)',
        exercises: [
            { exerciseId: 'legs_1', sets: 4 }, // Sentadilla
            { exerciseId: 'legs_3', sets: 3 }, // Zancadas
            { exerciseId: 'legs_5', sets: 3 }, // Curl Femoral
            { exerciseId: 'legs_4', sets: 3 }, // Ext Cuadriceps
        ]
    },
    {
        id: 'push',
        name: 'Empuje (Push)',
        exercises: [
            { exerciseId: 'chest_1', sets: 4 },
            { exerciseId: 'chest_2', sets: 3 }, // Inclinado
            { exerciseId: 'shoulders_2', sets: 3 }, // Laterales
            { exerciseId: 'arms_3', sets: 3 },  // Tricep Polea
        ]
    },
    {
        id: 'pull',
        name: 'Tracción (Pull)',
        exercises: [
            { exerciseId: 'back_4', sets: 3 }, // Peso Muerto
            { exerciseId: 'back_1', sets: 3 }, // Dominadas
            { exerciseId: 'back_2', sets: 3 }, // Remo
            { exerciseId: 'arms_1', sets: 3 }, // Curl Biceps
        ]
    },
    {
        id: 'fullbody',
        name: 'Full Body',
        exercises: [
            { exerciseId: 'legs_1', sets: 3 },
            { exerciseId: 'chest_1', sets: 3 },
            { exerciseId: 'back_2', sets: 3 },
            { exerciseId: 'shoulders_1', sets: 3 },
        ]
    }
];
