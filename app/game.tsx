import {StyleSheet, Text, View, useColorScheme, Alert} from 'react-native';
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
import {SignedIn} from '@clerk/clerk-expo';
import {useUser} from '@clerk/clerk-expo';
import {doc, getDoc, onSnapshot} from 'firebase/firestore';
import {FIRESTORE_DB} from '@/utils/FirebaseConfig';

//Modificar a 1 para debug
const ROWS = 6;

const game = () => {
    const {user} = useUser();
    const [userScore, setUserScore] = useState<any>();
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (user) {
            // Inicialmente cargamos los datos
            fetchUserScore();
            
            // Configuramos el listener en tiempo real
            const docRef = doc(FIRESTORE_DB, `highscores/${user.id}`);
            unsubscribeRef.current = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setUserScore(doc.data());
                }
            });
        }

        // Limpieza del listener cuando el componente se desmonta
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
            Alert.alert('Cuidado', 'La palabra debe tener 5 letras');
            return;
        }
        if (!allWords.includes(currentWord)) {
            Alert.alert('Cuidado', `${currentWord.toUpperCase()} no es una palabra válida`);
            return;
        }
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
        }, 1500);
        setCurRow(curRow + 1);
        setCurCol(0);
    };

    const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
        if (curRow > rowIndex) {
            if (wordLetters[cellIndex] === cell) {
                return '#6ABDED';
            } else if (wordLetters.includes(cell)) {
                return '#FFE44D';
            } else {
                return grayColor;
            }
        }
        return 'transparent';
    };

    const getBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
        if (curRow > rowIndex && cell !== '') {
            return getCellColor(cell, rowIndex, cellIndex);
        }
        return Colors.light.gray;
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

    return (
        <View style={[styles.container, {backgroundColor}]}>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <View style={styles.headerIcon}>
                            <Link href={'/howtoplay'}>
                                <Ionicons name="help-circle-outline" size={28} color={textColor} />
                            </Link>
                            <Link href={'/leaderboard'}>
                                <Ionicons name="podium-outline" size={28} color={textColor} />
                            </Link>
                            <Ionicons name="settings-sharp" size={28} color={textColor} />
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
                    <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                            <View
                                style={[
                                    styles.cell,
                                    {
                                        backgroundColor: getCellColor(cell, rowIndex, cellIndex),
                                        borderColor: getBorderColor(cell, rowIndex, cellIndex),
                                    },
                                ]}
                                key={`cell-${rowIndex}-${cellIndex}`}
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
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            <View style={styles.keyboardContainer}>
                <OnScreenKeyboard onKeyPressed={addKey} blueLetters={blueLetters} yellowLetters={yellowLetters} grayLetters={grayLetters} />
            </View>
            <SignedIn>
                <View style={styles.hintsContainer}>
                    <Hints word={word} grayLetters={grayLetters} onHintUsed={handleHint} />
                </View>
            </SignedIn>
        </View>
    );
};

export default game;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 25,
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
        flex: 0.6,
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