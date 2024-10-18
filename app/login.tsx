import { StyleSheet, TextInput, useColorScheme, View } from "react-native";
import { useRouter } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors"; // Asegúrate de que la ruta sea correcta
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";

enum Strategy {
    Google = "oauth_google",
    Apple = "oauth_apple",
    Facebook = "oauth_facebook",
}

const Login = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();

    // Corrige la lógica del color de borde
    const inputBorderColor = colorScheme === "light" ? Colors.light.text : Colors.dark.text;

    const { startOAuthFlow: googleAuth } = useOAuth({
        strategy: Strategy.Google,
    });
    const { startOAuthFlow: appleAuth } = useOAuth({
        strategy: Strategy.Apple,
    });
    const { startOAuthFlow: facebookAuth } = useOAuth({
        strategy: Strategy.Facebook,
    });

    const handleGoogleAuth = async (strategy: Strategy) => {
        await googleAuth();
        router.push("/");
    };

    return (
        <ScrollView style={styles.container}>
            <ThemedText style={styles.header}>
                Iniciar sesión o crear una cuenta
            </ThemedText>
            <ThemedText style={styles.subText}>
                Al continuar, aceptas los Términos de Venta, Términos de
                Servicio y la Política de Privacidad.
            </ThemedText>

            <ThemedText style={[styles.inputLabel]}>Email</ThemedText>
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor }]} // Corrige la lógica aquí
                placeholder="tumail@gmail.com"
                placeholderTextColor={Colors.light.gray} // Opcional: Ajusta el color del placeholder
            />

            <ThemedText style={[styles.inputLabel]}>Contraseña</ThemedText>
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor }]} // Corrige la lógica aquí
                placeholder="****************"
                placeholderTextColor={Colors.light.gray} // Opcional: Ajusta el color del placeholder
            />

            <ThemedButton
                title="Iniciar sesión"
                style={styles.btn}
            />
            <View style={{ gap: 20 }} />
        </ScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        paddingTop: 30,
        paddingBottom: 20,
        textAlign: "center",
        fontFamily: "FrankRuhlLibre_900Black",
    },
    subText: {
        fontSize: 15,
        color: Colors.light.gray,
        textAlign: "center",
        marginBottom: 30,
        fontFamily: "FrankRuhlLibre_500Medium",
    },
    inputLabel: {
        fontSize: 15,
        paddingBottom: 10,
        fontWeight: "bold",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    btn: {
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        width: "auto",
        height: 50,
        textAlign: "center",
        justifyContent: "center",
    },
});
