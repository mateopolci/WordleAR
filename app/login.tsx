import {StyleSheet, TextInput, useColorScheme, View, Text, Alert} from 'react-native';
import {Link, useRouter} from 'expo-router';
import {useOAuth, useSignIn} from '@clerk/clerk-expo';
import {ScrollView} from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import {Ionicons} from '@expo/vector-icons';
import { useState } from 'react';

enum Strategy {
    Google = 'oauth_google',
    Apple = 'oauth_apple',
    Facebook = 'oauth_facebook',
}

const Login = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { signIn, setActive, isLoaded } = useSignIn();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputBorderColor = colorScheme === 'light' ? Colors.light.text : Colors.dark.text;

    const {startOAuthFlow: googleAuth} = useOAuth({
        strategy: Strategy.Google,
    });
    const {startOAuthFlow: appleAuth} = useOAuth({
        strategy: Strategy.Apple,
    });
    const {startOAuthFlow: facebookAuth} = useOAuth({
        strategy: Strategy.Facebook,
    });

    const onSignInPress = async () => {
        if (!isLoaded) return;
        
        setIsLoading(true);
        try {
            const completeSignIn = await signIn.create({
                identifier: email,
                password,
            });

            await setActive({ session: completeSignIn.createdSessionId });
            router.back();
        } catch (err: any) {
            Alert.alert(
                "Error al iniciar sesión",
                err?.errors?.[0]?.message || "Por favor verifica tus credenciales"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const onSelectAuth = async (strategy: Strategy) => {
        const selectedAuth = {
            [Strategy.Google]: googleAuth,
            [Strategy.Apple]: appleAuth,
            [Strategy.Facebook]: facebookAuth,
        }[strategy];

        try {
            const {createdSessionId, setActive} = await selectedAuth();

            if (createdSessionId) {
                setActive!({session: createdSessionId});
                router.back();
            }
        } catch (err) {
            console.error('OAuth error', err);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <ThemedText style={styles.header}>Inicio de sesión</ThemedText>

            <ThemedText style={[styles.inputLabel]}>Email</ThemedText>
            <TextInput 
                style={[styles.input, {borderColor: inputBorderColor, color: inputBorderColor}]} 
                placeholder="tucorreo@ejemplo.com" 
                placeholderTextColor={Colors.light.gray}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
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
                title={isLoading ? "Cargando..." : "Iniciar sesión"} 
                style={styles.btn} 
                onPress={onSignInPress}
                disabled={isLoading}
            />

            <View style={styles.separatorView}>
                <View style={{ flex: 1 }}></View>
                <Link href={'/register'} asChild>
                    <Text style={{
                        marginTop: 15,
                        color: '#6ABDED',
                        fontSize: 16,
                    }}>
                        No tengo cuenta
                    </Text>
                </Link>
                <View style={{ flex: 1 }}></View>
            </View>

            <View style={styles.separatorView}>
                <View style={{
                    flex: 1,
                    borderBottomColor: inputBorderColor,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}></View>
                <Text style={styles.separator}>o</Text>
                <View style={{
                    flex: 1,
                    borderBottomColor: inputBorderColor,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}></View>
            </View>

            <View style={{gap: 20}}>
                <ThemedButton 
                    title="Continuar con Google" 
                    style={styles.btnOutline} 
                    onPress={() => onSelectAuth(Strategy.Google)}
                >
                    <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
                </ThemedButton>

                <ThemedButton 
                    style={styles.btnOutline} 
                    onPress={() => onSelectAuth(Strategy.Apple)} 
                    title="Continuar con Apple"
                >
                    <Ionicons name="logo-apple" size={24} style={styles.btnIcon} />
                </ThemedButton>

                <ThemedButton 
                    style={styles.btnOutline} 
                    onPress={() => onSelectAuth(Strategy.Facebook)} 
                    title="Continuar con Facebook"
                >
                    <Ionicons name="logo-facebook" size={24} style={styles.btnIcon} />
                </ThemedButton>
            </View>
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
    separatorView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10,
    },
    separator: {
        fontSize: 16,
        color: Colors.light.gray,
    },
    btnOutline: {
        borderWidth: 1,
        height: 50,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    btnIcon: {
        paddingRight: 10,
    },
});