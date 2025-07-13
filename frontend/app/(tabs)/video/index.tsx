import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { getAllVideos } from '@/services/VideoService';
import video from '@/type/feature/video/video';
import { VideoCard } from '@/components/video/VideoCard';

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

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await getAllVideos(page, PAGE_SIZE);
      const filtered = res.data.filter(
        (m: video) =>
          m.link && ['mp4', 'webm', 'jpg', 'jpeg', 'png'].includes(m.format)
      );

      setMediaList((prev) => [...prev, ...filtered]);
      setPage((prev) => prev + 1);
      setTotal(res.total);

      if (mediaList.length + filtered.length >= res.total) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des vidéos', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: video }) => (
    <VideoCard id={item.publicId} uri={item.link} format={item.format} cardSize={cardSize} />
  );

  return (
    <FlatList
      data={mediaList}
      keyExtractor={(item) => item.publicId}
      renderItem={renderItem}
      numColumns={numColumns}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      onEndReached={loadVideos}
      onEndReachedThreshold={0.7}
      ListFooterComponent={
        isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#888" />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing,
  },
  row: {
    justifyContent: 'space-between',
  },
  loading: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
