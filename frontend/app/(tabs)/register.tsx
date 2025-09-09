import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useCommonStyles } from '@/constants/style';
import AboutPassword from '@/components/aboutPassword';
import { registerUser } from '@/services/AuthService';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Register() {
    const { i18n } = useLanguage();
    const { styles, palette } = useCommonStyles();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [token, setToken] = useState<string>();
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    const onVerify = useCallback((token: string) => {
        setToken(token);
    }, []);
    const checkPassword = useMemo(() => ({
        length: password.length >= 10,
        maj: /[A-Z]/.test(password),
        min: /[a-z]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        same: password === confirmPassword && password.length > 0,
    }), [password, confirmPassword]);

    const handleRegister = async () => {
        if (!Object.values(checkPassword).every(Boolean)) {
            return;
        }
        try {
            setRefreshReCaptcha(r => !r);
            const register = await registerUser(email, password);
            if (register.message) {
                setIsRegistered(true);
            } else {
                setIsRegistered(false);
                console.error("Registration failed:", register.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.header, { fontWeight: 'bold', marginBottom: 20 }]}>{i18n.t("register")}</Text>
            {isRegistered && (
                <Text style={[styles.validText, { textAlign: 'center', marginBottom: 20 }]}>
                    {i18n.t("registration_successful")}
                </Text>
            )}
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
                <Text style={styles.label}>{i18n.t("confirm_password")}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t("confirm_password")}
                    placeholderTextColor={palette.inputBorder}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.justifyContent}>
                <AboutPassword {...checkPassword} />
            </View>
            <View style={styles.inputContainer}>
                <GoogleReCaptcha
                    onVerify={onVerify}
                    refreshReCaptcha={refreshReCaptcha}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>{i18n.t("register")}</Text>
            </TouchableOpacity>

            <Link href="/login">
                <Text style={styles.linkText}>{i18n.t("already_have_account")}</Text>
            </Link>
        </View>
    );
}
