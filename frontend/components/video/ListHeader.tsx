import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useCommonStyles } from '@/constants/style';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import Dropdown from '../dropdown';
import ListHeaderProps from '@/type/feature/video/ListHeader';

const ListHeader: React.FC<ListHeaderProps> = ({
  pendingQuery, setPendingQuery, setSearchQuery, filter, setFilter, style
}) => {
  const {styles} = useCommonStyles();
  const { i18n } = useLanguage();

  return (
    <View style={[styles.justifyContent, style, { zIndex: 1000, position: 'relative' }]}>
      <TextInput
        placeholder={i18n.t('search_video')}
        placeholderTextColor={styles.input.borderColor}
        value={pendingQuery}
        onChangeText={setPendingQuery}
        style={[styles.input, { width: 150 }]}
      />
      <TouchableOpacity
        onPress={() => setSearchQuery(pendingQuery)}
        style={[styles.button, { minWidth: 60, marginLeft: 10 }]}
      >
        <Text style={styles.buttonText}>{i18n.t('submit')}</Text>
      </TouchableOpacity>
      <Dropdown
        options={[
          { label: i18n.t('all'), value: 'all' },
          { label: i18n.t('videos'), value: 'videos' },
          { label: i18n.t('images'), value: 'images' },
        ]}
        onSelect={v => setFilter(v as 'all' | 'videos' | 'images')}
        selectedValue={filter}
        style={{ width: 100, height: 40, marginLeft: 10 }}
      />
    </View>
  );
};

export default ListHeader;
