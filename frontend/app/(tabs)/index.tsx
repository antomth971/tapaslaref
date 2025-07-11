import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { commonStyles } from '@/constants/style';
import { useLanguage } from '@/hooks/providers/LangageProvider';
export default function HomeScreen() {
  const { i18n } = useLanguage();
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>
        {i18n.t("welcome")}
      </Text>
      <Text style={commonStyles.description}>
        {i18n.t("description")}
      </Text>

      <Text style={commonStyles.subTitle}>
        {i18n.t("what_you_can_do")}
      </Text>

      <View style={commonStyles.actionsContainer}>
        <Text style={commonStyles.actionText}>
          - {i18n.t("create_account")}
        </Text>
        <Text style={commonStyles.actionText}>
          - {i18n.t("search_videos")}
        </Text>
        <Text style={commonStyles.actionText}>
          - {i18n.t("download_content")}
        </Text>
      </View>

      <View style={commonStyles.buttonsContainer}>
        <TouchableOpacity style={commonStyles.button}>

          <Link href="/register">
            <Text style={commonStyles.buttonText}>{i18n.t("register")}</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button}>

          <Link href="/login">
            <Text style={commonStyles.buttonText}>{i18n.t("login")}</Text>
          </Link>
        </TouchableOpacity>

      </View>

      <Text style={commonStyles.footer}>
        {i18n.t("footer")}
      </Text>
    </View>
  );
}