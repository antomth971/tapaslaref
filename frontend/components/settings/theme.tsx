import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/providers/ThemeProvider';
import Dropdown from '../dropdown';
import { useLanguage } from '@/hooks/providers/LangageProvider';

const ThemeSwitcher = () => {
    const { colorScheme, setColorScheme } = useTheme();
    const { i18n } = useLanguage();
    return (
            <Dropdown
                options={[
                    { label: i18n.t('light'), value: "light" },
                    { label: i18n.t('dark'), value: "dark" },
                ]}
                selectedValue={colorScheme}
                onSelect={(value) => setColorScheme(value as "light" | "dark")}
                placeholder="Select Theme"
                style={styles.picker}
            />
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
    },
    picker: {
        width: 160,
        height: 40,
        color: '#333',
    },
});

export default ThemeSwitcher;