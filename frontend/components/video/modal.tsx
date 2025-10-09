import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Props from '@/type/feature/video/modal';
import Video from './video';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { useCommonStyles } from '@/constants/style';

export default function VideoModal({ visible, onClose, videoId, title, description, transcription, format }: Props) {
  const { i18n } = useLanguage();
  const { palette } = useCommonStyles();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  console.log(transcription);
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      id={videoId}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <Video id={videoId} />
            {description ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{i18n.t('description_label')}</Text>
                <Text style={styles.description}>{description}</Text>
              </View>
            ) : null}
            {transcription && format === 'video' ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{i18n.t('transcription')}</Text>
                <Text style={styles.transcription}>{transcription}</Text>
              </View>
            ) : null}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>{i18n.t('close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const makeStyles = (palette: ReturnType<typeof useCommonStyles>["palette"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      backgroundColor: palette.card,
      padding: 20,
      borderRadius: 12,
      minWidth: 300,
      maxWidth: '90%',
      maxHeight: '90%',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    section: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: palette.inputBorder,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: palette.secondaryText,
      lineHeight: 20,
    },
    transcription: {
      fontSize: 13,
      color: palette.secondaryText,
      fontStyle: 'italic',
      lineHeight: 19,
    },
    button: {
      marginTop: 20,
      backgroundColor: palette.button,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignSelf: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
