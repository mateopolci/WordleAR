import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
    useFonts,
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";
import { DefaultTheme, DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";

// Cargar las fuentes primero
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme(); 

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
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </ThemeProvider>
    );
}
