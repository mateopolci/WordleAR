import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/utils/FirebaseConfig';
import { Room } from '@/types/Room';
import ThemedButton from '@/components/ThemedButton';

export default function MultiplayerEnd() {
    const { roomId, userId } = useLocalSearchParams<{roomId: string, userId: string}>();
    const [stats, setStats] = useState({wins: 0, losses: 0});
    const [isWinner, setIsWinner] = useState<boolean | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const roomRef = doc(FIRESTORE_DB, `rooms/${roomId}`);
            const roomSnap = await getDoc(roomRef);
            
            if (roomSnap.exists() && isMounted) {
                const roomData = roomSnap.data() as Room;
                setIsWinner(roomData.winnerId === userId);
                
                const statsRef = doc(FIRESTORE_DB, `multiplayerStats/${userId}`);
                const statsSnap = await getDoc(statsRef);
                if (statsSnap.exists() && isMounted) {
                    setStats(statsSnap.data() as {wins: number, losses: number});
                }
            }
        };
        
        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isWinner === null) {
        return <View style={styles.container}>
            <ThemedText>Cargando resultado...</ThemedText>
        </View>;
    }

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>
                {isWinner ? '¡Ganaste la partida!' : 'Hoy no fue, la próxima es tuya.'}
            </ThemedText>
            <View style={styles.stats}>
                <ThemedText>Partidas ganadas: {stats.wins}</ThemedText>
                <ThemedText>Partidas perdidas: {stats.losses}</ThemedText>
            </View>
            <View>
                <ThemedButton title="Volver al menú" onPress={() => router.push('/')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  stats: {
    marginVertical: 20,
  }
});