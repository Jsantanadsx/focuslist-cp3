import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

export function Notice({ message, kind = 'error' }) {
  if (!message) return null;
  return (
    <View style={[styles.notice, kind === 'success' && styles.success]} accessibilityRole="alert">
      <Text style={[styles.text, kind === 'success' && styles.successText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { backgroundColor: colors.redSoft, borderRadius: 12, padding: 13, marginBottom: 13 },
  success: { backgroundColor: colors.greenSoft },
  text: { color: colors.red, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  successText: { color: colors.green },
});
