interface ThemeContextType {
    colorScheme: "light" | "dark";
    setColorScheme: (scheme: "light" | "dark") => void;
}
export default ThemeContextType;