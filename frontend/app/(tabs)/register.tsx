import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { commonStyles } from '@/constants/style';

export default function Register() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleRegister = () => {
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }
    };

    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.header}>Register</Text>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Email</Text>
                <TextInput
                    style={commonStyles.input}  // Utilisation du style commun pour l'input
                    placeholder="Email"
                    placeholderTextColor="#B0B0B0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Password</Text>
                <TextInput
                    style={commonStyles.input}  // Utilisation du style commun pour l'input
                    placeholder="Password"
                    placeholderTextColor="#B0B0B0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
            </View>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Confirm Password</Text>
                <TextInput
                    style={commonStyles.input}  // Utilisation du style commun pour l'input
                    placeholder="Confirm Password"
                    placeholderTextColor="#B0B0B0"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity
                style={commonStyles.button}  // Utilisation du style commun pour le bouton
                onPress={handleRegister}
            >
                <Text style={commonStyles.buttonText}>Register</Text>
            </TouchableOpacity>

            <Link href="/login">
                <Text style={commonStyles.linkText}>Already have an account? Login</Text>
            </Link>
        </View>
    );
}
