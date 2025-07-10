import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { commonStyles } from '@/constants/style';
export default function HomeScreen() {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>
        Welcome to Tapaslaref!
      </Text>
      <Text style={commonStyles.description}>
        Tapaslaref is your platform to search, share, and download viral content, such as memes, videos, and photos.
      </Text>

      <Text style={commonStyles.subTitle}>
        What you can do:
      </Text>

      <View style={commonStyles.actionsContainer}>
        <Text style={commonStyles.actionText}>
          - Create an account or log in to upload and download content.
        </Text>
        <Text style={commonStyles.actionText}>
          - Search for popular videos and photos using our search feature.
        </Text>
        <Text style={commonStyles.actionText}>
          - If logged in, you can also download photos and videos.
        </Text>
      </View>

      <View style={commonStyles.buttonsContainer}>
        <TouchableOpacity style={commonStyles.button}>

          <Link href="/register">
            <Text style={commonStyles.buttonText}>Sign Up</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button}>

          <Link href="/login">
            <Text style={commonStyles.buttonText}>Log In</Text>
          </Link>
        </TouchableOpacity>

      </View>

      <Text style={commonStyles.footer}>
        Made for sharing memes and more!
      </Text>
    </View>
  );
}