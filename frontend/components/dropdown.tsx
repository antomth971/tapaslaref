import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Modal, Pressable } from "react-native";
import { DropdownProps } from "@/type/feature/dropdown";

const Dropdown: React.FC<DropdownProps> = ({
    options,
    onSelect,
    selectedValue,
    placeholder = "Select an option",
    style = {},
}) => {
    const [open, setOpen] = useState(false);
    const selected = options.find(opt => opt.value === selectedValue);

    const renderOptions = () => (
        <ScrollView style={styles.dropdownModal} nestedScrollEnabled>
            {options.map(opt => (
                <TouchableOpacity
                    key={opt.value}
                    style={styles.option}
                    onPress={() => {
                        setOpen(false);
                        onSelect(opt.value);
                    }}
                >
                    <Text
                        style={[
                            styles.optionText,
                            selectedValue === opt.value && styles.selectedOptionText,
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {opt.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setOpen(o => !o)}
                activeOpacity={0.7}
            >
                <Text style={styles.selectedText} numberOfLines={1} ellipsizeMode="tail">
                    {selected ? selected.label : placeholder}
                </Text>
                <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
                    <View style={styles.modalContent}>
                        {renderOptions()}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        position: "relative",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ddd",
        minHeight: 44,
    },
    selectedText: {
        fontSize: 16,
        flex: 1,
    },
    arrow: {
        fontSize: 16,
        marginLeft: 10,
    },
    dropdown: {
        position: "absolute",
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        zIndex: 10000,
        marginTop: 2,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        width: "100%",
        maxHeight: 220,
    },
    dropdownModal: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 0,
        minWidth: 220,
        maxHeight: 350,
        alignSelf: "center",
    },
    option: {
        padding: 14,
        width: "100%",
    },
    optionText: {
        fontSize: 16,
    },
    selectedOptionText: {
        fontWeight: "bold",
        color: "#1574e6",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 8,
        minWidth: 220,
        width: "80%",
        maxHeight: 350,
        overflow: "hidden",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
});

export default Dropdown;
