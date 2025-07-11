import React, { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, StatusBar, SafeAreaView, StyleSheet, Platform, useWindowDimensions } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/hooks/providers/AuthProvider";
import LanguageSwitcher from "./lang";
import { useLanguage } from "@/hooks/providers/LangageProvider";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = (Platform.OS !== 'web') ? true : width < 768;
    const theme = useColorScheme() || "light";
    const { isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { i18n } = useLanguage();


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
                <SafeAreaView style={[styles.safeArea]}>
                    <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
                    <View style={[styles.navBarContainer]}>
                        {isAuthenticated ?
                            <Link href="/video" style={[styles.brandLink]}>
                                Tapaslaref
                            </Link>
                            :
                            <>
                            <Link href="/" style={[styles.brandLink]}>
                                Tapaslaref
                            </Link>
                            <Link href="/video" style={[styles.brandLink]}>
                                video
                            </Link>
                            </>
                            }
                        <View style={styles.linksRowRight}>
                            <LanguageSwitcher />
                            {!isAuthenticated && !isMobile &&
                                (
                                    <View className="flex items-center justify-center flex-row ">
                                        <View style={styles.auth}>
                                            <TouchableOpacity>
                                                <Link href={"/login"}>{i18n.t("login")}</Link>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Link href={"/register"}>{i18n.t("register")}</Link>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            {/* dropdown right menu */}
                            {isAuthenticated && !isMobile &&
                                (
                                    <View style={styles.dropdownContainer}>
                                        <TouchableOpacity
                                            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                                            style={styles.dropdownButton}>
                                            <View style={styles.imgUser}>
                                                <Text>☰</Text>
                                            </View>
                                        </TouchableOpacity>

                                        {isDropdownOpen && (
                                            <View style={styles.dropdownMenu}>
                                                <TouchableOpacity style={styles.dropdownMenuItem}>
                                                    <Link href={"/video"} style={styles.dropdownMenuItemText}>{i18n.t("home")}</Link>
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
                                    <Text style={[styles.hamburgerIcon]}>
                                        {menuOpen ? "✖" : "☰"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    {menuOpen && isMobile && (
                        <View style={styles.mobileMenu}>
                            {isAuthenticated ?
                                <>
                                    <TouchableOpacity>
                                        <Link href={"/video"} style={[styles.mobileMenuText]}>
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
                                        <Link href={"/login"} style={[styles.mobileMenuText]}>
                                            {i18n.t("login")}
                                        </Link>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Link href={"/register"} style={[styles.mobileMenuText]}>
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

const styles = StyleSheet.create({
    navWrapper: {
        position: "relative",
        zIndex: 9999
    },
    safeArea: {
        width: "100%"
    },
    navBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        margin: 20
    },
    brandLink: {
        fontSize: 18,
        padding: 8,
        fontWeight: "bold"
    },
    linksRowRight: {
        flexDirection: "row",
        gap: 16,
        marginLeft: "auto",
        alignItems: "center"
    },
    navLink: {
        fontSize: 18
    },
    hamburgerWrapper: {
        marginLeft: "auto"
    },
    hamburgerBtn: {
        padding: 8
    },
    hamburgerIcon: {
        fontSize: 24
    },
    mobileMenu: {
        position: "relative",
        left: 0,
        width: "100%",
        backgroundColor: "#F5DEB3",
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2
    },
    mobileMenuText: {
        paddingVertical: 8
    },
    dropdownContainer: {
        position: "relative",
    },
    dropdownButton: {
        cursor: "pointer"
    },
    dropdownButtonText: {
        fontSize: 16,
        color: "#333"
    },
    dropdownMenu: {
        position: "absolute",
        top: 50,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        zIndex: 999
    },
    dropdownMenuItem: {
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    dropdownMenuItemText: {
        fontSize: 16,
        color: "#333"
    },
    imgUser: {
        width: 50,
        height: 50,
        backgroundColor: '#E5E7EB',
        borderRadius: 50,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    auth: {
        flexDirection: 'row',
        gap: 16,
        marginLeft: 20
    },
    crownContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#222",
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
        color: "white",
        fontWeight: "bold",
    },
    plusButton: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        marginLeft: 8,
    },
    shopContainer: {
        backgroundColor: "#222",
        padding: 8,
        borderRadius: 8,
        marginLeft: 12,
        alignItems: "center",
        justifyContent: "center",
    },


});

export default Navbar;
