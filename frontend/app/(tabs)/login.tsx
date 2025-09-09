import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useCommonStyles } from '@/constants/style';
import { useAuth } from '@/hooks/providers/AuthProvider';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Login() {
    const { i18n } = useLanguage();
    const { styles, palette } = useCommonStyles();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);
    const [token, setToken] = useState<string>();
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    const onVerify = useCallback((token: string) => {
        setToken(token);
    }, []);

    const handleLogin = async () => {
        try {
            setRefreshReCaptcha(r => !r);
            const user = await login({ email, password });
            if (!user) {
                setError(true);
                return;
            }
            setError(false);
            router.push('/video');
        } catch (error) {
            setError(true);
            console.error("Login failed:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{i18n.t("login")}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>{i18n.t("email")}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t("email")}
                    placeholderTextColor={palette.inputBorder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>{i18n.t("password")}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t("password")}
                    placeholderTextColor={palette.inputBorder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <GoogleReCaptcha
                    onVerify={onVerify}
                    refreshReCaptcha={refreshReCaptcha}
                />
            </View>
            {error && (
                <View style={styles.inputContainer}>
                    <Text style={styles.errorText}>{i18n.t("login_failed")}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>{i18n.t("login")}</Text>
            </TouchableOpacity>
            <Link href="/register">
                <Text style={styles.linkText}>{i18n.t("already_have_account")}</Text>
            </Link>
        </View>
    );
}
