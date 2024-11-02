import {Text, View, StyleSheet, Alert} from 'react-native';
import Icon from '@/assets/images/wordlear-icon.svg';
import {Link, useRouter} from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import {SignedIn, SignedOut, useAuth, useUser} from '@clerk/clerk-expo';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Index() {
    const {signOut} = useAuth();
    const {user} = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert(
                "Error",
                "Hubo un problema al cerrar sesión. Por favor, inténtalo de nuevo."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Animated.View style={styles.container} entering={FadeInDown}>
            <View style={styles.header}>
                <Icon width={100} height={70} />
                <ThemedText style={styles.title}>
                    Wordle
                    <Text style={styles.titleHighlight}>AR</Text>
                </ThemedText>
                <ThemedText style={styles.text}>Descubre la palabra en 6 intentos o menos</ThemedText>
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
                    <ThemedButton 
                        onPress={handleSignOut} 
                        title={isLoading ? "Cerrando..." : "Cerrar Sesión"} 
                        style={styles.btn}
                        disabled={isLoading}
                    ></ThemedButton>
                </SignedIn>
            </View>

            <View>
                <SignedIn>
                    <View style={styles.header}>
                        <ThemedText style={styles.footer}>Bienvenido, {user?.fullName}.</ThemedText>
                    </View>
                </SignedIn>
                <SignedOut>
                    <View style={styles.header}>
                        <ThemedText style={styles.footer}>
                            Inicia sesión para ver tus estadísticas, ganar monedas y puntos.
                        </ThemedText>
                    </View>
                </SignedOut>
            </View>
        </Animated.View>
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
    footer: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium',
    },
});
