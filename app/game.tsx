import {StyleSheet, Text, View, useColorScheme, Platform} from 'react-native';
import {useRef, useState, useEffect} from 'react';
import Colors from '@/constants/Colors';
import {Link, Stack, useRouter} from 'expo-router';
import OnScreenKeyboard from '@/components/OnScreenKeyboard';
import {Ionicons} from '@expo/vector-icons';
import {allWords} from '@/utils/allWords';
import {words} from '@/utils/targetWord2';
import Hints from '@/components/Hints';
import Coin from '@/assets/images/coin.svg';
import ThemedText from '@/components/ThemedText';
import {SignedIn, SignedOut} from '@clerk/clerk-expo';
import {useUser} from '@clerk/clerk-expo';
import {doc, getDoc, onSnapshot} from 'firebase/firestore';
import {FIRESTORE_DB} from '@/utils/FirebaseConfig';
import Animated, {FadeIn, Layout, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming} from 'react-native-reanimated';

//Modificar a 1 para debug
const ROWS = 6;

const game = () => {
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

    const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill('')));
    const [curRow, setCurRow] = useState(0);
    const [curCol, _setCurCol] = useState(0);

    const [blueLetters, setBlueLetters] = useState<string[]>([]);
    const [yellowLetters, setYellowLetters] = useState<string[]>([]);
    const [grayLetters, setGrayLetters] = useState<string[]>([]);

    //Palabra random (Descomentar para jugar)
    const [word, setWord] = useState<string>(words[Math.floor(Math.random() * words.length)]);

    //Palabra MATEO (Descomentar para debug)
    /* const [word, setWord] = useState<string>('mateo'); */

    const wordLetters = word.split('');

    const colStateRef = useRef(curCol);
    const setCurCol = (col: number) => {
        colStateRef.current = col;
        _setCurCol(col);
    };

    const checkWord = () => {
        const currentWord = rows[curRow].join('');
        if (currentWord.length < word.length) {
            shakeRow();
            return;
        }
        if (!allWords.includes(currentWord)) {
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

        setTimeout(() => {
            if (currentWord === word) {
                router.push(`/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`);
            } else if (curRow + 1 >= rows.length) {
                router.push(`/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`);
            }
        }, 1000);
        setCurRow((row) => row + 1);
        setCurCol(0);
    };

    const addKey = (key: string) => {
        console.log('addKey', key);

        const newRows = [...rows.map((row) => [...row])];

        if (key === 'ENTER') {
            checkWord();
        } else if (key === 'BACKSPACE') {
            if (colStateRef.current === 0) {
                newRows[curRow][0] = '';
                setRows(newRows);
                return;
            }
            newRows[curRow][colStateRef.current - 1] = '';
            setCurCol(colStateRef.current - 1);
            setRows(newRows);
            return;
        } else if (colStateRef.current >= newRows[curRow].length) {
            //End of line
            return;
        } else {
            newRows[curRow][colStateRef.current] = key;
            setRows(newRows);
            setCurCol(colStateRef.current + 1);
        }
    };

    const addWord = (word: string) => {
        const letters = word.split('');
        const newRows = [...rows.map((row) => [...row])];
        
        letters.forEach((letter, index) => {
            if (index < 5) {
                newRows[curRow][index] = letter;
            }
        });
        
        setRows(newRows);
        setCurCol(Math.min(letters.length, 5));
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

    return (
        <View style={[styles.container, {backgroundColor}]}>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <View style={styles.headerIcon}>
                            <Link href={'/leaderboard'}>
                                <Ionicons name="podium-outline" size={28} color={textColor} />
                            </Link>
                            <Link href={'/howtoplay'}>
                                <Ionicons name="help-circle-outline" size={28} color={textColor} />
                            </Link>
                        </View>
                    ),
                    headerTitle: () => (
                        <View>
                            <SignedIn>
                                <View style={styles.headerTitleContainerSignedIn}>
                                    <Coin width={18} height={18} />
                                    <ThemedText style={styles.coinCounter}>{userScore?.coins ?? 0}</ThemedText>
                                </View>
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
            <SignedIn>
                <View style={styles.hintsContainer}>
                    <Hints word={word} grayLetters={grayLetters} onHintUsed={handleHint} />
                </View>
            </SignedIn>
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
});