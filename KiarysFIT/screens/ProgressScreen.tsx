import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Image, Alert, Dimensions } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';
import { Plus, Camera, Trash2, X } from 'lucide-react-native';
import { useProgress, MeasurementLog } from '../context/ProgressContext';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';

export default function ProgressScreen() {
    const { logs, addLog, deleteLog } = useProgress();
    const [modalVisible, setModalVisible] = useState(false);
    const [weight, setWeight] = useState('');
    const [waist, setWaist] = useState('');
    const [chest, setChest] = useState('');
    const [hip, setHip] = useState('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const screenWidth = Dimensions.get('window').width;

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería para guardar tus fotos de progreso.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!weight) {
            Alert.alert("Falta peso", "Por favor ingresa tu peso actual.");
            return;
        }

        await addLog({
            date: new Date().toISOString(),
            weight: parseFloat(weight),
            waist: waist ? parseFloat(waist) : undefined,
            chest: chest ? parseFloat(chest) : undefined,
            hip: hip ? parseFloat(hip) : undefined,
            photoUri: photoUri || undefined
        });

        resetForm();
        setModalVisible(false);
    };

    const resetForm = () => {
        setWeight('');
        setWaist('');
        setChest('');
        setHip('');
        setPhotoUri(null);
    };

    // Prepare Chart Data
    const chartData = {
        labels: logs.slice(0, 6).reverse().map(l => new Date(l.date).getDate().toString() + '/' + (new Date(l.date).getMonth() + 1)),
        datasets: [
            {
                data: logs.slice(0, 6).reverse().map(l => l.weight || 0),
                color: (opacity = 1) => `rgba(0, 209, 255, ${opacity})`,
                strokeWidth: 2
            }
        ],
        legend: ["Peso (kg)"]
    };

    return (
        <ScreenContainer>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Progreso</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Plus color={Colors.background} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Chart */}
                {logs.length > 0 ? (
                    <View style={styles.chartContainer}>
                        <Text style={styles.sectionTitle}>Evolución de Peso</Text>
                        <LineChart
                            data={chartData}
                            width={screenWidth - 32}
                            height={220}
                            chartConfig={{
                                backgroundColor: Colors.card,
                                backgroundGradientFrom: Colors.card,
                                backgroundGradientTo: Colors.card,
                                decimalPlaces: 1,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: { borderRadius: 16 },
                                propsForDots: { r: "4", strokeWidth: "2", stroke: Colors.primary }
                            }}
                            bezier
                            style={{ marginVertical: 8, borderRadius: 16 }}
                        />
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Añade tu primer registro para ver gráficas.</Text>
                    </View>
                )}

                {/* History List */}
                <Text style={styles.sectionTitle}>Historial</Text>
                {logs.map((log) => (
                    <View key={log.id} style={styles.logCard}>
                        <View style={styles.logMeta}>
                            <Text style={styles.logDate}>{new Date(log.date).toLocaleDateString()}</Text>
                            <Text style={styles.logWeight}>{log.weight} kg</Text>
                            {log.waist && <Text style={styles.logDetails}>Cintura: {log.waist} cm</Text>}
                        </View>
                        {log.photoUri && (
                            <Image source={{ uri: log.photoUri }} style={styles.logThumbnail} />
                        )}
                        <TouchableOpacity onPress={() => deleteLog(log.id)} style={styles.deleteButton}>
                            <Trash2 color={Colors.danger} size={20} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Add Modal */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Nuevo Registro</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <X color={Colors.text} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.formContainer}>
                        <Text style={styles.label}>Peso (kg) *</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Ej: 75.5"
                            placeholderTextColor={Colors.textSecondary}
                            value={weight}
                            onChangeText={setWeight}
                        />

                        <Text style={styles.label}>Medidas (cm) - Opcional</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Cintura"
                                    placeholderTextColor={Colors.textSecondary}
                                    value={waist}
                                    onChangeText={setWaist}
                                />
                            </View>
                            <View style={styles.col}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Pecho"
                                    placeholderTextColor={Colors.textSecondary}
                                    value={chest}
                                    onChangeText={setChest}
                                />
                            </View>
                            <View style={styles.col}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Cadera"
                                    placeholderTextColor={Colors.textSecondary}
                                    value={hip}
                                    onChangeText={setHip}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                            ) : (
                                <>
                                    <Camera color={Colors.primary} size={32} />
                                    <Text style={styles.photoText}>Añadir Foto</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Guardar Progreso</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </Modal>

        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 12,
        marginTop: 20,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
    },
    logCard: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logMeta: {
        flex: 1,
    },
    logDate: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 4,
    },
    logWeight: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    logDetails: {
        color: Colors.textSecondary,
        fontSize: 12,
    },
    logThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginHorizontal: 12,
    },
    deleteButton: {
        padding: 8,
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
    formContainer: {
        paddingBottom: 40,
    },
    label: {
        color: Colors.text,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: Colors.card,
        color: Colors.text,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    col: {
        flex: 1,
    },
    photoButton: {
        height: 200,
        backgroundColor: Colors.card,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.textSecondary,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    photoPreview: {
        width: '100%',
        height: '100%',
    },
    photoText: {
        color: Colors.primary,
        marginTop: 8,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: Colors.background,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
