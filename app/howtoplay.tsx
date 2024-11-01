import {StyleSheet, View, ScrollView, useColorScheme, Text} from 'react-native';
import React from 'react';
import ThemedText from '@/components/ThemedText';
import {Ionicons} from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Coin from '@/assets/images/coin.svg';

const HowToPlay = () => {
    const colorScheme = useColorScheme();
    const backgroundColor = Colors[colorScheme ?? 'light'].buttonBg;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <ThemedText style={styles.title}>Cómo jugar</ThemedText>
            </View>

            <View>
                <ThemedText style={styles.subTitle}>Descubre la palabra en 6 intentos o menos</ThemedText>
            </View>

            <View>
                <View style={styles.listItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={[styles.itemText, {marginBottom: 10}]}>Cada intento de adivinanza debe ser una palabra de 5 letras que exista.</ThemedText>
                </View>
                <View style={styles.listItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.itemText}>El color de las celdas va a cambiar para mostrar que tan cerca estuviste de adivinar.</ThemedText>
                </View>
                <View>
                    <ThemedText style={[styles.subTitle, {paddingBottom: 10}]}>Colores de celda / teclado</ThemedText>

                    <View style={[styles.itemContainer, {marginLeft: 12}]}>
                        <View style={[styles.colorBox, {backgroundColor: '#6ABDED'}]} />
                        <ThemedText style={styles.itemText}> La letra está en el lugar correcto.</ThemedText>
                    </View>

                    <View style={[styles.itemContainer, {marginLeft: 12}]}>
                        <View style={[styles.colorBox, {backgroundColor: '#FFE44D'}]} />
                        <ThemedText style={styles.itemText}> La letra va en otro lugar.</ThemedText>
                    </View>

                    <View style={[styles.itemContainer, {marginLeft: 12}]}>
                        <View style={[styles.colorBox, {backgroundColor: '#787c7e'}]} />
                        <ThemedText style={styles.itemText}> La letra no va.</ThemedText>
                    </View>
                </View>
                <View>
                    <ThemedText style={[styles.subTitle, {paddingBottom: 10}]}>Puntuación</ThemedText>

                    <View style={styles.listItem}>
                        <ThemedText style={styles.bullet}>•</ThemedText>
                        <ThemedText style={styles.itemText}>Ganar partida: 10 puntos / 10 monedas.</ThemedText>
                    </View>
                    <View style={styles.listItem}>
                        <ThemedText style={styles.bullet}>•</ThemedText>
                        <ThemedText style={styles.itemText}>Ganar en racha: 20 puntos / 20 monedas.</ThemedText>
                    </View>
                </View>
                <View style={[{marginBottom: 50}]}>
                    <ThemedText style={[styles.subTitle, {paddingBottom: 10}]}>Ayudas</ThemedText>
                    <View style={[styles.itemContainer, {marginVertical: 15}]}>
                        <View style={styles.buttonContainer}>
                            <View style={[styles.helpBtn, {borderColor: backgroundColor}]}>
                                <Ionicons name="bulb-outline" size={15} color={backgroundColor} />
                            </View>
                            <View style={styles.priceContainer}>
                                <Coin width={9} height={9} />
                                <Text style={[styles.priceText, {color: backgroundColor}]}>25</Text>
                            </View>
                        </View>
                        <ThemedText style={styles.itemText}>Elimina 3 letras.</ThemedText>
                    </View>
                    <View style={[styles.itemContainer, {marginVertical: 15}]}>
                        <View style={styles.buttonContainer}>
                            <View style={[styles.helpBtn, {borderColor: backgroundColor}]}>
                                <Ionicons name="bulb-outline" size={15} color={backgroundColor} />
                            </View>
                            <View style={styles.priceContainer}>
                                <Coin width={9} height={9} />
                                <Text style={[styles.priceText, {color: backgroundColor}]}>50</Text>
                            </View>
                        </View>
                        <ThemedText style={styles.itemText}>Muestra una letra correcta.</ThemedText>
                    </View>
                    <View style={[styles.itemContainer, {marginVertical: 15}]}>
                        <View style={styles.buttonContainer}>
                            <View style={[styles.helpBtn, {borderColor: backgroundColor}]}>
                                <Ionicons name="bulb-outline" size={15} color={backgroundColor} />
                            </View>
                            <View style={styles.priceContainer}>
                                <Coin width={9} height={9} />
                                <Text style={[styles.priceText, {color: backgroundColor}]}>75</Text>
                            </View>
                        </View>
                        <ThemedText style={styles.itemText}>Eliminar 5 letras.</ThemedText>
                    </View>
                    <View style={[styles.itemContainer, {marginVertical: 15}]}>
                        <View style={styles.buttonContainer}>
                            <View style={[styles.helpBtn, {borderColor: backgroundColor}]}>
                                <Ionicons name="bulb-outline" size={15} color={backgroundColor} />
                            </View>
                            <View style={styles.priceContainer}>
                                <Coin width={9} height={9} />
                                <Text style={[styles.priceText, {color: backgroundColor}]}>200</Text>
                            </View>
                        </View>
                        <ThemedText style={styles.itemText}>Muestra todas las letras correctas.</ThemedText>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default HowToPlay;

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
        paddingTop: 30,
        paddingBottom: 10,
        fontSize: 40,
        fontFamily: 'FrankRuhlLibre_900Black',
    },
    subTitle: {
        paddingVertical: 20,
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    colorBox: {
        width: 24,
        height: 24,
        marginRight: 5,
    },
    buttonContainer: {
        alignItems: 'center',
        position: 'relative',
    },
    helpBtn: {
        marginHorizontal: 10,
        width: 30,
        height: 30,
        borderRadius: 30,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: -18,
    },
    priceText: {
        fontSize: 12,
        marginLeft: 3,
    },
});
