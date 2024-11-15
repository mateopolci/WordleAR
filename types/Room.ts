export interface Room {
    id: string;
    hostId: string;
    guestId?: string;
    status: 'waiting' | 'playing' | 'finished';
    createdAt: number;
    word: string;
    gameState?: {
      [userId: string]: {
        attempts: string[][];
        lastUpdate: number;
      }
    };
    winnerId?: string;
    loserId?: string;
    finishedAt?: number;
  }