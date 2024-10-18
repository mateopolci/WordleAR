import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { Ionicons } from "@expo/vector-icons";
import { allWords } from "@/utils/allWords";
import { words } from "@/utils/targetWord";

//Debug
const ROWS = 6;

const game = () => {
    const colorScheme = useColorScheme();
    const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
    const textColor = Colors[colorScheme ?? "light"].text;
    const grayColor = Colors[colorScheme ?? "light"].gray;
    const router = useRouter();

    const [rows, setRows] = useState<string[][]>(
        new Array(ROWS).fill(new Array(5).fill('')),
    );
    const [curRow, setCurRow] = useState(0);
    const [curCol, _setCurCol] = useState(0);

    const [blueLetters, setBlueLetters] = useState<string[]>([]);
    const [yellowLetters, setYellowLetters] = useState<string[]>([]);
    const [grayLetters, setGrayLetters] = useState<string[]>([]);

    //Palabra random
    /* const [word, setWord] = useState<string>(words[Math.floor(Math.random() * words.length)]); */

    //Debug
    const [word, setWord] = useState<string>('mateo');
    const wordLetters = word.split('');

    const colStateRef = useRef(curCol);
    const setCurCol = (col: number) => {
        colStateRef.current = col;
        _setCurCol(col);
    }

    const checkWord = () => {

    }

    const addKey = (key: string) => {
        console.log("addKey", key);

        const newRows = [...rows.map((row) => [...row])];

        if (key === "ENTER"){
            //Comprobar si acertó la palabra
            checkWord();
        }else if (key === "BACKSPACE"){
            if(colStateRef.current === 0) {
                newRows [curRow] [0] = '';
                setRows(newRows);
                return;
            }
            newRows[curRow][colStateRef.current - 1] = '';
            setCurCol(colStateRef.current - 1);
            setRows(newRows);
            return;
        }else if (colStateRef.current >= newRows[curRow].length){
            //End of line
            return;
        }else{
            newRows[curRow][colStateRef.current] = key;
            setRows(newRows);
            setCurCol(colStateRef.current + 1);
        }
            
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <View style={styles.headerIcon}>
                            <Ionicons
                                name="help-circle-outline"
                                size={28}
                                color={textColor}
                            />
                            <Ionicons
                                name="podium-outline"
                                size={28}
                                color={textColor}
                            />
                            <Ionicons
                                name="settings-sharp"
                                size={28}
                                color={textColor}
                            />
                        </View>
                    ),
                }}
            />

            <View style={styles.gameField}>
                {rows.map((row, rowIndex) => (
                    <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                            <View style={styles.cell} key={`cell-${rowIndex}-${cellIndex}`}>
                                <Text style={styles.cellText}>{cell}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            <OnScreenKeyboard 
                onKeyPressed={addKey}
                blueLetters={blueLetters}
                yellowLetters={yellowLetters}
                grayLetters={grayLetters}
            />
        </View>
    );
};

export default game;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
    },
    headerIcon: {
        flexDirection: "row",
        gap: 10,
    },
    gameField: {
        alignItems: "center",
        gap: 8,
    },
    gameFieldRow: {
        flexDirection: "row",
        gap: 8,
    },
    cell: {
        backgroundColor: "#FFFFFF",
        width: 62,
        height: 62,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    cellText:{
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase"
    }
});
