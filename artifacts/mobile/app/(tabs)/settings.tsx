import React from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Avatar } from '@/components/Avatar';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

type Row = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  toggle?: boolean;
};

/**
 * Settings tab — account summary plus grouped preference rows. The
 * "Encryption" section surfaces the app's core trust promise even
 * outside of a chat.
 */
export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);

  const security: Row[] = [
    { icon: 'shield', label: 'End-to-end encryption', value: 'Always on' },
    { icon: 'key', label: 'Encryption keys', value: 'Verified' },
    { icon: 'lock', label: 'App lock', toggle: true },
  ];

  const preferences: Row[] = [
    { icon: 'bell', label: 'Notifications', toggle: true },
    { icon: 'check-circle', label: 'Read receipts', toggle: true },
    { icon: 'moon', label: 'Appearance', value: 'Dark' },
  ];

  const toggleFor: Record<string, [boolean, (v: boolean) => void]> = {
    'App lock': [biometricLock, setBiometricLock],
    Notifications: [notifications, setNotifications],
    'Read receipts': [readReceipts, setReadReceipts],
  };

  const renderRow = (row: Row) => {
    const toggleState = row.toggle ? toggleFor[row.label] : undefined;
    return (
      <View
        key={row.label}
        style={[styles.row, { borderColor: colors.border }]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
          <Feather name={row.icon} size={16} color={colors.accent} />
        </View>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>
          {row.label}
        </Text>
        {toggleState ? (
          <Switch
            value={toggleState[0]}
            onValueChange={toggleState[1]}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor={colors.foreground}
          />
        ) : row.value ? (
          <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>
            {row.value}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: isWeb ? 67 : insets.top + 8,
        paddingBottom: (isWeb ? 84 : insets.bottom) + 90,
      }}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>

      <View style={styles.profileRow}>
        <Avatar initials="ME" color={colors.primary} size={64} online />
        <View style={{ gap: 2 }}>
          <Text style={[styles.profileName, { color: colors.foreground }]}>
            You
          </Text>
          <Text style={[styles.profileStatus, { color: colors.mutedForeground }]}>
            Available
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
        Security
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {security.map(renderRow)}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
        Preferences
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {preferences.map(renderRow)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  profileName: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  profileStatus: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  rowValue: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
