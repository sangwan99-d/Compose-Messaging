import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { CURRENT_USER_ID, Message } from '@/types/chat';

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Chat bubble — right-aligned + filled for outgoing (sent) messages,
 * left-aligned + secondary surface for incoming (received) messages.
 * Renders `plaintext` (the "decrypted" view); `encryptedPayload` on the
 * Message model represents what would be stored/transmitted at rest.
 */
export function MessageBubble({ message }: { message: Message }) {
  const colors = useColors();
  const isMine = message.senderId === CURRENT_USER_ID;

  return (
    <View
      style={[
        styles.row,
        { justifyContent: isMine ? 'flex-end' : 'flex-start' },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine
            ? {
                backgroundColor: colors.primary,
                borderTopRightRadius: 4,
              }
            : {
                backgroundColor: colors.secondary,
                borderTopLeftRadius: 4,
              },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: isMine ? colors.primaryForeground : colors.foreground },
          ]}
        >
          {message.plaintext}
        </Text>
        <View style={styles.meta}>
          <Text
            style={[
              styles.time,
              {
                color: isMine
                  ? colors.primaryForeground
                  : colors.mutedForeground,
                opacity: isMine ? 0.75 : 1,
              },
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
          {isMine ? (
            <Feather
              name={message.isRead ? 'check-circle' : 'check'}
              size={12}
              color={colors.primaryForeground}
              style={{ opacity: 0.75 }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 3,
    paddingHorizontal: 12,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  time: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});
