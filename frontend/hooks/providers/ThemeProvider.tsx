import { Appearance } from "react-native";
import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeContextType from "@/type/feature/settings/context";

const THEME_KEY = "theme";

const defaultContextValue: ThemeContextType = {
    colorScheme: "light",
    setColorScheme: () => { }
};
const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await AsyncStorage.getItem(THEME_KEY);
            if (storedTheme === "light" || storedTheme === "dark") {
                setColorScheme(storedTheme);
            } else {
                const scheme = Appearance.getColorScheme();
                if (scheme === "light" || scheme === "dark") {
                    setColorScheme(scheme);
                }
            }
        };
        loadTheme();
    }, []);

    const handleSetColorScheme = (scheme: "light" | "dark") => {
        setColorScheme(scheme);
        AsyncStorage.setItem(THEME_KEY, scheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                colorScheme,
                setColorScheme: handleSetColorScheme
            }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
