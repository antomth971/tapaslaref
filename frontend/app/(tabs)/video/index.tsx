import React, { useEffect, useState } from 'react';
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
  const [, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'videos' | 'images'>('all');
  const router = useRouter();
  const params = useSearchParams();
  const [modalVisible, setModalVisible] = useState(!!params.get('id'));
  const { i18n } = useLanguage();

  const openModal = (id: string) => {
    router.setParams({ id });
    setModalVisible(true);
  };

  const closeModal = () => {
    router.setParams({ id: undefined });
    setModalVisible(false);
  };

  useEffect(() => {
    resetAndLoad();
  }, [filter, searchQuery]);

  const resetAndLoad = () => {
    setMediaList([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1, true);
  };

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
      onPress={() => openModal(item.id)}
    />
  );

  return (
    <>
      <ListHeader
        pendingQuery={pendingQuery}
        setPendingQuery={setPendingQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
        style={styles.header}
      />
      {mediaList.length === 0 &&
        <>
          <Text style={{ textAlign: 'center', marginVertical: 20 }}>
            {i18n.t('no_video_found')}
          </Text>
        </>
      }
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
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="#888" />
            </View>
          ) : null
        }
      />
      {modalVisible && (
        <VideoModal
          visible={modalVisible}
          onClose={closeModal}
          videoId={params.get('id') || ''}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing,
  },
  header: {
    marginBottom: spacing,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing,
  },
  loading: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
