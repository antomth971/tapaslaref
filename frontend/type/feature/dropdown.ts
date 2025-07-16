import { ViewStyle } from "react-native";


export interface DropdownProps {
    options: DropdownOption[];
    onSelect: (value: string) => void;
    selectedValue: string | null;
    placeholder?: string;
    style?: ViewStyle;
}


export interface DropdownOption {
    label: string;
    value: string;
}