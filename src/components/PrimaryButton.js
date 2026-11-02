import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/theme';

export function PrimaryButton({ title, onPress, loading = false, secondary = false, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (loading || disabled) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.blue : colors.white} />
      ) : (
        <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.blue, borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  secondary: { backgroundColor: colors.blueSoft },
  text: { fontSize: 15, fontWeight: '800', color: colors.white },
  secondaryText: { color: colors.blue },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.83 },
});
