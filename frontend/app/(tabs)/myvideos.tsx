import React, { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { getMyVideos } from '@/services/VideoService';
import video from '@/type/feature/video/video';
import { VideoCard } from '@/components/video/VideoCard';
import { useRouter } from 'expo-router';
import VideoModal from '@/components/video/modal';
import { useSearchParams } from 'expo-router/build/hooks';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { useCommonStyles } from '@/constants/style';

const screenWidth = Dimensions.get('window').width;
const spacing = 6;
const numColumns = 3;
const cardSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;

export default function MyVideosScreen() {
  const [mediaList, setMediaList] = useState<video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const [modalVisible, setModalVisible] = useState(!!params.get('id'));
  const [selectedVideo, setSelectedVideo] = useState<video | null>(null);
  const { i18n } = useLanguage();
  const { palette } = useCommonStyles();
  const styles = useMemo(() => makeStyles(palette), [palette]);

  const openModal = (videoData: video) => {
    router.setParams({ id: videoData.id });
    setSelectedVideo(videoData);
    setModalVisible(true);
  };

  const closeModal = () => {
    router.setParams({ id: undefined });
    setModalVisible(false);
    setSelectedVideo(null);
  };

  useEffect(() => {
    loadMyVideos();
  }, []);

  useEffect(() => {
    const videoIdFromUrl = params.get('id');
    if (videoIdFromUrl && !selectedVideo) {
      const foundVideo = mediaList.find(v => v.id === videoIdFromUrl);
      if (foundVideo) {
        setSelectedVideo(foundVideo);
        setModalVisible(true);
      }
    }
  }, [params, mediaList, selectedVideo]);

  const loadMyVideos = async () => {
    setIsLoading(true);
    try {
      const videos = await getMyVideos();
      const filtered = videos.filter((m: video) => {
        if (!m.link) return false;
        const isVideo = m.format === 'video';
        const isImage = m.format === 'image';
        return isVideo || isImage;
      });
      setMediaList(filtered);
    } catch (err) {
      console.error('Erreur lors du chargement de mes vidéos', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: video }) => (
    <VideoCard
      _id={item.id}
      id={item.publicId}
      uri={item.link}
      format={item.format}
      cardSize={cardSize}
      onPress={() => openModal(item)}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={palette.button} />
        <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{i18n.t('my_videos_title')}</Text>
        <Text style={styles.headerSubtitle}>
          {mediaList.length} {i18n.t('items_count')}
        </Text>
      </View>

      {mediaList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{i18n.t('no_videos_uploaded')}</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={mediaList}
          keyExtractor={(item) => item.publicId}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
        />
      )}

      {modalVisible && selectedVideo && (
        <VideoModal
          visible={modalVisible}
          onClose={closeModal}
          videoId={selectedVideo.id}
          uri={selectedVideo.link}
          title={selectedVideo.title}
          description={selectedVideo.description}
          transcription={selectedVideo.transcription}
          format={selectedVideo.format}
        />
      )}
    </>
  );
}

const makeStyles = (palette: ReturnType<typeof useCommonStyles>["palette"]) =>
  StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.background,
    },
    loadingText: {
      marginTop: 10,
      color: palette.text,
      fontSize: 16,
    },
    header: {
      backgroundColor: palette.card,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: palette.inputBorder,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: palette.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: palette.secondaryText,
    },
    list: {
      padding: spacing,
      backgroundColor: palette.background,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: spacing,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: palette.background,
    },
    emptyText: {
      fontSize: 16,
      color: palette.secondaryText,
      textAlign: 'center',
    },
  });
