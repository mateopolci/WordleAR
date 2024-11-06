import {Platform, Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React, { useState } from 'react';
import {Ionicons} from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';

type OnScreenKeyboardProps = {
    onKeyPressed: (key: string) => void;
    onWordRecognized: (word: string) => void;
    blueLetters: string[];
    yellowLetters: string[];
    grayLetters: string[];
};

export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';
export const MICROPHONE = 'MICROPHONE';

const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', MICROPHONE],
    [ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', BACKSPACE],
];

const OnScreenKeyboard = ({onKeyPressed, onWordRecognized, blueLetters, yellowLetters, grayLetters}: OnScreenKeyboardProps) => {
    const {width} = useWindowDimensions();
    const keyWidth = Platform.OS === 'web' ? 58 : (width - 60) / keys[0].length;
    const keyHeight = 55;
    const [isRecording, setIsRecording] = useState(false);

    const isSpecialKey = (key: string) => [ENTER, BACKSPACE].includes(key);
    const isInLetters = (key: string) => [...blueLetters, ...yellowLetters, ...grayLetters].includes(key);

    React.useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechResults = (e: any) => {
        if (e.value && e.value[0]) {
            const word = e.value[0].toLowerCase().trim();
            if (word.length === 5) {
                onWordRecognized(word);
            }
        }
        setIsRecording(false);
    };
    
    const handleMicrophonePress = async () => {
        try {
            if (isRecording) {
                await Voice.stop();
                setIsRecording(false);
            } else {
                setIsRecording(true);
                await Voice.start('es-ES');
            }
        } catch (error) {
            console.error(error);
            setIsRecording(false);
        }
    };

    return (
        <View style={styles.container}>
            {keys.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                    {row.map((key, keyIndex) => (
                        <Pressable
                            key={`key=${key}`}
                            onPress={() => key === MICROPHONE ? handleMicrophonePress() : onKeyPressed(key)}
                            style={({pressed}) => [
                                styles.key,
                                {
                                    width: keyWidth,
                                    height: keyHeight,
                                    backgroundColor: '#DDD',
                                },
                                isSpecialKey(key) && {width: keyWidth * 1.5},
                                {
                                    backgroundColor: blueLetters.includes(key) ? '#6ABDED' : 
                                                   yellowLetters.includes(key) ? '#FFE44D' : 
                                                   grayLetters.includes(key) ? '#808080' : 
                                                   key === MICROPHONE && isRecording ? '#FF4444' : '#DDD',
                                },
                                pressed && {backgroundColor: '#868686'},
                            ]}
                        >
                            <Text style={[
                                styles.keyText, 
                                key === 'ENTER' && {fontSize: 12}, 
                                isInLetters(key) && {color: '#FFFFFF'}
                            ]}>
                                {isSpecialKey(key) ? 
                                    key === ENTER ? 
                                        'Enter' : 
                                        <Ionicons name="backspace-outline" size={24} color={'black'} /> :
                                 key === MICROPHONE ?
                                    <Ionicons name="mic-outline" size={24} color={isRecording ? 'white' : 'black'} /> :
                                    key}
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