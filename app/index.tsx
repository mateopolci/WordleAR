import {Text, View, StyleSheet} from 'react-native';
import Icon from '@/assets/images/wordlear-icon.svg';
import {Link} from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import {SignedIn, SignedOut, useAuth, useUser} from '@clerk/clerk-expo';

export default function Index() {
    const {signOut} = useAuth();
    const {user} = useUser();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon width={100} height={70} />
                <ThemedText style={styles.title}>
                    Wordle
                    <Text style={styles.titleHighlight}>AR</Text>
                </ThemedText>
                <ThemedText style={styles.text}>Descubre la palabra en 6 intentos</ThemedText>
            </View>

            <View style={styles.menu}>
                <Link href={'/game'} asChild>
                    <ThemedButton title="Jugar" style={styles.btn}></ThemedButton>
                </Link>

                <SignedOut>
                    <Link href={'/login'} asChild>
                        <ThemedButton title="Iniciar sesión" style={styles.btn}></ThemedButton>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <ThemedButton onPress={() => signOut()} title="Cerrar Sesión" style={styles.btn}></ThemedButton>
                </SignedIn>
            </View>

            <SignedIn>
                <View style={styles.header}>
                    <ThemedText>Bienvenido, {user?.fullName}.</ThemedText>
                </View>
            </SignedIn>
        </View>
    );
}

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
});
