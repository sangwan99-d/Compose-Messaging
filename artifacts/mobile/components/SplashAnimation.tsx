import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';

/**
 * Animated intro splash shown once on cold start, after fonts are
 * ready but before the tab navigator mounts. The logo scales in with
 * a soft overshoot, a shield-ring pulses outward once, then the whole
 * mark fades as we hand off to the main app — evoking the "unlocking"
 * moment of an encrypted handshake completing.
 *
 * `onFinished` fires after a fixed ~2200ms sequence, mirroring the
 * Lottie-finish-or-timeout pattern from a native implementation.
 */
export function SplashAnimation({
  onFinished,
}: {
  onFinished: () => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 260 });
    scale.value = withSequence(
      withTiming(1.08, { duration: 420, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 180, easing: Easing.inOut(Easing.quad) }),
    );
    ringOpacity.value = withDelay(
      380,
      withSequence(
        withTiming(0.55, { duration: 220 }),
        withTiming(0, { duration: 520 }),
      ),
    );
    ringScale.value = withDelay(
      380,
      withTiming(1.9, { duration: 740, easing: Easing.out(Easing.quad) }),
    );
    containerOpacity.value = withDelay(
      1650,
      withTiming(0, { duration: 400 }, () => {
        // withTiming callbacks run on the UI thread; hop back to JS.
      }),
    );

    const timeout = setTimeout(onFinished, 2200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        containerStyle,
      ]}
      testID="splash-animation"
    >
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.ring,
            { borderColor: colors.accent },
            ringStyle,
          ]}
        />
        <Animated.View style={logoStyle}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
          />
        </Animated.View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          SecureChat
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          End-to-end encrypted
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  center: {
    alignItems: 'center',
    gap: 12,
  },
  ring: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 96,
    height: 96,
    marginLeft: -48,
    marginTop: -72,
    borderRadius: 48,
    borderWidth: 2,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});
