import {
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";

const register = () => {

  const colorScheme = useColorScheme();

  const inputBorderColor =
  colorScheme === "light" ? Colors.light.text : Colors.dark.text;

  return (
<ScrollView style={styles.container}>
            <ThemedText style={styles.header}>
                Crear una cuenta
            </ThemedText>
            <ThemedText style={styles.subText}>
                Al continuar, aceptas los Términos de Venta, Términos de
                Servicio y la Política de Privacidad.
            </ThemedText>
            
            <ThemedText style={[styles.inputLabel]}>Nombre</ThemedText>
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor, color: inputBorderColor }]}
                placeholder="Juan"
                placeholderTextColor={Colors.light.gray}
            />

            <ThemedText style={[styles.inputLabel]}>Apellido</ThemedText>
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor, color: inputBorderColor }]}
                placeholder="Torres"
                placeholderTextColor={Colors.light.gray}
            />
            
            <ThemedText style={[styles.inputLabel]}>Email</ThemedText>
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor, color: inputBorderColor }]}
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor={Colors.light.gray}
                keyboardType="email-address"
            />

            <ThemedText style={[styles.inputLabel]}>Contraseña</ThemedText>
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor, color: inputBorderColor}]}
                placeholder="****************"
                placeholderTextColor={Colors.light.gray}
                secureTextEntry={true}
                cursorColor={"#6ABDED"}
            />
            <ThemedButton title="Registrarme" style={styles.btn} />
        </ScrollView>
  )
}

export default register

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
