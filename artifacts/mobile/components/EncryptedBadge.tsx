import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';

/**
 * Small shield pill shown in the chat header confirming the
 * conversation is end-to-end encrypted.
 */
export function EncryptedBadge({ compact }: { compact?: boolean }) {
  const colors = useColors();

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Feather name="shield" size={12} color={colors.accent} />
        <Text style={[styles.compactLabel, { color: colors.mutedForeground }]}>
          Encrypted
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: colors.secondary, borderColor: colors.border },
      ]}
    >
      <Feather name="shield" size={13} color={colors.accent} />
      <Text style={[styles.label, { color: colors.accent }]}>Encrypted</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
