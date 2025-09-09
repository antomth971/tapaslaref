import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadAssets, formatBytes } from '@/services/VideoService';
import type { PickerAsset } from '@/services/VideoService';
import Video from '@/type/feature/video/video';
import { useCommonStyles } from '@/constants/style';
import { useLanguage } from '@/hooks/providers/LangageProvider';

export default function VideoUploadScreen() {
  const { styles: common, palette } = useCommonStyles();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  const [assets, setAssets] = useState<PickerAsset[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [video, setVideo] = useState<Video | null>(null);
  const { i18n } = useLanguage();
  const totalSize = useMemo(
    () => assets.reduce((acc, a) => acc + (a.size ?? 0), 0),
    [assets]
  );

  const pickMedia = async (): Promise<void> => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'video/*'],
        multiple: true,
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      console.log(res.assets);
      setAssets(res.assets ?? []);
      setVideo({
        id: '',
        title: res.assets[0]?.name || '',
        description: '',
        transcription: '',
        link: '',
        duration: 0,
        publicId: '',
        score: 0,
        format: res.assets[0]?.mimeType?.startsWith('image/') ? 'image' : 'video',
      });
    } catch (e) {
      console.error(e);
      Alert.alert(i18n.t('error'), i18n.t('error_picker_open'));
    }
  };

  const onUpload = async (): Promise<void> => {
    if (!assets.length) {
      Alert.alert(i18n.t('info'), i18n.t('select_at_least_one_file'));
      return;
    }
    setUploading(true);
    setProgress(0);

    try {
      await uploadAssets(assets, setProgress);
      Alert.alert(i18n.t('success'), i18n.t('upload_finished'));
      setAssets([]);
    } catch (e) {
      console.error(e);
      Alert.alert(i18n.t('error'), i18n.t('upload_failed'));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const renderItem = ({ item }: { item: PickerAsset }) => {
    const isImage = (item.mimeType ?? '').startsWith('image/');
    return (
      <View style={styles.assetRow}>
        {isImage ? (
          <Image source={{ uri: item.uri }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, styles.videoBadge]}>
            <Text style={styles.videoText}>🎬</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.assetName}>
            {item.name || i18n.t('file_default_name')}
          </Text>
          <Text style={styles.assetMeta}>
            {(item.mimeType ?? i18n.t('unknown_type')) + ' · ' + formatBytes(item.size)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.headerCard}>
        <Text style={styles.title}>{i18n.t('upload_header_title')}</Text>
        <Text style={styles.subtitle}>
          {i18n.t('upload_header_subtitle')}
        </Text>
        <Pressable style={[common.button, styles.primaryButton]} onPress={pickMedia} disabled={uploading}>
          <Text style={common.buttonText}>{i18n.t('choose_media')}</Text>
        </Pressable>
      </View>

      {!!assets.length && (
        <View style={styles.card}>
          {renderItem({ item: assets[0] })}
          <Text style={styles.helperText}>
            {assets.length} {i18n.t('files_label')} · {formatBytes(totalSize)}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{i18n.t('title')}</Text>
          <TextInput
            value={video?.title}
            onChangeText={(text: string) => setVideo((prev) => (prev ? { ...prev, title: text } : null))}
            style={styles.input}
            placeholder={i18n.t('title_placeholder')}
            placeholderTextColor={palette.inputBorder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{i18n.t('description_label')}</Text>
          <TextInput
            value={video?.description}
            onChangeText={(text: string) => setVideo((prev) => (prev ? { ...prev, description: text } : null))}
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={4}
            placeholder={i18n.t('description_placeholder')}
            placeholderTextColor={palette.inputBorder}
          />
        </View>

        {video?.format === 'video' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('transcription')}</Text>
            <TextInput
              value={video?.transcription}
              onChangeText={(text: string) => setVideo((prev) => (prev ? { ...prev, transcription: text } : null))}
              style={[styles.input, styles.multiline]}
              multiline
              numberOfLines={4}
              placeholder={i18n.t('transcription_placeholder')}
              placeholderTextColor={palette.inputBorder}
            />
          </View>
        )}
      </View>

      {!!assets.length && (
        <Pressable
          style={[common.button, styles.ctaButton, uploading && styles.buttonDisabled]}
          onPress={onUpload}
          disabled={uploading}
        >
          {uploading ? (
            <View style={styles.rowCenter}>
              <ActivityIndicator color={palette.text} />
              <Text style={[common.buttonText, { marginLeft: 8 }]}>
                {i18n.t('upload_progress_prefix')} {Math.round(progress * 100)}%
              </Text>
            </View>
          ) : (
            <Text style={common.buttonText}>{i18n.t('upload_button')}</Text>
          )}
        </Pressable>
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (palette: ReturnType<typeof useCommonStyles>["palette"]) =>
  StyleSheet.create({
    scrollContent: {
      padding: 16,
    },
    headerCard: {
      backgroundColor: palette.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    title: { fontSize: 22, fontWeight: '700', color: palette.text },
    subtitle: { marginTop: 6, color: palette.secondaryText },

    card: {
      backgroundColor: palette.card,
      padding: 14,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },

    primaryButton: {
      marginTop: 12,
    },
    ctaButton: {
      marginTop: 4,
    },
    buttonDisabled: { opacity: 0.6 },

    inputGroup: { marginBottom: 14 },
    label: { color: palette.text, marginBottom: 6, fontWeight: '600' },
    input: {
      borderWidth: 1,
      borderColor: palette.inputBorder,
      borderRadius: 10,
      padding: 12,
      color: palette.text,
      backgroundColor: palette.inputBackground,
    },
    multiline: { minHeight: 96, textAlignVertical: 'top' },

    assetRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
    assetName: { fontWeight: '600', color: palette.text },
    assetMeta: { fontSize: 12, color: palette.secondaryText, marginTop: 2 },
    helperText: { marginTop: 8, color: palette.secondaryText },
    thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 10 },
    videoBadge: { backgroundColor: palette.inputBackground, justifyContent: 'center', alignItems: 'center' },
    videoText: { fontSize: 18, color: palette.text },
    rowCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  });
