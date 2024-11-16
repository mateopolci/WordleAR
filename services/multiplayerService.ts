import {FIRESTORE_DB} from '@/utils/FirebaseConfig';
import {doc, updateDoc, onSnapshot, deleteDoc} from 'firebase/firestore';

export interface GameState {
    attempts: string[][];
    gameOver: boolean;
    winnerId?: string;
    loserId?: string;
}

export const markGameWon = async (roomId: string, winnerId: string, loserId: string) => {
    const roomRef = doc(FIRESTORE_DB, 'rooms', roomId);

    await updateDoc(roomRef, {
        status: 'finished',
        winnerId,
        loserId,
        finishedAt: Date.now(),
    });

    setTimeout(async () => {
        try {
            await cleanupRoom(roomId);
        } catch (error) {
            console.error('Error cleaning up room:', error);
        }
    }, 10000);
};

export const subscribeToRoom = (roomId: string, callback: (room: any) => void) => {
    const roomRef = doc(FIRESTORE_DB, 'rooms', roomId);
    return onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data());
        }
    });
};

export const cleanupRoom = async (roomId: string) => {
    const roomRef = doc(FIRESTORE_DB, 'rooms', roomId);
    await deleteDoc(roomRef);
};
