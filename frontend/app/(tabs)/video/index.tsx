import React, { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { getAllVideos } from '@/services/VideoService';
import video from '@/type/feature/video/video';
import { VideoCard } from '@/components/video/VideoCard';
import ListHeader from '@/components/video/ListHeader';
import { useRouter } from 'expo-router';
import VideoModal from '@/components/video/modal';
import { useSearchParams } from 'expo-router/build/hooks';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { useCommonStyles } from '@/constants/style';

const screenWidth = Dimensions.get('window').width;
const spacing = 6;
const numColumns = 3;
const cardSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;
const PAGE_SIZE = 15;

export default function VideoGridScreen() {
  const [mediaList, setMediaList] = useState<video[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'videos' | 'images'>('all');
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
    const resetAndLoad = () => {
    setMediaList([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1, true);
  };

  useEffect(() => {
    resetAndLoad();
  }, [filter, searchQuery]);

  useEffect(() => {
    const videoIdFromUrl = params.get('id');
    if (videoIdFromUrl && !selectedVideo) {
      // Chercher la vidéo dans la liste déjà chargée
      const foundVideo = mediaList.find(v => v.id === videoIdFromUrl);
      if (foundVideo) {
        setSelectedVideo(foundVideo);
        setModalVisible(true);
      }
    }
  }, [params, mediaList, selectedVideo, resetAndLoad]);

  const fetchPage = async (pageToFetch: number, overwrite = false) => {
    if (isLoading || (!hasMore && !overwrite)) return;
    setIsLoading(true);
    try {
      const res = await getAllVideos(pageToFetch, PAGE_SIZE);
      const filtered = res.data.filter((m: video) => {
        if (!m.link) return false;
        const isVideo = m.format === 'video';
        const isImage = m.format === 'image';
        if (filter === 'videos' && !isVideo) return false;
        if (filter === 'images' && !isImage) return false;
        if (filter === 'all' && !(isVideo || isImage)) return false;
        if (searchQuery && !m.link.toLowerCase().includes(searchQuery.toLowerCase()))
          return false;
        return true;
      });

      const newList = overwrite ? filtered : [...mediaList, ...filtered];
      setMediaList(newList);
      setTotal(res.total);

      setHasMore(newList.length < res.total);
      setPage(overwrite ? 2 : page + 1);
    } catch (err) {
      console.error('Erreur lors du chargement des vidéos', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onEndReached = () => {
    if (hasMore && !isLoading) {
      fetchPage(page, false);
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

  return (
    <View style={styles.container}>
      {/* Header avec titre et compteur */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>{i18n.t('discover_videos')}</Text>
        <Text style={styles.pageSubtitle}>
          {total > 0 ? `${total} ${i18n.t('items_available')}` : i18n.t('explore_content')}
        </Text>
      </View>

      {/* Barre de recherche et filtres */}
      <ListHeader
        pendingQuery={pendingQuery}
        setPendingQuery={setPendingQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
        style={styles.searchSection}
      />

      {/* Liste ou état vide */}
      {!isLoading && mediaList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={styles.emptyTitle}>{i18n.t('no_video_found')}</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery || filter !== 'all'
              ? i18n.t('try_different_filters')
              : i18n.t('no_content_available')}
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={mediaList}
          keyExtractor={(item) => item.publicId}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.7}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color={palette.button} />
                <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Modal vidéo */}
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
    </View>
  );
}

const makeStyles = (palette: ReturnType<typeof useCommonStyles>["palette"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    pageHeader: {
      backgroundColor: palette.card,
      paddingTop: 20,
      paddingBottom: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: palette.inputBorder,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: palette.text,
      marginBottom: 4,
    },
    pageSubtitle: {
      fontSize: 14,
      color: palette.secondaryText,
      marginTop: 4,
    },
    searchSection: {
      backgroundColor: palette.card,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: palette.inputBorder,
    },
    list: {
      padding: spacing,
      backgroundColor: palette.background,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: spacing,
    },
    loadingFooter: {
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 8,
      color: palette.secondaryText,
      fontSize: 14,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      backgroundColor: palette.background,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: palette.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: palette.secondaryText,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
