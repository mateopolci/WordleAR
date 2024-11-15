import { FIRESTORE_DB } from '@/utils/FirebaseConfig';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { Room } from '@/types/Room';
import { generateRoomId } from '@/utils/roomUtils';
import { words } from '@/utils/targetWord2';

export const createRoom = async (userId: string): Promise<string> => {
    const roomId = generateRoomId();
    const roomRef = doc(FIRESTORE_DB, 'rooms', roomId);
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    const room: Room = {
        id: roomId,
        hostId: userId,
        status: 'waiting',
        createdAt: Date.now(),
        word: randomWord,
        gameState: {}
    };
    
    await setDoc(roomRef, room);
    return roomId;
};
export const joinRoom = async (roomId: string, userId: string): Promise<Room> => {
    const roomRef = doc(FIRESTORE_DB, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        throw new Error('Sala no encontrada');
    }

    const room = roomSnap.data() as Room;
    
    if (room.status !== 'waiting') {
        throw new Error('La sala no está disponible');
    }

    if (room.hostId === userId) {
        throw new Error('No puedes unirte a tu propia sala');
    }

    const updatedRoom: Room = {
        ...room,
        guestId: userId,
        status: 'playing'
    };

    await setDoc(roomRef, updatedRoom);
    return updatedRoom;
}