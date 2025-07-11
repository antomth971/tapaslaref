import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
    } as ViewStyle,

    header: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    } as TextStyle,

    label: {
        color: 'white',
        fontSize: 16,
        marginBottom: 8,
    } as TextStyle,

    input: {
        height: 50,
        borderColor: '#B0B0B0',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 16,
        color: 'white',
        backgroundColor: '#333',
    } as TextStyle,

    button: {
        backgroundColor: '#C59B5F',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    } as ViewStyle,

    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 20,
    } as TextStyle,

    linkText: {
        color: '#C59B5F',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    } as TextStyle,

    footer: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 12,
        color: '#888',
    } as TextStyle,

    actionText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    } as TextStyle,

    buttonsContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    } as ViewStyle,

    inputContainer: {
        marginBottom: 20,
    } as ViewStyle,

    subTitle: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold',
    } as TextStyle,

    actionsContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    } as ViewStyle,
    title: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        color: '#555',
    },
    validText: {
        color: 'green',
        fontSize: 14,
        marginBottom: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 4,
    },
    justifyContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export { commonStyles };
