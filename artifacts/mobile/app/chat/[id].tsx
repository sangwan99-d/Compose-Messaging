import React, { useEffect } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useChatStore } from '@/context/ChatContext';
import { Avatar } from '@/components/Avatar';
import { EncryptedBadge } from '@/components/EncryptedBadge';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatInput } from '@/components/ChatInput';
import { Message } from '@/types/chat';

/**
 * ChatDetailScreen — full-screen conversation view: header with
 * contact identity + encrypted badge, scrollable message history
 * (inverted list, newest at the bottom without manual scroll logic),
 * and the composer bar.
 */
export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  const { getChat, sendMessage, markChatRead } = useChatStore();
  const chat = getChat(id ?? '');

  // Re-run whenever the message list changes (not just on mount) so
  // messages that arrive while the user is actively viewing this chat
  // — e.g. the simulated reply from sendMessage — are marked read too,
  // instead of only the messages present at initial navigation.
  useEffect(() => {
    if (chat) {
      markChatRead(chat.id);
    }
  }, [chat, markChatRead]);

  if (!chat) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>Chat not found</Text>
      </View>
    );
  }

  const reversedMessages = [...chat.messages].reverse();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
        >
          <Feather name="chevron-left" size={26} color={colors.foreground} />
        </Pressable>
        <Avatar
          initials={chat.contact.initials}
          color={chat.contact.avatarColor}
          size={38}
          online={chat.contact.online}
        />
        <View style={styles.headerInfo}>
          <Text
            style={[styles.contactName, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {chat.contact.name}
          </Text>
          <EncryptedBadge compact />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={isIOS ? insets.top + 62 : 0}
      >
        <FlatList
          data={reversedMessages}
          keyExtractor={(item: Message) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          inverted
          contentContainerStyle={styles.messagesList}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          scrollEnabled={reversedMessages.length > 0}
        />
        <View style={{ paddingBottom: isIOS ? 0 : insets.bottom }}>
          <ChatInput onSend={(text) => sendMessage(chat.id, text)} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 30,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1, gap: 3 },
  contactName: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  messagesList: {
    paddingTop: 14,
    paddingBottom: 6,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
