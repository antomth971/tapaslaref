import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView, StyleSheet, Platform, useWindowDimensions } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/hooks/providers/AuthProvider";
import { useLanguage } from "@/hooks/providers/LangageProvider";
import { useTheme } from "@/hooks/providers/ThemeProvider";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = (Platform.OS !== 'web') ? true : width < 768;
    const { isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { i18n } = useLanguage();
    const { colorScheme } = useTheme();
    const styles = useNavStyles(colorScheme);

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response.message) {
                setIsDropdownOpen(false);
                router.push("/login");
            } else {
                console.error("Logout failed:", response.message);
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <View style={styles.navWrapper}>
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />
                    <View style={styles.navBarContainer}>
                        <Link href="/" style={styles.brandLink}>
                            Tapaslaref
                        </Link>
                        <Link href="/video" style={styles.brandLink}>
                            video
                        </Link>

                        <View style={styles.linksRowRight}>
                            {!isAuthenticated && !isMobile &&
                                (
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View style={styles.auth}>
                                            <TouchableOpacity>
                                                <Link href={"/login"} style={styles.navLink}>{i18n.t("login")}</Link>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Link href={"/register"} style={styles.navLink}>{i18n.t("register")}</Link>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Link href={"/settings"} style={styles.navLink}>
                                                    {i18n.t("settings")}
                                                </Link>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            {/* Dropdown right menu */}
                            {isAuthenticated && !isMobile &&
                                (
                                    <View style={styles.dropdownContainer}>
                                        <TouchableOpacity
                                            onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                                            <View style={styles.imgUser}>
                                                <Text style={{ color: styles.dropdownMenuItemText.color, fontSize: 28 }}>☰</Text>
                                            </View>
                                        </TouchableOpacity>

                                        {isDropdownOpen && (
                                            <View style={styles.dropdownMenu}>
                                                <TouchableOpacity style={styles.dropdownMenuItem}>
                                                    <Link href={"/"} style={styles.dropdownMenuItemText}>{i18n.t("home")}</Link>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.dropdownMenuItem}>
                                                    <Link href={"/settings"} style={styles.dropdownMenuItemText}>
                                                        {i18n.t("settings")}
                                                    </Link>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={handleLogout} style={styles.dropdownMenuItem}>
                                                    <Text style={styles.dropdownMenuItemText}>{i18n.t("logout")}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                )
                            }
                        </View>

                        {isMobile && (
                            <View style={styles.hamburgerWrapper}>
                                <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.hamburgerBtn}>
                                    <Text style={styles.hamburgerIcon}>
                                        {menuOpen ? "✖" : "☰"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Mobile Menu */}
                    {menuOpen && isMobile && (
                        <View style={styles.mobileMenu}>
                            {isAuthenticated ?
                                <>
                                    <TouchableOpacity>
                                        <Link href={"/video"} style={styles.mobileMenuText}>
                                            {i18n.t("home")}
                                        </Link>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleLogout}>
                                        <Text style={styles.mobileMenuText}>{i18n.t("logout")}</Text>
                                    </TouchableOpacity>
                                </>
                                :
                                <>
                                    <TouchableOpacity>
                                        <Link href={"/login"} style={styles.mobileMenuText}>
                                            {i18n.t("login")}
                                        </Link>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Link href={"/register"} style={styles.mobileMenuText}>
                                            {i18n.t("register")}
                                        </Link>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    )}
                </SafeAreaView>
            </View>
        </>
    );
}
const useNavStyles = (colorScheme: string) => {
    const palette = colorScheme === 'dark'
        ? {
            bg: '#222',
            fg: '#fff',
            link: '#FFD700',
            dropdownBg: '#232323',
            dropdownBorder: '#555',
            shadow: '#000',
            inputBg: '#181818',
            card: '#232323',
            accent: '#C59B5F',
            menuBg: '#2a2a2a',
            userBg: '#444',
            menuText: '#fff',
            button: '#C59B5F',
        }
        : {
            bg: '#fff',
            fg: '#181818',
            link: '#C59B5F',
            dropdownBg: '#fff',
            dropdownBorder: '#ccc',
            shadow: '#000',
            inputBg: '#F5DEB3',
            card: '#fff',
            accent: '#C59B5F',
            menuBg: '#F5DEB3',
            userBg: '#E5E7EB',
            menuText: '#181818',
            button: '#C59B5F',
        };

    return useMemo(() => StyleSheet.create({
        navWrapper: {
            position: "relative",
            zIndex: 9999,
            backgroundColor: palette.bg,
        },
        safeArea: {
            width: "100%",
            backgroundColor: palette.bg,
        },
        navBarContainer: {
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
            backgroundColor: palette.bg,
        },
        brandLink: {
            fontSize: 18,
            padding: 8,
            fontWeight: "bold",
            color: palette.fg,
        },
        linksRowRight: {
            flexDirection: "row",
            gap: 16,
            marginLeft: "auto",
            alignItems: "center",
        },
        navLink: {
            fontSize: 18,
            color: palette.link,
        },
        hamburgerWrapper: {
            marginLeft: "auto",
        },
        hamburgerBtn: {
            padding: 8,
        },
        hamburgerIcon: {
            fontSize: 24,
            color: palette.fg,
        },
        mobileMenu: {
            position: "relative",
            left: 0,
            width: "100%",
            backgroundColor: palette.menuBg,
            padding: 16,
            shadowColor: palette.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
        },
        mobileMenuText: {
            paddingVertical: 8,
            color: palette.menuText,
            fontSize: 18,
            fontWeight: "bold",
        },
        dropdownContainer: {
            position: "relative",
        },
        dropdownButtonText: {
            fontSize: 16,
            color: palette.fg,
        },
        dropdownMenu: {
            position: "absolute",
            top: 50,
            right: 0,
            backgroundColor: palette.dropdownBg,
            borderWidth: 1,
            borderColor: palette.dropdownBorder,
            borderRadius: 4,
            zIndex: 999,
        },
        dropdownMenuItem: {
            paddingVertical: 8,
            paddingHorizontal: 12,
        },
        dropdownMenuItemText: {
            fontSize: 16,
            color: palette.fg,
        },
        imgUser: {
            width: 50,
            height: 50,
            backgroundColor: palette.userBg,
            borderRadius: 50,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
        },
        auth: {
            flexDirection: 'row',
            gap: 16,
            marginLeft: 20,
        },
        crownContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: palette.bg,
            padding: 6,
            borderRadius: 8,
        },
        crownIcon: {
            width: 24,
            height: 24,
            marginRight: 6,
        },
        crownText: {
            fontSize: 16,
            color: palette.fg,
            fontWeight: "bold",
        },
        plusButton: {
            color: palette.fg,
            fontWeight: "bold",
            fontSize: 20,
            marginLeft: 8,
        },
        shopContainer: {
            backgroundColor: palette.bg,
            padding: 8,
            borderRadius: 8,
            marginLeft: 12,
            alignItems: "center",
            justifyContent: "center",
        },
    }), [palette]);
};
export default Navbar;
