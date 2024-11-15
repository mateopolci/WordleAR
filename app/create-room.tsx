import { View, Alert, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { createRoom } from '@/services/roomService';
import ThemedText from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { subscribeToRoom } from '@/services/multiplayerService';

export default function CreateRoom() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const { user } = useUser();
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
            const newRoomId = await createRoom(user.id);
            setRoomId(newRoomId);
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la sala');
            router.back();
        } finally {
            setIsCreating(false);
        }
    };

    // Copy the room ID to the clipboard
    /* const copyToClipboard = () => {
        if (roomId) {
            Clipboard.setString(roomId);
            Alert.alert('Copiado', 'Código de sala copiado al portapapeles');
        }
    }; */

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Sala creada</ThemedText>
            <ThemedText style={styles.text}>
                Comparte este código con tu amigo:
            </ThemedText>
            <ThemedText style={styles.roomId}>{roomId}</ThemedText>

            {/* Button to copy the room ID to the clipboard */}
            {/*<ThemedButton
                title="Copiar código"
                onPress={copyToClipboard}
                style={styles.button}
            /> */}

            <ThemedText style={styles.waiting}>
                Esperando a que otro jugador se una...
            </ThemedText>
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