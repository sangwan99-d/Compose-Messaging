import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Profile image placeholder — an initials disc in the contact's assigned
 * color, with an online presence dot. Stands in for a real profile photo
 * until avatar uploads are wired up.
 */
export function Avatar({
  initials,
  color,
  size = 52,
  online,
}: {
  initials: string;
  color: string;
  size?: number;
  online?: boolean;
}) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      >
        <Text style={[styles.initials, { fontSize: size * 0.34 }]}>
          {initials}
        </Text>
      </View>
      {online ? (
        <View
          style={[
            styles.onlineDot,
            {
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              right: -1,
              bottom: -1,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#06140C',
    fontFamily: 'Inter_600SemiBold',
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: '#0B1210',
  },
});
