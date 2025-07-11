import { commonStyles } from '@/constants/style';
import React from 'react';
import { View, Text } from 'react-native';


const AboutPassword = (checkPassword: {
    length: boolean;
    maj: boolean;
    min: boolean;
    special: boolean;
    same: boolean;
}) => {
    return (
        <View style={commonStyles.inputContainer}>
            <Text style={checkPassword.length ? commonStyles.validText : commonStyles.errorText}>
                At least 10 characters
            </Text>
            <Text style={checkPassword.maj ? commonStyles.validText : commonStyles.errorText}>
                At least one uppercase letter
            </Text>
            <Text style={checkPassword.min ? commonStyles.validText : commonStyles.errorText}>
                At least one lowercase letter
            </Text>
            <Text style={checkPassword.special ? commonStyles.validText : commonStyles.errorText}>
                At least one special character
            </Text>
            <Text style={checkPassword.same ? commonStyles.validText : commonStyles.errorText}>
                Same password
            </Text>
        </View>
    );
};

export default AboutPassword;