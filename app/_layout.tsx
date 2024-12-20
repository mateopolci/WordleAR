import {Stack, useRouter} from 'expo-router';
import {useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {useFonts, FrankRuhlLibre_800ExtraBold, FrankRuhlLibre_500Medium, FrankRuhlLibre_900Black} from '@expo-google-fonts/frank-ruhl-libre';
import {DefaultTheme, DarkTheme, ThemeProvider} from '@react-navigation/native';
import {useColorScheme, StyleSheet, Text, Platform} from 'react-native';
import {ClerkProvider, ClerkLoaded} from '@clerk/clerk-expo';
import {tokenCache} from '@/utils/cache';
import ThemedText from '@/components/ThemedText';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as NavigationBar from 'expo-navigation-bar';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        const hideNavigationBar = () => {
            NavigationBar.setVisibilityAsync('hidden');
        };

        if (Platform.OS === 'android') {
            hideNavigationBar();

            const interval = setInterval(hideNavigationBar, 4000);

            return () => clearInterval(interval);
        }
    }, []);

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
                                    headerLeft:
                                        Platform.OS !== 'android'
                                            ? () => (
                                                  <TouchableOpacity onPress={() => router.back()}>
                                                      <Ionicons name="close" size={26} color={colorScheme === 'light' ? '#000000' : '#FFFFFF'} />
                                                  </TouchableOpacity>
                                              )
                                            : undefined,
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
                                    headerLeft:
                                        Platform.OS !== 'android'
                                            ? () => (
                                                  <TouchableOpacity onPress={() => router.back()}>
                                                      <Ionicons name="close" size={26} color={colorScheme === 'light' ? '#000000' : '#FFFFFF'} />
                                                  </TouchableOpacity>
                                              )
                                            : undefined,
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
                                    headerLeft:
                                        Platform.OS !== 'android'
                                            ? () => (
                                                  <TouchableOpacity onPress={() => router.back()}>
                                                      <Ionicons name="close" size={26} color={colorScheme === 'light' ? '#000000' : '#FFFFFF'} />
                                                  </TouchableOpacity>
                                              )
                                            : undefined,
                                    headerTitle: () => (
                                        <ThemedText style={styles.title}>
                                            Wordle
                                            <Text style={styles.titleHighlight}>AR</Text>
                                        </ThemedText>
                                    ),
                                }}
                            />
                            <Stack.Screen
                                name="leaderboard"
                                options={{
                                    headerBackTitle: '',
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
                                    title: 'Tabla de posiciones',
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
                                name="staging"
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
                                    headerShown: false,
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
                                    title: '',
                                    headerBackTitleStyle: {
                                        fontFamily: 'FrankRuhlLibre_800ExtraBold',
                                        fontSize: 22,
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="create-room"
                                options={{
                                    title: '',
                                    headerBackTitle: '',
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
                                }}
                            />
                            <Stack.Screen
                                name="join-room"
                                options={{
                                    title: '',
                                    headerBackTitle: '',
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
                                }}
                            />
                            <Stack.Screen
                                name="multiplayer-end"
                                options={{
                                    headerShown: false,
                                    title: 'Fin de la partida',
                                    headerBackTitle: '',
                                    headerTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF',
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
