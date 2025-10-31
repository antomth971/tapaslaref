import axios from 'axios';
import getConfig from "@/constants/config";
import ReturnWithBoolean from '@/type/request/return_with_boolean';

const API_URL=process.env.EXPO_PUBLIC_API_URL as string

    const loginUser = async (email: string, password: string) => {
        try {
            const config = await getConfig();
            const response = await axios.post(`${API_URL}/auth/login`, { email, password }, config);
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    const registerUser = async (email: string, password: string, recaptchaToken?: string): Promise<ReturnWithBoolean> => {
        try {
            const config = await getConfig();
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                recaptchaToken
            }, config);
            return response.data;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    }

    const checkIsLogin = async () => {
        try {
            const config = await getConfig();
            const response = await axios.post(`${API_URL}/auth/checkIsLogin`, { withCredentials: true }, config);
            return response.data;
        } catch (error) {
            console.error("Check login status error:", error);
            throw error;
        }
    }

export { loginUser, registerUser, checkIsLogin };