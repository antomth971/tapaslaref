import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/providers/ThemeProvider';
import { useMemo } from 'react';

export function useCommonStyles() {
  const { colorScheme } = useTheme();

  const palette = colorScheme === 'dark'
    ? {
        background: '#181818',
        card: '#232323',
        text: '#fff',
        secondaryText: '#888',
        inputBackground: '#222',
        inputBorder: '#444',
        button: '#C59B5F',
        link: '#C59B5F',
        valid: 'green',
        error: 'red',
        subtitle: '#ddd',
      }
    : {
        background: '#f9f9f9',
        card: '#fff',
        text: '#181818',
        secondaryText: '#888',
        inputBackground: '#fff',
        inputBorder: '#B0B0B0',
        button: '#C59B5F',
        link: '#C59B5F',
        valid: 'green',
        error: 'red',
        subtitle: '#555',
      };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: palette.background,
    } as ViewStyle,

    header: {
      fontSize: 24,
      color: palette.text,
      textAlign: 'center',
      marginBottom: 20,
    } as TextStyle,

    label: {
      color: palette.text,
      fontSize: 16,
      marginBottom: 8,
    } as TextStyle,

    input: {
      height: 50,
      borderColor: palette.inputBorder,
      borderWidth: 1,
      borderRadius: 8,
      paddingLeft: 16,
      color: palette.text,
      backgroundColor: palette.inputBackground,
    } as TextStyle,

    button: {
      backgroundColor: palette.button,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    } as ViewStyle,

    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingHorizontal: 20,
    } as TextStyle,

    linkText: {
      color: palette.link,
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
    } as TextStyle,

    footer: {
      marginTop: 50,
      textAlign: 'center',
      fontSize: 12,
      color: palette.secondaryText,
    } as TextStyle,

    actionText: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 10,
      color: palette.text,
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
      color: palette.subtitle,
    } as TextStyle,

    actionsContainer: {
      marginTop: 20,
      paddingHorizontal: 10,
    } as ViewStyle,

    title: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold',
      color: palette.text,
    },

    description: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 10,
      color: palette.subtitle,
    },

    validText: {
      color: palette.valid,
      fontSize: 14,
      marginBottom: 4,
    },

    errorText: {
      color: palette.error,
      fontSize: 14,
      marginBottom: 4,
    },

    justifyContent: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },

    flex: {
      display: 'flex',
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  }), [palette]);

  return { styles, palette };
}
