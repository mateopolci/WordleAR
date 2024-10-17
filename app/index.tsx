import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import Icon from "@/assets/images/wordlear-icon.svg";
import { Link } from "expo-router";
import { format } from "date-fns";

export default function Index() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <Icon width={100} height={70} />
                <Text style={styles.title}>
                    Wordle
                    <Text style={styles.titleHighlight}>AR</Text>
                </Text>
                <Text style={styles.text}>
                    Descubre la palabra de 5 letras en 6 intentos.
                </Text>
            </View>
            <View style={styles.menu}>
                <Link href={"/game"} asChild>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Jugar</Text>
                    </TouchableOpacity>
                </Link>

                <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerDate}>
                    {format(new Date(), "dd/MM/yyyy")}
                </Text>
                <Text style={styles.footerNumber}>Número 1151</Text>
                <Text style={styles.footerText}>Desarrollado por Mateo Polci Oriana Monaldi</Text>
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
        backgroundColor: "#000000",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        width: 150,
    },
    btnText: {
        fontSize: 16,
        color: "#FFFFFF",
    },
});
