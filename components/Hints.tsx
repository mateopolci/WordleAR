import {StyleSheet, TouchableOpacity, View, Text, useColorScheme, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Ionicons} from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Coin from '@/assets/images/coin.svg';
import {useUser} from '@clerk/clerk-expo';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {FIRESTORE_DB} from '@/utils/FirebaseConfig';

type HintsProps = {
    word: string;
    grayLetters: string[];
    onHintUsed: (hint: 'gray3' | 'gray5' | 'yellow1' | 'yellowAll', letters: string[]) => void;
};

const HINT_COSTS = {
    hint1: 25,
    hint2: 50,
    hint3: 75,
    hint4: 200
};

const Hints = ({word, grayLetters, onHintUsed}: HintsProps) => {
    const colorScheme = useColorScheme();
    const [hintsUsed, setHintsUsed] = useState({
        hint1: false,
        hint2: false,
        hint3: false,
        hint4: false,
    });
    const [userCoins, setUserCoins] = useState(0);
    const {user} = useUser();

    const backgroundColor = Colors[colorScheme ?? 'light'].buttonBg;
    const textColor = Colors[colorScheme ?? 'light'].buttonText;

    useEffect(() => {
        if (user) {
            fetchUserCoins();
        }
    }, [user]);

    const fetchUserCoins = async () => {
        if (!user) return;
        const docRef = doc(FIRESTORE_DB, `highscores/${user.id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUserCoins(docSnap.data().coins || 0);
        }
    };

    const updateUserCoins = async (cost: number) => {
        if (!user) return;
        const docRef = doc(FIRESTORE_DB, `highscores/${user.id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const currentData = docSnap.data();
            await setDoc(docRef, {
                ...currentData,
                coins: currentData.coins - cost
            });
            setUserCoins(currentData.coins - cost);
        }
    };

    const validateAndExecuteHint = async (
        hintKey: 'hint1' | 'hint2' | 'hint3' | 'hint4',
        cost: number,
        hintFunction: () => string[]
    ) => {
        if (hintsUsed[hintKey]) return;

        if (userCoins < cost) {
            Alert.alert('Te faltan monedas', 'Consigue más monedas ganando partidas');
            return;
        }

        const letters = hintFunction();
        if (letters.length > 0) {
            await updateUserCoins(cost);
            
            switch (hintKey) {
                case 'hint1':
                    onHintUsed('gray3', letters);
                    break;
                case 'hint2':
                    onHintUsed('yellow1', letters);
                    break;
                case 'hint3':
                    onHintUsed('gray5', letters);
                    break;
                case 'hint4':
                    onHintUsed('yellowAll', letters);
                    break;
            }
            
            setHintsUsed(prev => ({...prev, [hintKey]: true}));
        }
    };

    const getAllAvailableLetters = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const wordLetters = word.split('');
        return alphabet.filter((letter) => !wordLetters.includes(letter) && !grayLetters.includes(letter));
    };

    const getRandomLetters = (count: number) => {
        const availableLetters = getAllAvailableLetters();
        const result: string[] = [];

        while (result.length < count && availableLetters.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableLetters.length);
            result.push(availableLetters[randomIndex]);
            availableLetters.splice(randomIndex, 1);
        }

        return result;
    };

    const hint1 = () => validateAndExecuteHint('hint1', HINT_COSTS.hint1, () => getRandomLetters(3));
    
    const hint2 = () => validateAndExecuteHint('hint2', HINT_COSTS.hint2, () => {
        const wordLetters = word.split('');
        const randomIndex = Math.floor(Math.random() * wordLetters.length);
        return [wordLetters[randomIndex]];
    });
    
    const hint3 = () => validateAndExecuteHint('hint3', HINT_COSTS.hint3, () => getRandomLetters(5));
    
    const hint4 = () => validateAndExecuteHint('hint4', HINT_COSTS.hint4, () => {
        return Array.from(new Set(word.split('')));
    });

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.helpBtn,
                        {
                            backgroundColor: hintsUsed.hint1 ? '#808080' : textColor,
                            borderColor: backgroundColor,
                            opacity: userCoins < HINT_COSTS.hint1 ? 0.5 : 1
                        },
                    ]}
                    onPress={hint1}
                >
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Coin width={18} height={18} />
                    <Text style={[styles.priceText, {color: backgroundColor}]}>{HINT_COSTS.hint1}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.helpBtn,
                        {
                            backgroundColor: hintsUsed.hint2 ? '#808080' : textColor,
                            borderColor: backgroundColor,
                            opacity: userCoins < HINT_COSTS.hint2 ? 0.5 : 1
                        },
                    ]}
                    onPress={hint2}
                >
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Coin width={18} height={18} />
                    <Text style={[styles.priceText, {color: backgroundColor}]}>{HINT_COSTS.hint2}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.helpBtn,
                        {
                            backgroundColor: hintsUsed.hint3 ? '#808080' : textColor,
                            borderColor: backgroundColor,
                            opacity: userCoins < HINT_COSTS.hint3 ? 0.5 : 1
                        },
                    ]}
                    onPress={hint3}
                >
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Coin width={18} height={18} />
                    <Text style={[styles.priceText, {color: backgroundColor}]}>{HINT_COSTS.hint3}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.helpBtn,
                        {
                            backgroundColor: hintsUsed.hint4 ? '#808080' : textColor,
                            borderColor: backgroundColor,
                            opacity: userCoins < HINT_COSTS.hint4 ? 0.5 : 1
                        },
                    ]}
                    onPress={hint4}
                >
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Coin width={18} height={18} />
                    <Text style={[styles.priceText, {color: backgroundColor}]}>{HINT_COSTS.hint4}</Text>
                </View>
            </View>
        </View>
    );
};

export default Hints;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpBtn: {
        marginHorizontal: 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'black',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        position: 'relative',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: -25,
    },
    priceText: {
        fontSize: 12,
        marginLeft: 3,
    },
});