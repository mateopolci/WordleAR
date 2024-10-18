import { Text, View, StyleSheet, StatusBar } from "react-native";
import Icon from "@/assets/images/wordlear-icon.svg";
import { Link } from "expo-router";
import { format } from "date-fns";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';


export default function Index() {
    const { signOut } = useAuth();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon width={100} height={70} />
                <ThemedText style={styles.title}>
                    Wordle
                    <Text style={styles.titleHighlight}>AR</Text>
                </ThemedText>
                <ThemedText style={styles.text}>
                    Descubre la palabra de 5 letras en 6 intentos.
                </ThemedText>
            </View>

            <View style={styles.menu}>
                <Link href={"/game"} asChild>
                    <ThemedButton
                        title="Jugar"
                        style={styles.btn}
                    ></ThemedButton>
                </Link>

                <SignedOut>
                    <Link href={"/login"} asChild>
                        <ThemedButton
                            title="Iniciar sesión"
                            style={styles.btn}
                        ></ThemedButton>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <ThemedButton
                        onPress={() => signOut()}
                        title="Cerrar Sesión"
                        style={styles.btn}
                    ></ThemedButton>
                </SignedIn>
            </View>

            <View style={styles.footer}>
                <ThemedText style={styles.footerDate}>
                    {format(new Date(), "dd/MM/yyyy")}
                </ThemedText>
                <ThemedText style={styles.footerNumber}>Número 1151</ThemedText>
                <ThemedText style={styles.footerText}>
                    Desarrollado por: Mateo Polci Oriana Monaldi
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 80,
        gap: 40,
    },
    header: {
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontSize: 40,
        fontFamily: "FrankRuhlLibre_800ExtraBold",
    },
    titleHighlight: {
        color: "#6ABDED",
        fontSize: 40,
        fontFamily: "FrankRuhlLibre_900Black",
    },
    text: {
        fontSize: 26,
        textAlign: "center",
        fontFamily: "FrankRuhlLibre_500Medium",
    },
    footer: {
        alignItems: "center",
        justifyContent: "center",
    },
    footerDate: {
        fontSize: 16,
        fontWeight: "bold",
    },
    footerNumber: {
        paddingBottom: 20,
        fontWeight: "500",
    },
    footerText: {
        fontSize: 16,
        fontFamily: "FrankRuhlLibre_500",
        textAlign: "center",
        paddingHorizontal: 70,
    },
    menu: {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    btn: {
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        width: 150,
    },
});
