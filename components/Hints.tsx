import {StyleSheet, TouchableOpacity, View, Text, useColorScheme} from 'react-native';
import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const Hints = () => {
    const colorScheme = useColorScheme();

    const backgroundColor = Colors[colorScheme ?? 'light'].buttonBg;
    const textColor = Colors[colorScheme ?? 'light'].buttonText;

    const hint1 = () => {};
    const hint2 = () => {};
    const hint3 = () => {};
    const hint4 = () => {};

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.helpBtn, {backgroundColor: textColor, borderColor: backgroundColor}]} onPress={() => hint1()}>
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <Text style={[styles.priceText, {color: textColor, backgroundColor: backgroundColor}]}>$25</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.helpBtn, {backgroundColor: textColor, borderColor: backgroundColor}]} onPress={() => hint2()}>
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <Text style={[styles.priceText, {color: textColor, backgroundColor: backgroundColor}]}>$50</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.helpBtn, {backgroundColor: textColor, borderColor: backgroundColor}]} onPress={() => hint3()}>
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <Text style={[styles.priceText, {color: textColor, backgroundColor: backgroundColor}]}>$75</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.helpBtn, {backgroundColor: textColor, borderColor: backgroundColor}]} onPress={() => hint4()}>
                    <Ionicons name="bulb-outline" size={30} color={backgroundColor} />
                </TouchableOpacity>
                <Text style={[styles.priceText, {color: textColor, backgroundColor: backgroundColor}]}>$100</Text>
            </View>
        </View>
    );
};

export default Hints;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    helpBtn: {
        marginHorizontal: 10,
        marginTop: 20,
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
    priceText: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        fontSize: 12,
        padding: 3,
        borderRadius: 10,
        overflow: 'hidden',
    },
});
