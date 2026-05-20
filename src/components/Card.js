import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors, borderRadius, spacing, shadows } from '../theme/theme';

const Card = ({ children, style }) => {
  const { theme } = useContext(AppContext);
  const isDark = theme === 'dark';

  return (
    <View style={[
      styles.card,
      isDark ? styles.cardDark : styles.cardLight,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginVertical: spacing.s,
  },
  cardLight: {
    backgroundColor: colors.card.light,
    ...shadows.light,
  },
  cardDark: {
    backgroundColor: colors.card.dark,
    ...shadows.dark,
  }
});

export default Card;
