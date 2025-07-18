import React, { useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import LanguageSwitcher from '@/components/settings/lang';
import ThemeSwitcher from '@/components/settings/theme';

export default function Settings() {
    const langRef = useRef<View>(null);
    const themeRef = useRef<View>(null);
    const { i18n } = useLanguage();

    const cardRefs: Record<string, React.RefObject<View | null>> = {
        lang: langRef,
        theme: themeRef,
    };

    const scrollViewRef = useRef<ScrollView>(null);

    const cards = [
        { id: 'lang', title: i18n.t('language') },
        { id: 'theme', title: i18n.t('theme') },
    ];

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
        <View style={styles.page}>
            <View style={styles.toc}>
                <Text style={styles.tocTitle}>{i18n.t('summary')}</Text>
                {cards.map(card => (
                    <TouchableOpacity
                        key={card.id}
                        style={styles.tocItem}
                        onPress={() => scrollToCard(card.id)}
                    >
                        <Text style={styles.tocLink}>{card.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.cardsCol}
                ref={scrollViewRef}
                contentContainerStyle={{ paddingBottom: 32 }}
                keyboardShouldPersistTaps="handled"
            >
                <View ref={langRef} style={styles.card}>
                    <Text style={styles.cardTitle}>{i18n.t('language')}</Text>
                    <LanguageSwitcher />
                </View>
                <View ref={themeRef} style={styles.card} id="theme">
                    <Text style={styles.cardTitle}>{i18n.t('theme')}</Text>
                    <ThemeSwitcher />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
    },
    toc: {
        width: '30%',
        backgroundColor: '#fff',
        paddingVertical: 24,
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    tocTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#222'
    },
    tocItem: {
        paddingVertical: 12,
    },
    tocLink: {
        fontSize: 15,
        color: '#4a74fa',
    },
    cardsCol: {
        width: '70%',
        padding: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 18,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        zIndex: 1,
        position: 'relative'
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#222'
    },
    cardContent: {
        fontSize: 15,
        color: '#444'
    }
});
