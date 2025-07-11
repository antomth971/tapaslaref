import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { commonStyles } from '@/constants/style';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/providers/AuthProvider';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);

    const handleLogin = async () => {
        try {
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
        <View style={commonStyles.container}>
            <Text style={commonStyles.header}>Login</Text>
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
            {error && <View style={commonStyles.inputContainer}><Text style={commonStyles.errorText}>Login failed. Please try again.</Text></View>}

            <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
                <Text style={commonStyles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Link href="/register">
                <Text style={commonStyles.linkText}>Don't have an account? Register</Text>
            </Link>
        </View>
    );
}
