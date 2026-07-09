import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Composer bar pinned to the bottom of the chat screen: attachment
 * (clip) icon, expanding text field, and a mic/send icon that swaps
 * based on whether the user has typed anything.
 */
export function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const colors = useColors();
  const [text, setText] = useState('');
  const hasText = text.trim().length > 0;

  const handleSend = () => {
    if (!hasText) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSend(text);
    setText('');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderTopColor: colors.border },
      ]}
    >
      <Pressable
        style={styles.iconButton}
        testID="attachment-button"
        hitSlop={8}
      >
        <Feather name="paperclip" size={22} color={colors.mutedForeground} />
      </Pressable>

      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.secondary, borderColor: colors.border },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.foreground }]}
          multiline
          testID="message-input"
        />
      </View>

      <Pressable
        onPress={handleSend}
        style={[styles.sendButton, { backgroundColor: colors.primary }]}
        testID="send-button"
        hitSlop={8}
      >
        <Feather
          name={hasText ? 'send' : 'mic'}
          size={18}
          color={colors.primaryForeground}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxHeight: 120,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
});
