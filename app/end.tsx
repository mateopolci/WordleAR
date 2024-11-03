import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link, useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect, useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import Icon from '@/assets/images/wordlear-icon.svg';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import {SignedIn, SignedOut, useUser} from '@clerk/clerk-expo';
import ThemedButton from '@/components/ThemedButton';
import * as MailComposer from 'expo-mail-composer';
import {FIRESTORE_DB} from '@/utils/FirebaseConfig';
import {doc, getDoc, setDoc} from 'firebase/firestore';

const end = () => {
    const {win, word, gameField} = useLocalSearchParams<{
        win: string;
        word: string;
        gameField?: string;
    }>();

    const router = useRouter();
    const [userScore, setUserScore] = useState<any>();
    const {user} = useUser();

    useEffect(() => {
        if (user) {
            updateHighScore();
        }
    }, [user]);

    const updateHighScore = async () => {
        if (!user) return;

        const docRef = doc(FIRESTORE_DB, `highscores/${user.id}`);
        const docSnap = await getDoc(docRef);

        let newScore = {
            fullName:`${user.firstName} ${user.lastName}`.trim(),
            played: 1,
            wins: win === 'true' ? 1 : 0,
            lastGame: win === 'true' ? 'win' : 'loss',
            currentStreak: win === 'true' ? 1 : 0,
            totalPoints: win === 'true' ? 10 : 0,
            coins: win === 'true' ? 10 : 0,
        };

        if (docSnap.exists()) {
            const data = docSnap.data();

            newScore = {
                fullName: `${user.firstName} ${user.lastName}`.trim(),
                played: data.played + 1,
                wins: win === 'true' ? data.wins + 1 : data.wins,
                lastGame: win === 'true' ? 'win' : 'loss',
                currentStreak: win === 'true' && data.lastGame === 'win' ? data.currentStreak + 1 : win === 'true' ? 1 : 0,
                totalPoints: win === 'true' ? (data.lastGame === 'win' ? data.totalPoints + 20 : data.totalPoints + 10) : data.totalPoints,
                coins: win === 'true' ? (data.lastGame === 'win' ? data.coins + 20 : data.coins + 10) : data.coins,
            };
        }

        await setDoc(docRef, newScore);
        setUserScore(newScore);
    };

    const shareGame = () => {
        const game = JSON.parse(gameField!);
        const imageText: string[][] = [];

        const wordLetters = word.split('');
        game.forEach((row: string[], rowIndex: number) => {
            imageText.push([]);
            row.forEach((letter, colIndex) => {
                if (wordLetters[colIndex] === letter) {
                    imageText[rowIndex].push('🟦');
                } else if (wordLetters.includes(letter)) {
                    imageText[rowIndex].push('🟨');
                } else {
                    imageText[rowIndex].push('⬜');
                }
            });
        });

        const textRepresentation = `Esta fue mi partida en WordleAR, ¿Podés superarme?\n\n${imageText.map((row) => row.join(' ')).join('\n')}`;

        MailComposer.composeAsync({
            subject: `Acabo de jugar a WordleAR!`,
            body: textRepresentation,
            isHtml: false,
        });
    };

    const navigateRoot = () => {
        router.dismissAll();
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={navigateRoot}
                style={{
                    alignSelf: 'flex-end',
                }}
            >
                <Ionicons name="close" size={30} color={Colors.light.gray} />
            </TouchableOpacity>

            <View style={styles.header}>
                {win === 'true' ? <Ionicons name="star" size={60} color="#FFE44D" /> : <Icon width={100} height={70} />}

                <ThemedText style={styles.title}>{win === 'true' ? '¡Ganaste!' : 'Gracias por jugar'}</ThemedText>

                <ThemedText style={styles.text}>{win === 'false' && `La palabra era: ${word.toUpperCase()}`}</ThemedText>

                <SignedOut>
                    <ThemedText style={styles.text}>¿Querés ver tus rachas y estadísticas?</ThemedText>

                    <Link href={'/login'} asChild>
                        <ThemedButton title="Iniciar sesión" style={styles.btn}></ThemedButton>
                    </Link>
                </SignedOut>

                <SignedIn>
                    <ThemedText style={styles.text}>Resumen de tus logros</ThemedText>
                    <View style={styles.stats}>
                        <View>
                            <ThemedText style={styles.score}>{userScore?.played}</ThemedText>
                            <ThemedText>Jugadas</ThemedText>
                        </View>
                        <View>
                            <ThemedText style={styles.score}>{userScore?.wins}</ThemedText>
                            <ThemedText>Ganadas</ThemedText>
                        </View>
                        <View>
                            <ThemedText style={styles.score}>{userScore?.currentStreak}</ThemedText>
                            <ThemedText>Racha</ThemedText>
                        </View>
                        <View>
                            <ThemedText style={styles.score}>{userScore?.coins}</ThemedText>
                            <ThemedText>Monedas</ThemedText>
                        </View>
                        <View>
                            <ThemedText style={styles.score}>{userScore?.totalPoints}</ThemedText>
                            <ThemedText>Puntos</ThemedText>
                        </View>
                    </View>
                </SignedIn>

                <View
                    style={{
                        height: StyleSheet.hairlineWidth,
                        width: '100%',
                        backgroundColor: '#4e4e4e',
                    }}
                />

                <TouchableOpacity onPress={shareGame} style={styles.iconBtn}>
                    <Text style={styles.btnText}>Compartir</Text>
                    <Ionicons name="share-social" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default end;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
    },
    header: {
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontFamily: 'FrankRuhlLibre_800ExtraBold',
        fontSize: 30,
        textAlign: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium',
    },
    btn: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        width: 150,
        marginTop: 10,
    },
    btnText: {
        padding: 14,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 10,
        paddingVertical: 10,
    },
    score: {
        fontSize: 26,
        fontFamily: 'bold',
        textAlign: 'center',
    },
    iconBtn: {
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 30,
        width: '70%',
    },
});
