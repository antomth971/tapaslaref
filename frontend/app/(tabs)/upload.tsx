import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadAssets, formatBytes } from '@/services/VideoService';
import type { PickerAsset } from '@/services/VideoService';


export default function VideoUploadScreen(){
  const [assets, setAssets] = useState<PickerAsset[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0..1

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
      setAssets(res.assets ?? []);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', "Impossible d'ouvrir le sélecteur.");
    }
  };

  const onUpload = async (): Promise<void> => {
    if (!assets.length) {
      Alert.alert('Info', 'Sélectionne au moins un fichier.');
      return;
    }
    setUploading(true);
    setProgress(0);

    try {
      await uploadAssets(assets, setProgress);
      Alert.alert('Succès', 'Upload terminé ✅');
      setAssets([]);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', "L'upload a échoué.");
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
            {item.name || 'Fichier'}
          </Text>
          <Text style={styles.assetMeta}>
            {(item.mimeType ?? 'type inconnu') + ' · ' + formatBytes(item.size)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Upload</Text>

      <Pressable style={styles.button} onPress={pickMedia} disabled={uploading}>
        <Text style={styles.buttonText}>Choisir photos/vidéos</Text>
      </Pressable>

      {!!assets.length && (
        <FlatList
          data={assets}
          keyExtractor={(item, i) => item.uri + i}
          renderItem={renderItem}
          style={{ alignSelf: 'stretch', marginTop: 12 }}
        />
      )}

      {!!assets.length && (
        <Pressable
          style={[styles.button, uploading && styles.buttonDisabled]}
          onPress={onUpload}
          disabled={uploading}
        >
          {uploading ? (
            <View style={styles.rowCenter}>
              <ActivityIndicator />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                Upload… {Math.round(progress * 100)}%
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Uploader</Text>
          )}
        </Pressable>
      )}

      {!!assets.length && (
        <Text style={{ marginTop: 8, color: '#666' }}>
          {assets.length} fichier(s) · {formatBytes(totalSize)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  button: { marginTop: 12, backgroundColor: '#007bff', padding: 12, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  assetRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  assetName: { fontWeight: '500' },
  assetMeta: { fontSize: 12, color: '#666' },
  thumb: { width: 50, height: 50, borderRadius: 4, marginRight: 8 },
  videoBadge: { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  videoText: { fontSize: 18 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
});
