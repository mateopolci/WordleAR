import {View, Alert, Share, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {useUser} from '@clerk/clerk-expo';
import {createRoom} from '@/services/roomService';
import ThemedText from '@/components/ThemedText';
import {useRouter} from 'expo-router';
import {subscribeToRoom} from '@/services/multiplayerService';
import ThemedButton from '@/components/ThemedButton';

export default function CreateRoom() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const {user} = useUser();
    const router = useRouter();

    useEffect(() => {
        handleCreateRoom();
    }, []);

    useEffect(() => {
        if (roomId && user) {
            const unsubscribe = subscribeToRoom(roomId, (room) => {
                if (room.status === 'playing' && room.guestId) {
                    router.push(`/game?mode=multiplayer&roomId=${roomId}`);
                }
            });

            return () => unsubscribe();
        }
    }, [roomId, user]);

    const handleCreateRoom = async () => {
        if (!user) return;
    
        setIsCreating(true);
        try {
            const newRoomId = await createRoom(user.id, user.fullName || '');
            setRoomId(newRoomId);
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la sala');
            router.back();
        } finally {
            setIsCreating(false);
        }
    };
    const handleShare = async () => {
        if (!roomId) return;

        try {
            await Share.share({
                message: `Unite a mi sala de WordleAR con el código: ${roomId}`,
                title: 'Invitación a sala de WordleAR',
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo compartir el código de sala');
        }
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Sala creada</ThemedText>
            <ThemedText style={styles.text}>Comparte este código con tu amigo:</ThemedText>
            <ThemedText style={styles.roomId}>{roomId}</ThemedText>

            <ThemedButton title="Compartir código de sala" onPress={handleShare} style={styles.button} />

            <ThemedText style={styles.waiting}>Esperando a que otro jugador se una...</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    roomId: {
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    button: {
        marginVertical: 20,
    },
    waiting: {
        marginTop: 20,
        fontStyle: 'italic',
    },
});
