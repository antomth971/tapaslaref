import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { getAllVideos } from '@/services/VideoService';
import video from '@/type/feature/video/video';

const screenWidth = Dimensions.get('window').width;
const spacing = 6;
const numColumns = 3;
const cardSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;
const PAGE_SIZE = 15;

type VideoStatusMap = Record<string, boolean>;

export default function VideoGridScreen() {
  const [mediaList, setMediaList] = useState<video[]>([]);
  const [pausedMap, setPausedMap] = useState<VideoStatusMap>({});
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
        (m: video) => (m.format === 'mp4' || m.format === 'webm') && m.link
      );

      const newPaused: VideoStatusMap = {};
      filtered.forEach((item: video) => {
        newPaused[item.publicId] = true;
      });

      setMediaList((prev) => [...prev, ...filtered]);
      setPausedMap((prev) => ({ ...prev, ...newPaused }));
      setPage((prev) => prev + 1);
      setTotal(res.total);

      if (mediaList.length + filtered.length >= res.total) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Erreur lors du chargement paginé des vidéos', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (id: string) => {
    setPausedMap((prev) => ({ ...prev, [id]: false }));
  };

  const handlePause = (id: string) => {
    setPausedMap((prev) => ({ ...prev, [id]: true }));
  };

  const renderItem = ({ item }: { item: video }) => (
    <Pressable
      onPressIn={() => handlePlay(item.publicId)}
      onPressOut={() => handlePause(item.publicId)}
      onHoverIn={() => handlePlay(item.publicId)}
      onHoverOut={() => handlePause(item.publicId)}
      style={styles.card}
    >
      <Video
        source={{ uri: item.link }}
        style={styles.video}
        resizeMode="cover"
        muted
        repeat
        paused={pausedMap[item.publicId] ?? true}
      />
    </Pressable>
  );

  return (
    <FlatList
      data={mediaList}
      keyExtractor={(item) => item.publicId}
      renderItem={renderItem}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
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
  card: {
    width: cardSize,
    height: cardSize,
    margin: spacing / 2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loading: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
