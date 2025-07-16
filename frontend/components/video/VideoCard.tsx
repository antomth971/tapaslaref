import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import Props from '@/type/feature/video/videoCardProps';

export const VideoCard = ({ _id, id, uri, format, cardSize, onPress }: Props) => {
  const isVideo = format === 'video';

  if (!isVideo) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Image
          source={{ uri }}
          style={[styles.video, { width: cardSize, height: cardSize }]}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
    );
  }

  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.pause();
  });

  const handlePlay = () => player.play();
  const handlePause = () => player.pause();

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={Platform.OS !== 'web' ? handlePlay : undefined}
      onPressOut={Platform.OS !== 'web' ? handlePause : undefined}
    >
      <View
        style={[styles.video, { width: cardSize, height: cardSize }]}
        {...(Platform.OS === 'web'
          ? {
            onMouseEnter: handlePlay,
            onMouseLeave: handlePause,
          }
          : {})}
      >
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%' }}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  video: {
    margin: 6,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});
