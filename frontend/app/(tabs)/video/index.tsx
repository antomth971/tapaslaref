import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '@/hooks/providers/LangageProvider';
export default function VideoScreen() {
    const { i18n } = useLanguage();

    return (
        <View style={styles.container}>
            <Text>{i18n.t("welcome")}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});