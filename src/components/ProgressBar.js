import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors, borderRadius } from '../theme/theme';

const ProgressBar = ({ progress, label }) => {
  const { theme } = useContext(AppContext);
  const isDark = theme === 'dark';
  
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[
          styles.label, 
          { color: isDark ? colors.text.dark : colors.text.light }
        ]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.track,
        { backgroundColor: isDark ? colors.border.dark : colors.border.light }
      ]}>
        <View style={[
          styles.fill,
          { width: `${clampedProgress * 100}%` }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  track: {
    height: 8,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.round,
  }
});

export default ProgressBar;
