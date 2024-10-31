import {Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import {Ionicons} from '@expo/vector-icons';

type OnScreenKeyboardProps = {
    onKeyPressed: (key: string) => void;
    blueLetters: string[];
    yellowLetters: string[];
    grayLetters: string[];
};

export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    [ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', BACKSPACE],
];

const OnScreenKeyboard = ({onKeyPressed, blueLetters, yellowLetters, grayLetters}: OnScreenKeyboardProps) => {
    const {width} = useWindowDimensions();
    const keyWidth = (width - 60) / keys[0].length;
    const keyHeight = 60;

    const isSpecialKey = (key: string) => [ENTER, BACKSPACE].includes(key);

    const isInLetters = (key: string) => [...blueLetters, ...yellowLetters, ...grayLetters].includes(key);

    return (
        <View style={styles.container}>
            {keys.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                    {row.map((key, keyIndex) => (
                        <Pressable
                            key={`key=${key}`}
                            onPress={() => onKeyPressed(key)}
                            style={({pressed}) => [
                                styles.key,
                                {
                                    width: keyWidth,
                                    height: keyHeight,
                                    backgroundColor: '#DDD',
                                },
                                isSpecialKey(key) && {width: keyWidth * 1.5},
                                {
                                    backgroundColor: blueLetters.includes(key) ? '#6ABDED' : yellowLetters.includes(key) ? '#FFE44D' : grayLetters.includes(key) ? '#808080' : '#DDD',
                                },
                                pressed && {backgroundColor: '#868686'},
                            ]}
                        >
                            <Text style={[styles.keyText, key === 'ENTER' && {fontSize: 12}, isInLetters(key) && {color: '#FFFFFF'}]}>
                                {isSpecialKey(key) ? key === ENTER ? 'Enter' : <Ionicons name="backspace-outline" size={24} color={'black'}></Ionicons> : key}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default OnScreenKeyboard;

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        gap: 4,
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
    },
    key: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    keyText: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
