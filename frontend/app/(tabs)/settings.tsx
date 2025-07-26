import React, { useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import LanguageSwitcher from '@/components/settings/lang';
import ThemeSwitcher from '@/components/settings/theme';
import { useCommonStyles } from '@/constants/style';
import { useAuth } from '@/hooks/providers/AuthProvider';
export default function Settings() {
    const langRef = useRef<View>(null);
    const themeRef = useRef<View>(null);
    const logoutRef = useRef<View>(null);
    const { i18n } = useLanguage();
    const { palette } = useCommonStyles();
    const { logout, isAuthenticated } = useAuth();

    const cardRefs: Record<string, React.RefObject<View | null>> = {
        lang: langRef,
        theme: themeRef,
        logout: logoutRef,
    };

    const scrollViewRef = useRef<ScrollView>(null);

    const cards = [
        { id: 'lang', title: i18n.t('language') },
        { id: 'theme', title: i18n.t('theme') },
    ];
    if (isAuthenticated) {
        cards.push({ id: 'logout', title: i18n.t('logout') });
    }

    const scrollToCard = (id: string) => {
        const cardRef = cardRefs[id];
        const scrollRef = scrollViewRef.current;
        if (cardRef?.current && scrollRef) {
            cardRef.current.measureLayout(
                scrollRef.getInnerViewNode(),
                (x, y) => {
                    scrollRef.scrollTo({ y, animated: true });
                }
            );
        }
    };

    return (
        <View style={[
            { flex: 1, flexDirection: 'row', backgroundColor: palette.background }
        ]}>
            <View style={[
                {
                    width: '30%',
                    backgroundColor: palette.card,
                    paddingVertical: 24,
                    paddingHorizontal: 12,
                    borderRightWidth: 1,
                    borderRightColor: palette.inputBorder,
                }
            ]}>
                <Text style={[
                    { fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: palette.text }
                ]}>{i18n.t('summary')}</Text>
                {cards.map(card => (
                    <TouchableOpacity
                        key={card.id}
                        style={{ paddingVertical: 12 }}
                        onPress={() => scrollToCard(card.id)}
                    >
                        <Text style={{
                            fontSize: 15,
                            color: palette.link,
                        }}>{card.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={{ width: '70%', padding: 24 }}
                ref={scrollViewRef}
                contentContainerStyle={{ paddingBottom: 32 }}
                keyboardShouldPersistTaps="handled"
            >
                <View ref={langRef} style={[
                    {
                        backgroundColor: palette.card,
                        borderRadius: 10,
                        padding: 16,
                        marginBottom: 18,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.08,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        zIndex: 1,
                        position: 'relative',
                    }
                ]}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginBottom: 8,
                        color: palette.text,
                    }}>{i18n.t('language')}</Text>
                    <LanguageSwitcher />
                </View>
                <View ref={themeRef} style={[
                    {
                        backgroundColor: palette.card,
                        borderRadius: 10,
                        padding: 16,
                        marginBottom: 18,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.08,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        zIndex: 1,
                        position: 'relative',
                    }
                ]}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginBottom: 8,
                        color: palette.text,
                    }}>{i18n.t('theme')}</Text>
                    <ThemeSwitcher />
                </View>
                {isAuthenticated && <View ref={logoutRef} style={[
                    {
                        backgroundColor: palette.card,
                        borderRadius: 10,
                        padding: 16,
                        marginBottom: 18,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.08,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        zIndex: 1,
                        position: 'relative',
                    }
                ]}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginBottom: 8,
                        color: palette.text,
                    }}>{i18n.t('logout')}</Text>
                    <TouchableOpacity onPress={logout}>
                        <Text style={{
                            fontSize: 15,
                            color: palette.link,
                        }}>{i18n.t('logout')}</Text>
                    </TouchableOpacity>
                </View>}
            </ScrollView>
        </View>
    );
}
