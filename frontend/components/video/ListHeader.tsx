import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { commonStyles } from '@/constants/style';
import { useLanguage } from '@/hooks/providers/LangageProvider';  
import Dropdown from '../dropdown';
import ListHeaderProps from '@/type/feature/video/ListHeader';

const ListHeader: React.FC<ListHeaderProps> = ({ pendingQuery, setPendingQuery, setSearchQuery, filter, setFilter, style }) => {
  const { i18n } = useLanguage();
  return (
      <View style={[commonStyles.justifyContent, style, { zIndex: 1000, position: 'relative', }]}>
        <TextInput
          placeholder={i18n.t('search_video')}
        placeholderTextColor={'#B0B0B0'}
        value={pendingQuery}
        onChangeText={setPendingQuery}
        style={{ width: 150, height: 45, borderColor: '#B0B0B0', borderWidth: 1, borderRadius: 8 }}
      />
      <TouchableOpacity
        onPress={() => setSearchQuery(pendingQuery)}
        style={commonStyles.button}
      >
        <Text>{i18n.t('submit')}</Text>
      </TouchableOpacity>
      <Dropdown
        options={[
          { label: i18n.t('all'), value: 'all' },
          { label: i18n.t('videos'), value: 'videos' },
          { label: i18n.t('images'), value: 'images' },
        ]}
        onSelect={(value: string) => setFilter(value as 'all' | 'videos' | 'images')}
        selectedValue={filter}
        style={{ width: 100, height: 40, borderColor: '#B0B0B0', borderWidth: 1, borderRadius: 8, zIndex: 1000 }}
      />
    </View>
  );
};

export default ListHeader;