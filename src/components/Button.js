import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors, borderRadius, spacing } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({ title, onPress, style, variant = 'primary' }) => {
  const { theme } = useContext(AppContext);
  const isDark = theme === 'dark';

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
        <LinearGradient
          colors={['#4F46E5', '#3B82F6', '#0EA5E9']} // Modern rich blue-indigo gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.primaryText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getBackgroundColor = () => {
    if (variant === 'secondary') return isDark ? '#374151' : '#F3F4F6';
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'secondary') return isDark ? colors.text.dark : colors.text.light;
    return colors.primary;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: getBackgroundColor() },
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.round, // Pill shape is more modern
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  }
});

export default Button;
