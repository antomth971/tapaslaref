import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Props from '@/type/feature/video/modal';
import Video from './video';
import { useLanguage } from '@/hooks/providers/LangageProvider';

export default function VideoModal({ visible, onClose, videoId }: Props) {
  const { i18n } = useLanguage();
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
          <Video id={videoId} />
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text>{i18n.t('close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000a', justifyContent: 'center', alignItems: 'center' },
  content: { backgroundColor: 'white', padding: 20, borderRadius: 10, minWidth: 220 },
  button: { marginTop: 20, alignSelf: 'center' },
});
