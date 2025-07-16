import { ViewStyle } from "react-native";

interface ListHeaderProps {
  pendingQuery: string;
  setPendingQuery: (value: string) => void;
  setSearchQuery: (value: string) => void;
  filter: 'all' | 'videos' | 'images';
  setFilter: (value: 'all' | 'videos' | 'images') => void;
  style: ViewStyle;
}
export default ListHeaderProps;