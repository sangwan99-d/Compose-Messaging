import React, { useCallback } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useChatStore, chatUnreadCount } from '@/context/ChatContext';
import { ChatListItem } from '@/components/ChatListItem';
import { EncryptedBadge } from '@/components/EncryptedBadge';
import { Chat } from '@/types/chat';

/**
 * ChatListScreen — the list of active conversations. Sorted with
 * pinned chats first, then by most recent activity.
 */
export default function ChatsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chats } = useChatStore();
  const isWeb = Platform.OS === 'web';

  const sorted = [...chats].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    const aLast = a.messages[a.messages.length - 1]?.timestamp ?? 0;
    const bLast = b.messages[b.messages.length - 1]?.timestamp ?? 0;
    return bLast - aLast;
  });

  const renderItem = useCallback(
    ({ item }: { item: Chat }) => (
      <ChatListItem
        chat={item}
        unreadCount={chatUnreadCount(item)}
        onPress={() => router.push(`/chat/${item.id}`)}
      />
    ),
    [],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: isWeb ? 67 : insets.top + 8,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Chats</Text>
        <EncryptedBadge compact />
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: (isWeb ? 84 : insets.bottom) + 90,
        }}
        scrollEnabled={sorted.length > 0}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No conversations yet
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
