import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import Props from '@/type/feature/video/modal';
import Video from './video';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { useCommonStyles } from '@/constants/style';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function VideoModal({ visible, onClose, videoId, uri, title, description, transcription, format }: Props) {
  const { i18n } = useLanguage();
  const { palette } = useCommonStyles();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    if (!uri) {
      console.error(i18n.t('error'), 'No content to share');
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable && Platform.OS !== 'web') {
        console.error(i18n.t('error'), 'Sharing is not available on this platform');
        return;
      }
      console.log('Sharing content:', { uri, title, format });
      
      if (Platform.OS === 'web') {
        if (navigator.clipboard) {
          console.log('Copying link to clipboard');
          await navigator.clipboard.writeText(uri);
          console.error(i18n.t('success'), 'Link copied to clipboard');
        } else {
          console.error(i18n.t('error'), 'Unable to copy link');
        }        
      } else {
        const fileExtension = format === 'video' ? 'mp4' : 'jpg';
        const fileName = `${title || 'media'}.${fileExtension}`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        const downloadResult = await FileSystem.downloadAsync(uri, fileUri);
        await Sharing.shareAsync(downloadResult.uri);
      }
    } catch (error) {
      console.error('Share error:', error);
      console.error(i18n.t('error'), 'Failed to share content');
    }
  };

  const handleDownload = async () => {
    if (!uri) {
      console.error(i18n.t('error'), 'No content to download');
      return;
    }

    if (Platform.OS === 'web') {
      try {
        setIsDownloading(true);
        const fileExtension = format === 'video' ? 'mp4' : 'jpg';
        const fileName = `${title || 'media'}_${Date.now()}.${fileExtension}`;

        // Fetch the file as a blob
        const response = await fetch(uri);
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;

        // Append to the document, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download error:', error);
        console.error(i18n.t('error'), 'Failed to download content');
      } finally {
        setIsDownloading(false);
      }
      return;
    }

    try {
      setIsDownloading(true);
      const fileExtension = format === 'video' ? 'mp4' : 'jpg';
      const fileName = `${title || 'media'}_${Date.now()}.${fileExtension}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResult = await FileSystem.downloadAsync(uri, fileUri);

      console.error(
        i18n.t('success'),
        `${format === 'video' ? 'Video' : 'Image'} downloaded successfully!`,
        [{ text: 'OK' }]
      );

      console.log('Downloaded to:', downloadResult.uri);
    } catch (error) {
      console.error('Download error:', error);
      console.error(i18n.t('error'), 'Failed to download content');
    } finally {
      setIsDownloading(false);
    }
  };

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

          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Text style={styles.actionButtonIcon}>🔗</Text>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownload}
              style={[styles.actionButton, isDownloading && styles.actionButtonDisabled]}
              disabled={isDownloading}
            >
              <Text style={styles.actionButtonIcon}>
                {isDownloading ? '⏳' : '⬇️'}
              </Text>
              <Text style={styles.actionButtonText}>
                {isDownloading ? 'Downloading...' : 'Download'}
              </Text>
            </TouchableOpacity>
          </View>

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
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: palette.inputBorder,
    },
    actionButton: {
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: palette.inputBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: palette.inputBorder,
      minWidth: 120,
    },
    actionButtonDisabled: {
      opacity: 0.5,
    },
    actionButtonIcon: {
      fontSize: 24,
      marginBottom: 4,
    },
    actionButtonText: {
      fontSize: 12,
      color: palette.text,
      fontWeight: '600',
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
