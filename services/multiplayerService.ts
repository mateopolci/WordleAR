import {FIRESTORE_DB} from '@/utils/FirebaseConfig';
import {doc, updateDoc, onSnapshot} from 'firebase/firestore';

export interface GameState {
    attempts: string[][];
    gameOver: boolean;
    winnerId?: string;
    loserId?: string;
}

export const updateGameState = async (roomId: string, userId: string, attempts: string[][]) => {
    const roomRef = doc(FIRESTORE_DB, 'rooms', roomId);
    
    const gameState = {
        attempts: attempts,
        lastUpdate: Date.now()
    };
  
    await updateDoc(roomRef, {
        [`gameState.${userId}`]: gameState
    });
};

export const markGameWon = async (roomId: string, winnerId: string, loserId: string) => {
    const roomRef = doc(FIRESTORE_DB, 'rooms', roomId);
    await updateDoc(roomRef, {
        status: 'finished',
        winnerId,
        loserId,
        finishedAt: Date.now(),
    });
};

export const subscribeToRoom = (roomId: string, callback: (room: any) => void) => {
    const roomRef = doc(FIRESTORE_DB, 'rooms', roomId);
    return onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data());
        }
    });
};
