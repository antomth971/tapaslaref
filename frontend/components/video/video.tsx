import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { getVideoById } from '@/services/VideoService';
import Video from '@/type/feature/video/video';
import { useLanguage } from '@/hooks/providers/LangageProvider';
const fallbackUrl = '';

const VideoComponent = ({ id }: { id: string }) => {
    const [videoData, setVideoData] = useState<Video | null>(null);
    const { i18n } = useLanguage();
    useEffect(() => {
        const fetchVideo = async () => {
            const data = await getVideoById(id);
            setVideoData(data);
        };
        fetchVideo();
    }, [id]);

    const videoLink = videoData?.format === 'video' ? videoData.link : fallbackUrl;
    const player = useVideoPlayer(videoLink, (p) => {
        p.loop = true;
        p.muted = true;
        p.play();
    });

    if (!videoData) {
        return (
            <View>
                <ActivityIndicator size="large" />
                <Text>{i18n.t("video_chargement")}...</Text>
            </View>
        );
    }

    if (videoData.format !== 'video') {
        return (
            <View>
                <Image
                    source={{ uri: videoData.link }}
                    style={styles.video}
                    resizeMode="cover"
                />
            </View>
        );
    }

    return (
        <View>
            <VideoView
                player={player}
                style={{ width: '100%', height: 200 }}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
            />
        </View>
    );
};

export default VideoComponent;

const styles = StyleSheet.create({
    video: {
        width: '100%',
        height: 200,
        backgroundColor: '#000',
    },
});
