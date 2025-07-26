import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useCommonStyles } from '@/constants/style';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { useAuth } from '@/hooks/providers/AuthProvider';

export default function HomeScreen() {
  const { i18n } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { styles } = useCommonStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {i18n.t("welcome")}
      </Text>
      <Text style={styles.description}>
        {i18n.t("description")}
      </Text>

      <Text style={styles.subTitle}>
        {i18n.t("what_you_can_do")}
      </Text>

      <View style={styles.actionsContainer}>
        <Text style={styles.actionText}>
          - {i18n.t("create_account")}
        </Text>
        <Text style={styles.actionText}>
          - {i18n.t("search_videos")}
        </Text>
        <Text style={styles.actionText}>
          - {i18n.t("download_content")}
        </Text>
      </View>
      {!isAuthenticated && <>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>

            <Link href="/register">
              <Text style={styles.buttonText}>{i18n.t("register")}</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>

            <Link href="/login">
              <Text style={styles.buttonText}>{i18n.t("login")}</Text>
            </Link>
          </TouchableOpacity>

        </View></>}

      <Text style={styles.footer}>
        {i18n.t("footer")}
      </Text>
    </View>
  );
}