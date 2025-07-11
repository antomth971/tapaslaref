import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { commonStyles } from '@/constants/style';
import AboutPassword from '@/components/aboutPassword';
import { registerUser } from '@/services/AuthService';

export default function Register() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

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
        <View style={commonStyles.container}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Register</Text>
            {isRegistered && (
                <Text style={{ color: 'green', textAlign: 'center', marginBottom: 20 }}>Registration successful! You can now log in.</Text>
            )}
            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Email</Text>
                <TextInput
                    style={commonStyles.input}
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
                    style={commonStyles.input}
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
                    style={commonStyles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#B0B0B0"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
            </View>

            <View style={commonStyles.justifyContent}>
                <AboutPassword {...checkPassword} />
            </View>
            <TouchableOpacity style={commonStyles.button} onPress={handleRegister}>
                <Text style={commonStyles.buttonText}>Register</Text>
            </TouchableOpacity>

            <Link href="/login">
                <Text style={commonStyles.linkText}>Already have an account? Login</Text>
            </Link>
        </View>
    );
}