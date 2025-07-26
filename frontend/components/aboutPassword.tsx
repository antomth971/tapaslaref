import React from 'react';
import { View, Text } from 'react-native';
import { useCommonStyles } from '@/constants/style';
import { useLanguage } from '@/hooks/providers/LangageProvider';

const AboutPassword = (checkPassword: {
    length: boolean;
    maj: boolean;
    min: boolean;
    special: boolean;
    same: boolean;
}) => {
    const { i18n } = useLanguage();
    const { styles } = useCommonStyles();

    return (
        <View style={styles.inputContainer}>
            <Text style={checkPassword.length ? styles.validText : styles.errorText}>
                {i18n.t("password_length")}
            </Text>
            <Text style={checkPassword.maj ? styles.validText : styles.errorText}>
                {i18n.t("password_uppercase")}
            </Text>
            <Text style={checkPassword.min ? styles.validText : styles.errorText}>
                {i18n.t("password_lowercase")}
            </Text>
            <Text style={checkPassword.special ? styles.validText : styles.errorText}>
                {i18n.t("password_special")}
            </Text>
            <Text style={checkPassword.same ? styles.validText : styles.errorText}>
                {i18n.t("password_same")}
            </Text>
        </View>
    );
};

export default AboutPassword;
