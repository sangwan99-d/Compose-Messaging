import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { useColors } from '@/hooks/useColors';
import { Chat, CURRENT_USER_ID } from '@/types/chat';

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Single row in the conversation list — avatar, name, last message
 * snippet, timestamp, and an unread badge when there are unseen
 * messages from the contact.
 */
export function ChatListItem({
  chat,
  unreadCount,
  onPress,
}: {
  chat: Chat;
  unreadCount: number;
  onPress: () => void;
}) {
  const colors = useColors();
  const last = chat.messages[chat.messages.length - 1];
  const isUnread = unreadCount > 0;
  const lastFromMe = last?.senderId === CURRENT_USER_ID;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed ? 0.6 : 1, borderColor: colors.border },
      ]}
      testID={`chat-item-${chat.id}`}
    >
      <Avatar
        initials={chat.contact.initials}
        color={chat.contact.avatarColor}
        online={chat.contact.online}
      />
      <View style={styles.content}>
        <View style={styles.topLine}>
          <Text
            style={[styles.name, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {chat.contact.name}
          </Text>
          <Text
            style={[
              styles.time,
              {
                color: isUnread ? colors.accent : colors.mutedForeground,
                fontFamily: isUnread ? 'Inter_600SemiBold' : 'Inter_400Regular',
              },
            ]}
          >
            {last ? formatTimestamp(last.timestamp) : ''}
          </Text>
        </View>
        <View style={styles.bottomLine}>
          <Text
            style={[
              styles.snippet,
              {
                color: isUnread ? colors.foreground : colors.mutedForeground,
                fontFamily: isUnread ? 'Inter_500Medium' : 'Inter_400Regular',
              },
            ]}
            numberOfLines={1}
          >
            {lastFromMe ? 'You: ' : ''}
            {last?.plaintext ?? 'No messages yet'}
          </Text>
          {isUnread ? (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text
                style={[styles.badgeText, { color: colors.primaryForeground }]}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snippet: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
});
