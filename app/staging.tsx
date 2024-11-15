import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '@/assets/images/wordlear-icon.svg';
import {Link} from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import {useRef} from 'react';

const online = () => {
    const buttonRef = useRef<TouchableOpacity>(null);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon width={100} height={70} />
                <ThemedText style={styles.title}>
                    Wordle
                    <Text style={styles.titleHighlight}>AR</Text>
                </ThemedText>
                <ThemedText style={styles.text}>Multijugador</ThemedText>
            </View>

            <View style={styles.menu}>
                <Link href={'/create-room'} asChild>
                    <ThemedButton ref={buttonRef} title="Crear sala" style={styles.btn}></ThemedButton>
                </Link>
                <Link href={'/join-room'} asChild>
                    <ThemedButton ref={buttonRef} title="Unirse a sala" style={styles.btn}></ThemedButton>
                </Link>
            </View>

        </View>
    );
}

export default online;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 80,
        gap: 40,
    },
    header: {
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 40,
        fontFamily: 'FrankRuhlLibre_800ExtraBold',
    },
    titleHighlight: {
        color: '#6ABDED',
        fontSize: 40,
        fontFamily: 'FrankRuhlLibre_900Black',
    },
    text: {
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium',
    },
    menu: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    btn: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        width: 150,
    },
    footer: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium',
    },
});
