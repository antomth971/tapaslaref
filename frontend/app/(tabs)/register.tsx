import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useCommonStyles } from '@/constants/style';
import AboutPassword from '@/components/aboutPassword';
import { registerUser } from '@/services/AuthService';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Register() {
    const { i18n } = useLanguage();
    const { styles, palette } = useCommonStyles();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

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

        if (!executeRecaptcha) {
            console.error("reCAPTCHA not ready");
            return;
        }

        // Réinitialiser les messages
        setIsRegistered(false);
        setErrorMessage('');

        try {
            // Générer un nouveau token juste avant l'envoi
            const token = await executeRecaptcha('register');

            if (!token) {
                setErrorMessage(i18n.t('registration_recaptcha_failed'));
                return;
            }

            await registerUser(email, password, token);
            setIsRegistered(true);
            setErrorMessage('');
        } catch (error: any) {
            setIsRegistered(false);

            // Gérer les différents types d'erreur
            if (error.response?.status === 409) {
                // Email déjà utilisé
                setErrorMessage(i18n.t('registration_email_already_used'));
            } else if (error.response?.status === 401) {
                // reCAPTCHA échoué
                setErrorMessage(i18n.t('registration_recaptcha_failed'));
            } else {
                // Autre erreur
                setErrorMessage(i18n.t('registration_error'));
            }
            console.error("Registration error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.header, { fontWeight: 'bold', marginBottom: 20 }]}>{i18n.t("register")}</Text>

            {/* Message de succès */}
            {isRegistered && (
                <View style={[localStyles.messageContainer, { backgroundColor: '#d4edda', borderColor: '#c3e6cb' }]}>
                    <Text style={[localStyles.messageText, { color: '#155724' }]}>
                        ✓ {i18n.t("registration_successful")}
                    </Text>
                </View>
            )}

            {/* Message d'erreur */}
            {errorMessage && (
                <View style={[localStyles.messageContainer, { backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }]}>
                    <Text style={[localStyles.messageText, { color: '#721c24' }]}>
                        ✗ {errorMessage}
                    </Text>
                </View>
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

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>{i18n.t("register")}</Text>
            </TouchableOpacity>

            <Link href="/login">
                <Text style={styles.linkText}>{i18n.t("already_have_account")}</Text>
            </Link>
        </View>
    );
}

const localStyles = StyleSheet.create({
    messageContainer: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 16,
        width: '100%',
    },
    messageText: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});
