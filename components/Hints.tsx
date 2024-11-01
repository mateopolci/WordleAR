import {StyleSheet, TouchableOpacity, View, Text, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Coin from '@/assets/images/coin.svg';

type HintsProps = {
    word: string;
    grayLetters: string[];
    onHintUsed: (hint: 'gray3' | 'gray5' | 'yellow1' | 'yellowAll', letters: string[]) => void;
};

const Hints = ({word, grayLetters, onHintUsed}: HintsProps) => {
    const colorScheme = useColorScheme();
    const [hintsUsed, setHintsUsed] = useState({
        hint1: false,
        hint2: false,
        hint3: false,
        hint4: false,
    });

    const backgroundColor = Colors[colorScheme ?? 'light'].buttonBg;
    const textColor = Colors[colorScheme ?? 'light'].buttonText;

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

    const hint1 = () => {
        if (hintsUsed.hint1) return;
        const letters = getRandomLetters(3);
        if (letters.length === 3) {
            onHintUsed('gray3', letters);
            setHintsUsed((prev) => ({...prev, hint1: true}));
        }
    };

    const hint2 = () => {
        if (hintsUsed.hint2) return;
        const wordLetters = word.split('');
        const randomIndex = Math.floor(Math.random() * wordLetters.length);
        onHintUsed('yellow1', [wordLetters[randomIndex]]);
        setHintsUsed((prev) => ({...prev, hint2: true}));
    };

    const hint3 = () => {
        if (hintsUsed.hint3) return;
        const letters = getRandomLetters(5);
        if (letters.length === 5) {
            onHintUsed('gray5', letters);
            setHintsUsed((prev) => ({...prev, hint3: true}));
        }
    };

    const hint4 = () => {
        if (hintsUsed.hint4) return;
        const uniqueLetters = Array.from(new Set(word.split('')));
        onHintUsed('yellowAll', uniqueLetters);
        setHintsUsed((prev) => ({...prev, hint4: true}));
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.helpBtn,
                        {
                            backgroundColor: hintsUsed.hint1 ? '#808080' : textColor,
                            borderColor: backgroundColor,
                        },
                    ]}
                    onPress={hint1}
                >
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Coin width={18} height={18} />
                    <Text style={[styles.priceText, {color: backgroundColor}]}>25</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.helpBtn,
                        {
                            backgroundColor: hintsUsed.hint2 ? '#808080' : textColor,
                            borderColor: backgroundColor,
                        },
                    ]}
                    onPress={hint2}
                >
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Coin width={18} height={18} />
                    <Text style={[styles.priceText, {color: backgroundColor}]}>50</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.helpBtn,
                        {
                            backgroundColor: hintsUsed.hint3 ? '#808080' : textColor,
                            borderColor: backgroundColor,
                        },
                    ]}
                    onPress={hint3}
                >
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Coin width={18} height={18} />
                    <Text style={[styles.priceText, {color: backgroundColor}]}>75</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.helpBtn,
                        {
                            backgroundColor: hintsUsed.hint4 ? '#808080' : textColor,
                            borderColor: backgroundColor,
                        },
                    ]}
                    onPress={hint4}
                >
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Coin width={18} height={18} />
                    <Text style={[styles.priceText, {color: backgroundColor}]}>200</Text>
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
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
