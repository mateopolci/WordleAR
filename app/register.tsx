import {StyleSheet, TextInput, useColorScheme, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const Register = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { isLoaded, signUp } = useSignUp();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');

    const inputBorderColor = colorScheme === 'light' ? Colors.light.text : Colors.dark.text;

    const onSignUpPress = async () => {
        if (!isLoaded) {
            Alert.alert("Error", "El sistema de autenticación no está listo");
            return;
        }

        setIsLoading(true);
        try {
            if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
                throw new Error('Por favor complete todos los campos');
            }

            if (password.length < 8) {
                throw new Error('La contraseña debe tener al menos 8 caracteres');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Por favor ingrese un email válido');
            }

            console.log('Iniciando proceso de registro con:', {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                emailAddress: email.trim()
            });

            const signUpAttempt = await signUp.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                emailAddress: email.trim(),
                password: password
            });

            console.log('Registro creado exitosamente:', signUpAttempt);

            const prepareResult = await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            console.log('Verificación preparada:', prepareResult);

            setPendingVerification(true);
        } catch (err: any) {
            console.error('Error detallado durante el registro:', JSON.stringify(err, null, 2));
            
            let errorMessage = 'Ha ocurrido un error durante el registro';
            
            if (err?.errors && Array.isArray(err.errors)) {
                const firstError = err.errors[0];
                if (firstError?.longMessage) {
                    errorMessage = firstError.longMessage;
                } else if (firstError?.message) {
                    errorMessage = firstError.message;
                }
            } else if (err?.message) {
                errorMessage = err.message;
            }

            Alert.alert(
                "Error al registrarse",
                errorMessage
            );
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) {
            Alert.alert("Error", "El sistema de autenticación no está listo");
            return;
        }

        if (!code.trim()) {
            Alert.alert("Error", "Por favor ingresa el código de verificación");
            return;
        }

        setIsLoading(true);
        try {
            console.log('Iniciando verificación de código...');
            
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: code.trim(),
            });

            console.log('Resultado de verificación:', completeSignUp);

            if (completeSignUp.status !== "complete") {
                throw new Error("Error al verificar el correo electrónico");
            }

            if (completeSignUp.createdSessionId) {
                router.push("/login");
                Alert.alert(
                    "Registro exitoso",
                    "Tu cuenta ha sido creada correctamente. Por favor inicia sesión."
                );
            } else {
                throw new Error("No se pudo crear la sesión");
            }
        } catch (err: any) {
            console.error('Error detallado durante la verificación:', JSON.stringify(err, null, 2));
            
            let errorMessage = 'Código de verificación inválido';
            
            if (err?.errors && Array.isArray(err.errors)) {
                errorMessage = err.errors[0]?.message || errorMessage;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            Alert.alert(
                "Error en la verificación",
                errorMessage
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <ScrollView style={styles.container}>
                <ThemedText style={styles.header}>Verifica tu correo electrónico</ThemedText>
                <ThemedText style={styles.subText}>
                    Te hemos enviado un código de verificación a {email}
                </ThemedText>

                <ThemedText style={[styles.inputLabel]}>Código de verificación</ThemedText>
                <TextInput
                    style={[styles.input, {borderColor: inputBorderColor, color: inputBorderColor}]}
                    placeholder="Ingresa el código"
                    placeholderTextColor={Colors.light.gray}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                />

                <ThemedButton 
                    title={isLoading ? "Verificando..." : "Verificar email"} 
                    style={styles.btn} 
                    onPress={onVerifyPress}
                    disabled={isLoading}
                />
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <ThemedText style={styles.header}>Crear una cuenta</ThemedText>
            <ThemedText style={styles.subText}>
                Al continuar, aceptas los Términos de Venta, Términos de Servicio y la Política de Privacidad.
            </ThemedText>

            <ThemedText style={[styles.inputLabel]}>Nombre</ThemedText>
            <TextInput 
                style={[styles.input, {borderColor: inputBorderColor, color: inputBorderColor}]} 
                placeholder="Juan" 
                placeholderTextColor={Colors.light.gray}
                value={firstName}
                onChangeText={setFirstName}
            />

            <ThemedText style={[styles.inputLabel]}>Apellido</ThemedText>
            <TextInput 
                style={[styles.input, {borderColor: inputBorderColor, color: inputBorderColor}]} 
                placeholder="Torres" 
                placeholderTextColor={Colors.light.gray}
                value={lastName}
                onChangeText={setLastName}
            />

            <ThemedText style={[styles.inputLabel]}>Email</ThemedText>
            <TextInput
                style={[styles.input, {borderColor: inputBorderColor, color: inputBorderColor}]}
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor={Colors.light.gray}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <ThemedText style={[styles.inputLabel]}>Contraseña</ThemedText>
            <TextInput
                style={[styles.input, {borderColor: inputBorderColor, color: inputBorderColor}]}
                placeholder="****************"
                placeholderTextColor={Colors.light.gray}
                secureTextEntry={true}
                cursorColor={'#6ABDED'}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
            />
            
            <ThemedButton 
                title={isLoading ? "Cargando..." : "Registrarme"} 
                style={styles.btn} 
                onPress={onSignUpPress}
                disabled={isLoading}
            />
        </ScrollView>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 30,
        paddingBottom: 20,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_900Black',
    },
    subText: {
        fontSize: 15,
        color: Colors.light.gray,
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'FrankRuhlLibre_500Medium',
    },
    inputLabel: {
        fontSize: 15,
        paddingBottom: 10,
        fontWeight: 'bold',
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
        alignItems: 'center',
        borderWidth: 1,
        width: 'auto',
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
    },
});