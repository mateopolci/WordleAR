import { View, TextInput, Alert, StyleSheet, useColorScheme } from 'react-native';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { joinRoom } from '@/services/roomService';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const colorScheme = useColorScheme();

    const inputBorderColor = colorScheme === 'light' ? Colors.light.text : Colors.dark.text;

    const handleJoinRoom = async () => {
        if (!user) return;
        
        setIsJoining(true);
        try {
            await joinRoom(roomId.toUpperCase(), user.id);
            router.push(`/game?mode=multiplayer&roomId=${roomId}`);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Unirse a una sala</ThemedText>
            <TextInput
                value={roomId}
                onChangeText={setRoomId}
                placeholder="Ingresa el código de sala"
                maxLength={6}
                autoCapitalize="characters"
                style={[styles.input, {borderColor: inputBorderColor, color: inputBorderColor}]}
                placeholderTextColor={Colors.light.gray}
            />
            <ThemedButton
                title={isJoining ? 'Uniéndose...' : 'Unirse'}
                onPress={handleJoinRoom}
                disabled={isJoining || roomId.length !== 6}
                style={styles.button}
            />
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
    input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: Colors.light.gray,
        borderRadius: 10,
        padding: 10,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        width: '80%',
    },
});