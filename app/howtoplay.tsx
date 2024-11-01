import {StyleSheet, View} from 'react-native';
import React from 'react';
import ThemedText from '@/components/ThemedText';

const howtoplay = () => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <ThemedText style={styles.title}>Cómo jugar</ThemedText>
            </View>

            <View>
                <ThemedText style={styles.subTitle}>Descubre la palabra en 6 intentos</ThemedText>
            </View>

            <View style={styles.container}>
                <View style={styles.listItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.itemText}>Cada intento de adivinanza debe ser una palabra de 5 letras que exista.</ThemedText>
                </View>
                <View style={styles.listItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.itemText}>El color de las celdas va a cambiar para mostrar que tan cerca estuviste de adivinar.</ThemedText>
                </View>

                <View>
                    <ThemedText style={[styles.subTitle, {paddingBottom: 15}]}>Colores de celda</ThemedText>

                    <View style={styles.colorContainer}>
                        <View style={[styles.colorBox, {backgroundColor: '#6ABDED'}]} />
                        <ThemedText style={styles.itemText}> La letra está en el lugar correcto de la palabra.</ThemedText>
                    </View>

                    <View style={styles.colorContainer}>
                        <View style={[styles.colorBox, {backgroundColor: '#FFE44D'}]} />
                        <ThemedText style={styles.itemText}> La letra va en otro lugar de la palabra.</ThemedText>
                    </View>

                    <View style={styles.colorContainer}>
                        <View style={[styles.colorBox, {backgroundColor: '#787c7e'}]} />
                        <ThemedText style={styles.itemText}> La letra no se encuentra en la palabra.</ThemedText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default howtoplay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        gap: 20,
    },
    titleContainer: {
        alignItems: 'center',
    },
    title: {
        paddingTop: 20,
        fontSize: 40,
        fontFamily: 'FrankRuhlLibre_900Black',
    },
    subTitle: {
        paddingTop: 20,
        fontSize: 26,
        fontFamily: 'FrankRuhlLibre_800ExtraBold',
        textAlign: 'center',
    },
    text: {
        fontSize: 20,
        fontFamily: 'FrankRuhlLibre_500Medium',
        textAlign: 'left',
    },
    listItem: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bullet: {
        fontSize: 25,
        marginRight: 8,
    },
    itemText: {
        fontSize: 16,
    },
    colorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    colorBox: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
});
