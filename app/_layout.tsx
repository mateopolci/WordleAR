import {Stack, useRouter} from 'expo-router';
import {useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {useFonts, FrankRuhlLibre_800ExtraBold, FrankRuhlLibre_500Medium, FrankRuhlLibre_900Black} from '@expo-google-fonts/frank-ruhl-libre';
import {DefaultTheme, DarkTheme, ThemeProvider} from '@react-navigation/native';
import {useColorScheme, StyleSheet, Text} from 'react-native';
import {ClerkProvider, ClerkLoaded} from '@clerk/clerk-expo';
import {tokenCache} from '@/utils/cache';
import ThemedText from '@/components/ThemedText';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    let [fontsLoaded] = useFonts({
        FrankRuhlLibre_800ExtraBold,
        FrankRuhlLibre_500Medium,
        FrankRuhlLibre_900Black,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <ClerkLoaded>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <GestureHandlerRootView style={{flex: 1}}>
                        <Stack>
                            <Stack.Screen name="index" options={{headerShown: false}} />
                            <Stack.Screen
                                name="login"
                                options={{
                                    presentation: 'modal',
                                    headerTitle: () => (
                                        <ThemedText style={styles.title}>
                                            Wordle
                                            <Text style={styles.titleHighlight}>AR</Text>
                                        </ThemedText>
                                    ),
                                    headerLeft: () => (
                                        <TouchableOpacity onPress={() => router.back()}>
                                            <Ionicons name="close" size={26} color={colorScheme === 'light' ? '#000000' : '#FFFFFF'}></Ionicons>
                                        </TouchableOpacity>
                                    ),
                                }}
                            ></Stack.Screen>
                            <Stack.Screen
                                name="register"
                                options={{
                                    presentation: 'modal',
                                    headerTitle: () => (
                                        <ThemedText style={styles.title}>
                                            Wordle
                                            <Text style={styles.titleHighlight}>AR</Text>
                                        </ThemedText>
                                    ),
                                    headerLeft: () => (
                                        <TouchableOpacity onPress={() => router.back()}>
                                            <Ionicons name="close" size={26} color={colorScheme === 'light' ? '#000000' : '#FFFFFF'}></Ionicons>
                                        </TouchableOpacity>
                                    ),
                                }}
                            ></Stack.Screen>
                            <Stack.Screen
                                name="howtoplay"
                                options={{
                                    presentation: 'modal',
                                    headerBackTitle: '',
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
                                    title: '',
                                    headerBackTitleStyle: {
                                        fontFamily: 'FrankRuhlLibre_800ExtraBold',
                                        fontSize: 22,
                                    },
                                    headerLeft: () => (
                                        <TouchableOpacity onPress={() => router.back()}>
                                            <Ionicons name="close" size={26} color={colorScheme === 'light' ? '#000000' : '#FFFFFF'}></Ionicons>
                                        </TouchableOpacity>
                                    ),
                                }}
                            />
                            <Stack.Screen
                                name="leaderboard"
                                options={{
                                    headerBackTitle: '',
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
                                    title: 'Leaderboard',
                                    headerBackTitleStyle: {
                                        fontFamily: 'FrankRuhlLibre_800ExtraBold',
                                        fontSize: 22,
                                    },
                                    headerLeft: () => (
                                        <TouchableOpacity onPress={() => router.back()}>
                                            <Ionicons name="close" size={26} color={colorScheme === 'light' ? '#000000' : '#FFFFFF'}></Ionicons>
                                        </TouchableOpacity>
                                    ),
                                }}
                            />
                            <Stack.Screen
                                name="game"
                                options={{
                                    headerBackTitle: 'Wordle',
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
                                    title: '',
                                    headerBackTitleStyle: {
                                        fontFamily: 'FrankRuhlLibre_800ExtraBold',
                                        fontSize: 22,
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="end"
                                options={{
                                    headerBackTitle: 'Fin del juego',
                                    presentation: 'fullScreenModal',
                                    headerShadowVisible: false,
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
                                    title: '',
                                    headerBackTitleStyle: {
                                        fontFamily: 'FrankRuhlLibre_800ExtraBold',
                                        fontSize: 22,
                                    },
                                }}
                            />
                        </Stack>
                    </GestureHandlerRootView>
                </ThemeProvider>
            </ClerkLoaded>
        </ClerkProvider>
    );
}
const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        fontFamily: 'FrankRuhlLibre_800ExtraBold',
    },
    titleHighlight: {
        color: '#6ABDED',
        fontSize: 40,
        fontFamily: 'FrankRuhlLibre_900Black',
    },
});
