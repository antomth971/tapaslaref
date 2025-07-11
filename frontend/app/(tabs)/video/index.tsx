import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Dimensions,
    StyleSheet,
    Pressable,
} from 'react-native';
import Video from 'react-native-video';
import { getAllVideos } from '@/services/VideoService';
import video from '@/type/feature/video/video'

const screenWidth = Dimensions.get('window').width;
const spacing = 6;
const numColumns = 3;
const cardSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;

type VideoStatusMap = Record<string, boolean>;

export default function VideoGridScreen() {
    const [mediaList, setMediaList] = useState<video[]>([]);
    const [pausedMap, setPausedMap] = useState<VideoStatusMap>({});

    useEffect(() => {
        (async () => {
            const data: video[] = await getAllVideos();

            setMediaList(data.filter((m) => (m.format === 'mp4' || m.format === 'webm') && m.link));            
            const pausedInitial: VideoStatusMap = {};
            data.forEach((item) => {
                pausedInitial[item.publicId] = true;
            });
            setPausedMap(pausedInitial);
            
        })();
    }, []);

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
});
