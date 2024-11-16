import {StyleSheet, Text, View, useColorScheme, Platform, TouchableOpacity, Alert} from 'react-native';
import {useRef, useState, useEffect} from 'react';
import Colors from '@/constants/Colors';
import {Link, Stack, usePathname, useRouter} from 'expo-router';
import OnScreenKeyboard from '@/components/OnScreenKeyboard';
import {Ionicons} from '@expo/vector-icons';
import {allWords} from '@/utils/allWords';
import {words} from '@/utils/targetWord2';
import Hints from '@/components/Hints';
import Coin from '@/assets/images/coin.svg';
import ThemedText from '@/components/ThemedText';
import {SignedIn, SignedOut} from '@clerk/clerk-expo';
import {useUser} from '@clerk/clerk-expo';
import {doc, getDoc, onSnapshot, setDoc, deleteDoc} from 'firebase/firestore';
import {FIRESTORE_DB} from '@/utils/FirebaseConfig';
import Animated, {FadeIn, Layout, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming} from 'react-native-reanimated';
import {useLocalSearchParams} from 'expo-router';
import {markGameWon, subscribeToRoom} from '@/services/multiplayerService';
import {Room} from '@/types/Room';
import GameTimer from '@/components/GameTimer';

const ROWS = 6;

const game = () => {
    const {mode, roomId} = useLocalSearchParams<{mode?: string; roomId?: string}>();
    const isMultiplayer = mode === 'multiplayer';
    const [room, setRoom] = useState<Room | null>(null);
    const [showAnimations, setShowAnimations] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimations(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const {user} = useUser();
    const [userScore, setUserScore] = useState<any>();
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (user) {
            fetchUserScore();

            const docRef = doc(FIRESTORE_DB, `highscores/${user.id}`);
        }

        return () => {};
    }, [user]);

    useEffect(() => {
        if (isMultiplayer && roomId) {
            const unsubscribe = subscribeToRoom(roomId, (room) => {
                if (room.status === 'finished' && room.loserId === user?.id) {
                    if (user) {
                        router.push(`/multiplayer-end?roomId=${roomId}&userId=${user.id}`);
                    }
                }
            });
            return () => unsubscribe();
        }
    }, [isMultiplayer, roomId]);

    useEffect(() => {
        if (user) {
            fetchUserScore();

            const docRef = doc(FIRESTORE_DB, `highscores/${user.id}`);
            unsubscribeRef.current = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setUserScore(doc.data());
                }
            });
        }

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [user]);

    const fetchUserScore = async () => {
        if (!user) return;
        const docRef = doc(FIRESTORE_DB, `highscores/${user.id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUserScore(docSnap.data());
        }
    };

    const colorScheme = useColorScheme();
    const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
    const textColor = Colors[colorScheme ?? 'light'].text;
    const grayColor = Colors[colorScheme ?? 'light'].gray;
    const router = useRouter();

    const [rows, setRows] = useState<string[][]>(
        Array(ROWS)
            .fill(null)
            .map(() => Array(5).fill(''))
    );

    const [curRow, _setCurRow] = useState(0);
    const setCurRow = (row: number) => {
        curRowRef.current = row;
        _setCurRow(row);
    };
    
    useEffect(() => {
        console.log('curRow cambió a:', curRow);
    }, [curRow]);

    const [curCol, _setCurCol] = useState(0);

    const [blueLetters, setBlueLetters] = useState<string[]>([]);
    const [yellowLetters, setYellowLetters] = useState<string[]>([]);
    const [grayLetters, setGrayLetters] = useState<string[]>([]);

    const curRowRef = useRef(0);

    const [word, setWord] = useState<string>('');
    useEffect(() => {
        if (isMultiplayer) {
            if (room?.word) {
                setWord(room.word);
            }
        } else {
            setWord(words[Math.floor(Math.random() * words.length)]);
        }
    }, [isMultiplayer, room]);

    const wordLetters = word.split('');

    const colStateRef = useRef(curCol);
    const setCurCol = (col: number) => {
        colStateRef.current = col;
        _setCurCol(col);
    };

    useEffect(() => {
        if (isMultiplayer && roomId && user) {
            const unsubscribe = subscribeToRoom(roomId, (roomData) => {
                setRoom(roomData);

                if (roomData.status === 'finished') {
                    const updateStats = async () => {
                        const statsRef = doc(FIRESTORE_DB, `multiplayerStats/${user.id}`);
                        const statsSnap = await getDoc(statsRef);
                        const currentStats = statsSnap.exists() ? statsSnap.data() : {wins: 0, losses: 0};

                        if (roomData.loserId === user.id) {
                            await setDoc(statsRef, {
                                wins: currentStats.wins,
                                losses: currentStats.losses + 1,
                            });
                        } else {
                            await setDoc(statsRef, {
                                wins: currentStats.wins + 1,
                                losses: currentStats.losses,
                            });
                        }
                    };

                    updateStats();
                    router.push(`/multiplayer-end?roomId=${roomId}&userId=${user.id}`);
                }
            });

            return () => unsubscribe();
        }
    }, [isMultiplayer, roomId, user]);

    const checkWord = async () => {
        const currentWord = rows[curRow].join('');
        if (currentWord.length < word.length) {
            shakeRow();
            return;
        }
        if (!allWords.includes(currentWord) && !allWords.includes(currentWord.toLowerCase())) {
            shakeRow();
            return;
        }

        flipRow();

        const newBlue: string[] = [];
        const newYellow: string[] = [];
        const newGray: string[] = [];

        currentWord.split('').forEach((letter, index) => {
            if (letter === wordLetters[index]) {
                newBlue.push(letter);
            } else if (wordLetters.includes(letter)) {
                newYellow.push(letter);
            } else {
                newGray.push(letter);
            }
        });
        setBlueLetters([...blueLetters, ...newBlue]);
        setYellowLetters([...yellowLetters, ...newYellow]);
        setGrayLetters([...grayLetters, ...newGray]);

        setTimeout(async () => {
            if (currentWord === word) {
                if (isMultiplayer && roomId && user && room) {
                    const opponentId = room.guestId === user.id ? room.hostId : room.guestId;

                    if (opponentId) {
                        try {
                            await markGameWon(roomId, user.id, opponentId);

                            const statsRef = doc(FIRESTORE_DB, `multiplayerStats/${user.id}`);
                            const statsSnap = await getDoc(statsRef);
                            const currentStats = statsSnap.exists() ? statsSnap.data() : {wins: 0, losses: 0};

                            await setDoc(statsRef, {
                                wins: currentStats.wins + 1,
                                losses: currentStats.losses,
                            });

                            router.push(`/multiplayer-end?roomId=${roomId}&userId=${user.id}`);
                        } catch (error) {
                            console.error('Error al finalizar la partida:', error);
                        }
                    }
                } else {
                    router.push(`/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`);
                }
            } else if (curRow + 1 >= rows.length) {
                if (isMultiplayer && roomId && user && room) {
                    const opponentId = room.guestId === user.id ? room.hostId : room.guestId;
                    if (opponentId) {
                        const statsRef = doc(FIRESTORE_DB, `multiplayerStats/${user.id}`);
                        const statsSnap = await getDoc(statsRef);
                        const currentStats = statsSnap.exists() ? statsSnap.data() : {wins: 0, losses: 0};

                        await setDoc(statsRef, {
                            wins: currentStats.wins,
                            losses: currentStats.losses + 1,
                        });
                    }
                }
                router.push(`/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`);
            }
        }, 1000);

        setCurRow(curRow + 1);
        setCurCol(0);
    };

    const addKey = (key: string) => {
        const currentRow = curRowRef.current;
        const newRows = [...rows];
    
        if (key === 'ENTER') {
            checkWord();
        } else if (key === 'BACKSPACE') {
            if (colStateRef.current === 0) {
                newRows[currentRow][0] = '';
                setRows(newRows);
                return;
            }
            newRows[currentRow][colStateRef.current - 1] = '';
            setCurCol(colStateRef.current - 1);
            setRows(newRows);
            return;
        } else if (colStateRef.current >= newRows[currentRow].length) {
            return;
        } else {
            if (currentRow >= ROWS || newRows[currentRow].join('').length === 5) {
                return;
            }
            
            newRows[currentRow] = [...newRows[currentRow]];
            newRows[currentRow][colStateRef.current] = key;
            setRows(newRows);
            setCurCol(colStateRef.current + 1);
        }
    };

    const addWord = (word: string) => {
        const currentRow = curRowRef.current;

        setRows(prevRows => {
            const newRows = prevRows.map(row => [...row]);
            
            if (currentRow >= ROWS || newRows[currentRow].join('').length === 5) {
                return prevRows;
            }
            
            const letters = word.toUpperCase().split('');
            letters.forEach((letter, index) => {
                if (index < 5) {
                    newRows[currentRow][index] = letter;
                }
            });
            
            return newRows;
        });
        
        setCurCol(Math.min(word.length, 5));
    };

    const handleHint = (hint: 'gray3' | 'gray5' | 'yellow1' | 'yellowAll', letters: string[]) => {
        switch (hint) {
            case 'gray3':
            case 'gray5':
                setGrayLetters([...grayLetters, ...letters]);
                break;
            case 'yellow1':
            case 'yellowAll':
                setYellowLetters([...yellowLetters, ...letters]);
                break;
        }
    };

    const offsetShakes = Array.from({length: ROWS}, () => useSharedValue(0));

    const rowStyles = Array.from({length: ROWS}, (_, index) =>
        useAnimatedStyle(() => {
            return {
                transform: [{translateX: offsetShakes[index].value}],
            };
        })
    );

    const shakeRow = () => {
        const TIME = 70;
        const OFFSET = 10;

        offsetShakes[curRow].value = withSequence(withTiming(-OFFSET, {duration: TIME / 2}), withRepeat(withTiming(OFFSET, {duration: TIME}), 4, true), withTiming(0, {duration: TIME / 2}));
    };

    const tileRotates = Array.from({length: ROWS}, () => Array.from({length: 5}, () => useSharedValue(0)));

    const cellBackgrounds = Array.from({length: ROWS}, () => Array.from({length: 5}, () => useSharedValue('transparent')));

    const cellBorders = Array.from({length: ROWS}, () => Array.from({length: 5}, () => useSharedValue(Colors.light.gray)));

    const tileStyles = Array.from({length: ROWS}, (_, index) => {
        return Array.from({length: 5}, (_, tileIndex) =>
            useAnimatedStyle(() => {
                return {
                    transform: [{rotateX: `${tileRotates[index][tileIndex].value}deg`}],
                    borderColor: cellBorders[index][tileIndex].value,
                    backgroundColor: cellBackgrounds[index][tileIndex].value,
                };
            })
        );
    });

    const flipRow = () => {
        const TIME = 300;
        const OFFSET = 90;

        tileRotates[curRow].forEach((value, index) => {
            value.value = withDelay(
                index * 100,
                withSequence(
                    withTiming(OFFSET, {duration: TIME}, () => {}),
                    withTiming(0, {duration: TIME})
                )
            );
        });
    };

    const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
        if (curRow > rowIndex) {
            if (wordLetters[cellIndex] === cell) {
                cellBackgrounds[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming('#6ABDED'));
            } else if (wordLetters.includes(cell)) {
                cellBackgrounds[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming('#FFE44D'));
            } else {
                cellBackgrounds[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming(grayColor));
            }
        } else {
            cellBackgrounds[rowIndex][cellIndex].value = withTiming('transparent', {duration: 100});
        }
    };

    const setBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
        if (curRow > rowIndex && cell !== '') {
            if (wordLetters[cellIndex] === cell) {
                cellBorders[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming('#6ABDED'));
            } else if (wordLetters.includes(cell)) {
                cellBorders[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming('#FFE44D'));
            } else {
                cellBorders[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming(grayColor));
            }
        }
    };

    useEffect(() => {
        if (curRow === 0) return;

        rows[curRow - 1].map((cell, cellIndex) => {
            setCellColor(cell, curRow - 1, cellIndex);
            setBorderColor(cell, curRow - 1, cellIndex);
        });
    }, [curRow]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                addKey('ENTER');
            } else if (event.key === 'Backspace') {
                addKey('BACKSPACE');
            } else if (event.key.length === 1) {
                addKey(event.key);
            }
        };

        if (Platform.OS === 'web') {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (Platform.OS === 'web') {
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [curCol]);

    const handleForfeit = async () => {
        if (isMultiplayer && roomId && user && room) {
            Alert.alert('¿Rendirse?', '¿Estás seguro que querés rendirte? La partida contará como derrota.', [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Rendirse',
                    style: 'destructive',
                    onPress: async () => {
                        const opponentId = room.guestId === user.id ? room.hostId : room.guestId;

                        if (opponentId) {
                            try {
                                await markGameWon(roomId, opponentId, user.id);

                                const statsRef = doc(FIRESTORE_DB, `multiplayerStats/${user.id}`);
                                const statsSnap = await getDoc(statsRef);
                                const currentStats = statsSnap.exists() ? statsSnap.data() : {wins: 0, losses: 0};

                                await setDoc(statsRef, {
                                    wins: currentStats.wins,
                                    losses: currentStats.losses + 1,
                                });
                            } catch (error) {
                                console.error('Error al abandonar la partida:', error);
                                Alert.alert('Error', 'No se pudo abandonar la partida');
                            }
                        }
                    },
                },
            ]);
        } else {
            router.back();
        }
    };

    const handleTimeExpired = async () => {
        if (isMultiplayer && roomId) {
            try {
                const roomRef = doc(FIRESTORE_DB, `rooms/${roomId}`);
                await deleteDoc(roomRef);

                router.push('/');
            } catch (error) {
                console.error('Error cleaning up expired game:', error);
            }
        }
    };
    const pathname = usePathname();

    const resetGameState = () => {
        setRows(new Array(ROWS).fill(new Array(5).fill('')));
        setCurRow(0);
        setCurCol(0);
        setBlueLetters([]);
        setYellowLetters([]);
        setGrayLetters([]);
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < 5; j++) {
                cellBackgrounds[i][j].value = 'transparent';
                cellBorders[i][j].value = Colors.light.gray;
            }
        }
        if (!isMultiplayer) {
            setWord(words[Math.floor(Math.random() * words.length)]);
        }
    };

    useEffect(() => {
        resetGameState();
    }, [isMultiplayer, pathname]);

    return (
        <View style={[styles.container, {backgroundColor}]}>
            <Stack.Screen
                options={{
                    headerBackVisible: false,
                    headerLeft: () =>
                        isMultiplayer ? (
                            <TouchableOpacity onPress={handleForfeit} style={styles.headerIcon}>
                                <Ionicons name="close-outline" size={28} color={textColor} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => router.replace('/')} style={styles.headerIcon}>
                                <Ionicons name="close-outline" size={28} color={textColor} />
                            </TouchableOpacity>
                        ),
                    headerRight: () => (
                        <View style={styles.headerIcon}>
                            {!isMultiplayer && (
                                <Link href={'/leaderboard'}>
                                    <Ionicons name="podium-outline" size={28} color={textColor} />
                                </Link>
                            )}
                            <Link href={'/howtoplay'}>
                                <Ionicons name="help-circle-outline" size={28} color={textColor} />
                            </Link>
                        </View>
                    ),
                    headerTitle: () =>
                        isMultiplayer ? (
                            <View>
                                {!isMultiplayer && (
                                    <View style={styles.headerTitleContainerSignedIn}>
                                        <Coin width={18} height={18} />
                                        <ThemedText style={styles.coinCounter}>{userScore?.coins ?? 0}</ThemedText>
                                    </View>
                                )}
                                {room?.gameStartedAt ? <GameTimer startTime={room.gameStartedAt} onTimeExpired={handleTimeExpired} /> : <ThemedText>Esperando...</ThemedText>}
                            </View>
                        ) : (
                            <View>
                                <SignedIn>
                                    {!isMultiplayer && (
                                        <View style={styles.headerTitleContainerSignedIn}>
                                            <Coin width={18} height={18} />
                                            <ThemedText style={styles.coinCounter}>{userScore?.coins ?? 0}</ThemedText>
                                        </View>
                                    )}
                                </SignedIn>
                            </View>
                        ),
                }}
            />

            <View style={styles.gameField}>
                {rows.map((row, rowIndex) => (
                    <Animated.View style={[styles.gameFieldRow, rowStyles[rowIndex]]} key={`row-${rowIndex}`} layout={Layout}>
                        {row.map((cell, cellIndex) => (
                            <Animated.View
                                entering={FadeIn.duration(300).delay(25 * (cellIndex + rowIndex * 5))}
                                style={[styles.cell, tileStyles[rowIndex][cellIndex]]}
                                key={`cell-${rowIndex}-${cellIndex}`}
                                layout={Layout}
                            >
                                <Text
                                    style={[
                                        styles.cellText,
                                        {
                                            color: curRow > rowIndex ? '#FFFFFF' : textColor,
                                        },
                                    ]}
                                >
                                    {cell}
                                </Text>
                            </Animated.View>
                        ))}
                    </Animated.View>
                ))}
            </View>

            <View style={styles.keyboardContainer}>
                <OnScreenKeyboard onKeyPressed={addKey} onWordRecognized={addWord} blueLetters={blueLetters} yellowLetters={yellowLetters} grayLetters={grayLetters} />
            </View>

            <View style={styles.hintsContainer}>
                {!isMultiplayer && <Hints word={word} grayLetters={grayLetters} onHintUsed={handleHint} />}
                {isMultiplayer && (
                    <View style={styles.opponentContainer}>
                        <ThemedText style={[styles.opponentName, {fontSize: 22, marginBottom: 15}]}>
                            Jugando contra: {room?.hostId === user?.id ? room?.guestFullName || 'Oponente' : room?.hostFullName || 'Oponente'}
                        </ThemedText>
                        <ThemedText style={[styles.opponentName, {fontStyle: 'italic', fontSize: 14}]}>Las ayudas están desactivadas en partidas multijugador</ThemedText>
                    </View>
                )}
            </View>

            <SignedOut>
                <View style={styles.hintsContainer}></View>
            </SignedOut>
        </View>
    );
};

export default game;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 5,
    },
    headerIcon: {
        flexDirection: 'row',
        gap: 10,
    },
    gameField: {
        alignItems: 'center',
        gap: 8,
        flex: 3,
    },
    gameFieldRow: {
        flexDirection: 'row',
        gap: 8,
    },
    cell: {
        backgroundColor: '#FFFFFF',
        width: 62,
        height: 62,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 30,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    hintsContainer: {
        flex: 1,
    },
    keyboardContainer: {
        flex: 1,
    },
    headerTitleContainerSignedIn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    coinCounter: {
        marginLeft: 5,
    },
    opponentContainer: {
        alignItems: 'center',
        paddingTop: 40,
    },
    opponentName: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium',
        paddingHorizontal: 20,
    },
});
