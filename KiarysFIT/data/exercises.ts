export interface Exercise {
    id: string;
    name: string;
    muscle: string;
    secondaryMuscles?: string[];
    equipment: string;
    description?: string;
    benefits?: string[];
    level?: 'Principiante' | 'Intermedio' | 'Avanzado';
}

export const EXERCISES_DATA: Exercise[] = [
    // PECHO
    {
        id: 'chest_1',
        name: 'Press de Banca',
        muscle: 'Pecho',
        secondaryMuscles: ['Tríceps', 'Hombros'],
        equipment: 'Barra',
        description: 'Acuéstate en el banco, sujeta la barra un poco más ancho que los hombros. Baja la barra controladamente hasta el pecho y empuja hacia arriba explosivamente.',
        benefits: ['Desarrollo masivo de fuerza', 'Hipertrofia de pectorales', 'Mejora la estabilidad del empuje'],
        level: 'Intermedio'
    },
    {
        id: 'chest_2',
        name: 'Press Inclinado con Mancuernas',
        muscle: 'Pecho',
        secondaryMuscles: ['Hombros', 'Tríceps'],
        equipment: 'Mancuernas',
        description: 'En un banco inclinado (30-45°), empuja las mancuernas hacia arriba convergiendo en la cima sin tocarlas. Baja estirando bien el pecho.',
        benefits: ['Enfatiza la porción superior del pecho', 'Mayor rango de movimiento que la barra'],
        level: 'Principiante'
    },
    {
        id: 'chest_3',
        name: 'Aperturas (Flyes)',
        muscle: 'Pecho',
        equipment: 'Mancuernas',
        description: 'Acuéstate y abre los brazos con los codos ligeramente flexionados hasta sentir un gran estiramiento. Cierra los brazos como si abrazaras un árbol.',
        benefits: ['Aislamiento total del pecho', 'Gran estiramiento muscular'],
        level: 'Principiante'
    },
    {
        id: 'chest_4',
        name: 'Flexiones (Push-ups)',
        muscle: 'Pecho',
        secondaryMuscles: ['Tríceps', 'Core'],
        equipment: 'Corporal',
        description: 'Manos al ancho de hombros, cuerpo recto. Baja hasta que el pecho casi toque el suelo y sube.',
        benefits: ['Ejercicio funcional básico', 'No requiere equipo', 'Trabaja el core'],
        level: 'Principiante'
    },

    // ESPALDA
    {
        id: 'back_1',
        name: 'Dominadas',
        muscle: 'Espalda',
        secondaryMuscles: ['Bíceps', 'Antebrazos'],
        equipment: 'Corporal',
        description: 'Cuélgate de la barra con agarre prono. Tira de tu cuerpo hacia arriba hasta pasar la barbilla. Baja controlado.',
        benefits: ['Rey de los ejercicios de espalda', 'Ensancha la espalda (Dorsales)', 'Mejora la fuerza de agarre'],
        level: 'Intermedio'
    },
    {
        id: 'back_2',
        name: 'Remo con Barra',
        muscle: 'Espalda',
        secondaryMuscles: ['Bíceps', 'Espalda Baja'],
        equipment: 'Barra',
        description: 'Inclina el tronco hacia adelante manteniendo la espalda recta. Tira de la barra hacia tu cadera, apretando la espalda.',
        benefits: ['Densidad de espalda', 'Fuerza global posterior'],
        level: 'Intermedio'
    },
    {
        id: 'back_3',
        name: 'Jalón al Pecho',
        muscle: 'Espalda',
        secondaryMuscles: ['Bíceps'],
        equipment: 'Cable',
        description: 'Sentado, agarra la barra ancha. Tira hacia la parte superior del pecho inclinándote ligeramente hacia atrás.',
        benefits: ['Alternativa a dominadas', 'Control del movimiento'],
        level: 'Principiante'
    },
    {
        id: 'back_4',
        name: 'Peso Muerto',
        muscle: 'Espalda',
        secondaryMuscles: ['Piernas', 'Glúteos', 'Trapecios'],
        equipment: 'Barra',
        description: 'Levanta la barra del suelo manteniendo la espalda neutra, empujando con las piernas y extendiendo la cadera.',
        benefits: ['Fuerza total del cuerpo', 'Cadena posterior completa'],
        level: 'Avanzado'
    },

    // PIERNAS
    {
        id: 'legs_1',
        name: 'Sentadilla',
        muscle: 'Piernas',
        secondaryMuscles: ['Glúteos', 'Core'],
        equipment: 'Barra',
        description: 'Barra sobre trapecios. Baja flexionando rodillas y cadera como si te sentaras, manteniendo el pecho arriba. Rompe el paralelo si puedes.',
        benefits: ['Constructor masivo de piernas', 'Fuerza funcional'],
        level: 'Intermedio'
    },
    {
        id: 'legs_2',
        name: 'Prensa de Piernas',
        muscle: 'Piernas',
        equipment: 'Máquina',
        description: 'Coloca los pies en la plataforma. Empuja el peso sin bloquear rodillas y baja controladamente lo máximo posible.',
        benefits: ['Carga alta sin fatiga espinal', 'Seguridad'],
        level: 'Principiante'
    },
    {
        id: 'legs_3',
        name: 'Zancadas (Lunges)',
        muscle: 'Piernas',
        secondaryMuscles: ['Glúteos'],
        equipment: 'Mancuernas',
        description: 'Da un paso largo y baja la rodilla trasera casi al suelo. Mantén el torso recto. Alterna piernas.',
        benefits: ['Equilibrio y estabilidad', 'Trabajo unilateral'],
        level: 'Principiante'
    },
    {
        id: 'legs_4',
        name: 'Extensiones de Cuádriceps',
        muscle: 'Piernas',
        equipment: 'Máquina',
        description: 'Sentado, extiende las rodillas hasta bloquear. Mantén 1 segundo arriba y baja lento.',
        benefits: ['Aislamiento de cuádriceps', 'Bombeo muscular'],
        level: 'Principiante'
    },
    {
        id: 'legs_5',
        name: 'Curl Femoral',
        muscle: 'Piernas',
        equipment: 'Máquina',
        description: 'Tumbado o sentado, flexiona las rodillas llevando los talones al glúteo.',
        benefits: ['Aislamiento de isquiosurales', 'Salud de rodilla'],
        level: 'Principiante'
    },

    // HOMBROS
    {
        id: 'shoulders_1',
        name: 'Press Militar',
        muscle: 'Hombros',
        secondaryMuscles: ['Tríceps', 'Core'],
        equipment: 'Barra',
        description: 'De pie o sentado, empuja la barra desde las clavículas hasta encima de la cabeza. No arrones la espalda.',
        benefits: ['Hombros grandes y fuertes', 'Estabilidad del core'],
        level: 'Intermedio'
    },
    {
        id: 'shoulders_2',
        name: 'Elevaciones Laterales',
        muscle: 'Hombros',
        equipment: 'Mancuernas',
        description: 'Eleva los brazos hacia los lados hasta la altura de los hombros, codos ligeramente flexionados.',
        benefits: ['Anchura de hombros (deltoides lateral)', 'Estética en V'],
        level: 'Principiante'
    },
    {
        id: 'shoulders_3',
        name: 'Pájaros (Rear Delt Fly)',
        muscle: 'Hombros',
        equipment: 'Mancuernas',
        description: 'Inclínate hacia adelante. Abre los brazos hacia los lados enfocándote en la parte trasera del hombro.',
        benefits: ['Postura', 'Salud del hombro'],
        level: 'Principiante'
    },

    // BRAZOS
    {
        id: 'arms_1',
        name: 'Curl de Bíceps con Barra',
        muscle: 'Brazos',
        equipment: 'Barra',
        description: 'De pie, sube la barra flexionando los codos sin moverlos del costado. Aprieta arriba.',
        benefits: ['Masa general de bíceps', 'Fuerza de tracción'],
        level: 'Principiante'
    },
    {
        id: 'arms_2',
        name: 'Curl Martillo',
        muscle: 'Brazos',
        equipment: 'Mancuernas',
        description: 'Agarre neutro (palmas enfrentadas). Sube las mancuernas. Enfoca el braquial y antebrazo.',
        benefits: ['Anchura del brazo', 'Fuerza de antebrazo'],
        level: 'Principiante'
    },
    {
        id: 'arms_3',
        name: 'Extensiones de Tríceps en Polea',
        muscle: 'Brazos',
        equipment: 'Cable',
        description: 'Codos pegados al cuerpo. Empuja la barra o cuerda hacia abajo extendiendo el brazo completo.',
        benefits: ['Aislamiento de tríceps', 'Fácil de progresar'],
        level: 'Principiante'
    },
    {
        id: 'arms_4',
        name: 'Press Francés',
        muscle: 'Brazos',
        equipment: 'Barra Z',
        description: 'Tumbado, baja la barra hacia la frente flexionando codos y extiende de nuevo.',
        benefits: ['Masa de tríceps (cabeza larga)', 'Fuerza de empuje'],
        level: 'Intermedio'
    },

    // CORE
    {
        id: 'core_1',
        name: 'Plancha (Plank)',
        muscle: 'Core',
        equipment: 'Corporal',
        description: 'Apóyate en antebrazos y puntas de pies. Mantén el cuerpo como una tabla recta, apretando abdomen y glúteos.',
        benefits: ['Estabilidad global', 'Resistencia abdominal'],
        level: 'Principiante'
    },
    {
        id: 'core_2',
        name: 'Crunch Abdominal',
        muscle: 'Core',
        equipment: 'Corporal',
        description: 'Tumbado boca arriba, flexiona el tronco intentando llevar las costillas a la cadera. No tires del cuello.',
        benefits: ['Aislamiento del recto abdominal'],
        level: 'Principiante'
    },
    {
        id: 'core_3',
        name: 'Elevación de Piernas',
        muscle: 'Core',
        equipment: 'Corporal',
        description: 'Colgado de una barra o en suelo, eleva las piernas hasta formar 90 grados o tocar la barra.',
        benefits: ['Abdominales inferiores', 'Compresión del core'],
        level: 'Intermedio'
    },
];
