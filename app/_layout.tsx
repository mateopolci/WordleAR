import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
    useFonts,
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";

// Cargar las fuentes primero
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
        </Stack>
    );
}
