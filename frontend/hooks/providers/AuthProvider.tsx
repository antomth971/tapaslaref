import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import  { loginUser,registerUser, checkIsLogin } from "@/services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LOGIN from "@/type/feature/auth/login";
import RETURN from "@/type/request/return_with_message";
import AUTH_CONTEXT_TYPE from "@/type/feature/auth/auth_context_type";
import { useRouter, usePathname } from "expo-router";

const defaultContextValue: AUTH_CONTEXT_TYPE = {
    isAuthenticated: false,
    login: async (): Promise<RETURN> => {
        await Promise.resolve();
        return { message: "" };
    },
    logout: async (): Promise<RETURN> => {
        await Promise.resolve();
        return { message: "" };
    }
};

const publicRoutes = ["/","/+not-found", "/login", "/register"];
const AUTH_CONTEXT = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathName = usePathname();
    const router = useRouter();
    useEffect(() => {
        const initializeAuthState = async () => {
            try {
                const data = await checkIsLogin();
                if (data.isLoggedIn === true) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    await AsyncStorage.removeItem("token");
                    const isPublic = publicRoutes.some((route) => {
                        return pathName === route;
                      })
                    if (!isPublic) {
                        router.push("/+not-found");
                    }
                }
            } catch (error) {
                setIsAuthenticated(false);
                await AsyncStorage.removeItem("token");
                const isPublic = publicRoutes.some((route) => {
                    return pathName === route || pathName.startsWith("/user/checkMail/");
                })                
                if (!isPublic) {
                    router.push("/+not-found");
                }
            }
        };

        initializeAuthState();
    }, [pathName,router]);

    const login = async (userData: LOGIN): Promise<RETURN> => {

        const data = await loginUser(userData.email, userData.password);
        if (!data.access_token) {
            throw new Error("Login failed: No access token received");
        }
        setIsAuthenticated(true);
        await AsyncStorage.setItem("token", data.access_token);
        return data;
    };

    const logout = async (): Promise<RETURN> => {
        await AsyncStorage.removeItem("token");
        setIsAuthenticated(false);
        return { message: "Logged out successfully" };
    };
    
    return (
        <AUTH_CONTEXT.Provider
            value={{
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AUTH_CONTEXT.Provider>
    );
};



export const useAuth = () => {
    const context = useContext(AUTH_CONTEXT);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
