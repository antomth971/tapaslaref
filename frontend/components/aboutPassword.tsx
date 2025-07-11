import { commonStyles } from '@/constants/style';
import React from 'react';
import { View, Text } from 'react-native';
import { useLanguage } from '@/hooks/providers/LangageProvider';

const AboutPassword = (checkPassword: {
    length: boolean;
    maj: boolean;
    min: boolean;
    special: boolean;
    same: boolean;
}) => {
    const { i18n } = useLanguage();
    return (
        <View style={commonStyles.inputContainer}>
            <Text style={checkPassword.length ? commonStyles.validText : commonStyles.errorText}>
                {i18n.t("password_length")}
            </Text>
            <Text style={checkPassword.maj ? commonStyles.validText : commonStyles.errorText}>
                {i18n.t("password_uppercase")}
            </Text>
            <Text style={checkPassword.min ? commonStyles.validText : commonStyles.errorText}>
                {i18n.t("password_lowercase")}
            </Text>
            <Text style={checkPassword.special ? commonStyles.validText : commonStyles.errorText}>
                {i18n.t("password_special")}
            </Text>
            <Text style={checkPassword.same ? commonStyles.validText : commonStyles.errorText}>
                {i18n.t("password_same")}
            </Text>
        </View>
    );
};

export default AboutPassword;