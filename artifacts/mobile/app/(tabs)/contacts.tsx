import React from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useChatStore } from '@/context/ChatContext';
import { Avatar } from '@/components/Avatar';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

/**
 * Contacts tab placeholder — lists known contacts derived from the
 * mock chat store. Tapping a contact opens (or creates) a chat.
 */
export default function ContactsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chats, getChatByContactId } = useChatStore();
  const isWeb = Platform.OS === 'web';
  const contacts = chats.map((c) => c.contact);

  const openChatFor = (contactId: string) => {
    const chat = getChatByContactId(contactId);
    if (chat) {
      router.push(`/chat/${chat.id}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: isWeb ? 67 : insets.top + 8,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          Contacts
        </Text>
      </View>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        scrollEnabled={contacts.length > 0}
        contentContainerStyle={{
          paddingBottom: (isWeb ? 84 : insets.bottom) + 90,
        }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              { opacity: pressed ? 0.6 : 1, borderColor: colors.border },
            ]}
            onPress={() => openChatFor(item.id)}
          >
            <Avatar
              initials={item.initials}
              color={item.avatarColor}
              online={item.online}
            />
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.foreground }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.about, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                {item.about}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No contacts yet
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
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  about: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
