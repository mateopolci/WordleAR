import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import ThemedText from '@/components/ThemedText';
import {useEffect, useState} from 'react';
import {doc, getDoc, onSnapshot} from 'firebase/firestore';
import {FIRESTORE_DB} from '@/utils/FirebaseConfig';
import {Room} from '@/types/Room';
import ThemedButton from '@/components/ThemedButton';
import {Ionicons} from '@expo/vector-icons';
import Icon from '@/assets/images/wordlear-icon.svg';

export default function MultiplayerEnd() {
    const {roomId, userId} = useLocalSearchParams<{roomId: string; userId: string}>();
    const [stats, setStats] = useState({wins: 0, losses: 0});
    const [isWinner, setIsWinner] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const roomRef = doc(FIRESTORE_DB, `rooms/${roomId}`);
            const roomSnap = await getDoc(roomRef);

            if (roomSnap.exists() && isMounted) {
                const roomData = roomSnap.data() as Room;
                setIsWinner(roomData.winnerId === userId);

                // Crear listener para las estadísticas
                const statsRef = doc(FIRESTORE_DB, `multiplayerStats/${userId}`);
                const unsubscribe = onSnapshot(statsRef, (doc) => {
                    if (doc.exists() && isMounted) {
                        setStats(doc.data() as {wins: number; losses: number});
                    }
                });

                return () => {
                    unsubscribe();
                    isMounted = false;
                };
            }
        };

        fetchData();
    }, [roomId, userId]);

    if (isWinner === null) {
        return (
            <View style={styles.container}>
                <ThemedText>Cargando resultado...</ThemedText>
            </View>
        );
    }

    const navigateRoot = () => {
        router.dismissAll();
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {isWinner ? <Ionicons name="star" size={60} color="#FFE44D" /> : <Icon width={100} height={70} />}

                <ThemedText style={styles.title}>{isWinner ? '¡Ganaste la partida!' : 'Hoy no fue, la próxima es tuya.'}</ThemedText>

                <ThemedText style={styles.text}>Estadísticas multijugador</ThemedText>
                <View style={styles.stats}>
                    <View>
                        <ThemedText style={styles.score}>{stats.wins}</ThemedText>
                        <ThemedText>Ganadas</ThemedText>
                    </View>
                    <View>
                        <ThemedText style={styles.score}>{stats.losses}</ThemedText>
                        <ThemedText>Perdidas</ThemedText>
                    </View>
                </View>

                <View
                    style={{
                        height: StyleSheet.hairlineWidth,
                        width: '100%',
                        backgroundColor: '#4e4e4e',
                    }}
                />

                <ThemedButton title="Volver al menú" onPress={() => router.push('/')} style={styles.btn} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
        paddingVertical: 80,
    },
    header: {
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontFamily: 'FrankRuhlLibre_800ExtraBold',
        fontSize: 30,
        textAlign: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium',
    },
    btn: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        width: 150,
        marginTop: 10,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 30,
        paddingVertical: 10,
    },
    score: {
        fontSize: 26,
        fontFamily: 'bold',
        textAlign: 'center',
    },
});
