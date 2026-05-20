import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors, spacing, borderRadius } from '../theme/theme';
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

const OnboardingScreen = () => {
  const { theme, saveProfile } = useContext(AppContext);
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [companyType, setCompanyType] = useState('Product');
  const [hours, setHours] = useState('');
  
  const [focusedInput, setFocusedInput] = useState(null);

  const companyOptions = ['Mass Recruiter', 'Product', 'Startup'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const handleSave = () => {
    if (!name || !hours) return;
    saveProfile({
      name,
      year,
      companyType,
      studyHours: parseInt(hours) || 2,
    });
  };

  const getBorderColor = (inputName) => {
    if (focusedInput === inputName) return '#3B82F6';
    return isDark ? colors.border.dark : colors.border.light;
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: isDark ? colors.background.dark : colors.background.light }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Modern Gradient Header */}
        <LinearGradient
          colors={isDark ? ['#1E1B4B', '#111827', '#111827'] : ['#EEF2FF', '#FFFFFF', '#FFFFFF']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: isDark ? '#E0E7FF' : '#1E3A8A' }]}>
              Welcome to{'\n'}
              <Text style={{ color: '#4F46E5', fontWeight: '900', fontSize: 36 }}>PlacementReady</Text>
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Your personalized AI-driven roadmap to landing your dream job starts here.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>What's your first name?</Text>
            <TextInput 
              style={[styles.input, { 
                color: isDark ? colors.text.dark : colors.text.light,
                borderColor: getBorderColor('name'),
                backgroundColor: isDark ? '#1F2937' : '#F9FAFB'
              }]}
              placeholder="e.g. Alex"
              placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Year Selection (Pill style) */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>Which year are you in?</Text>
            <View style={styles.chipContainer}>
              {yearOptions.map(opt => {
                const isActive = year === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.7}
                    style={[
                      styles.chip,
                      isActive ? styles.chipActive : { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' },
                      { borderColor: isActive ? 'transparent' : (isDark ? colors.border.dark : colors.border.light) }
                    ]}
                    onPress={() => setYear(opt)}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={['#4F46E5', '#3B82F6']}
                        style={styles.chipGradient}
                      >
                        <Text style={styles.chipTextActive}>{opt}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.chipGradient}>
                        <Text style={[styles.chipText, { color: isDark ? colors.text.dark : colors.text.light }]}>{opt}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Company Target */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>Target Company Type?</Text>
            <View style={styles.chipContainer}>
              {companyOptions.map(opt => {
                const isActive = companyType === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.7}
                    style={[
                      styles.chip,
                      isActive ? styles.chipActive : { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' },
                      { borderColor: isActive ? 'transparent' : (isDark ? colors.border.dark : colors.border.light) }
                    ]}
                    onPress={() => setCompanyType(opt)}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={['#4F46E5', '#3B82F6']}
                        style={styles.chipGradient}
                      >
                        <Text style={styles.chipTextActive}>{opt}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.chipGradient}>
                        <Text style={[styles.chipText, { color: isDark ? colors.text.dark : colors.text.light }]}>{opt}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Hours Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>Daily Study Commitment (Hours)</Text>
            <TextInput 
              style={[styles.input, { 
                color: isDark ? colors.text.dark : colors.text.light,
                borderColor: getBorderColor('hours'),
                backgroundColor: isDark ? '#1F2937' : '#F9FAFB'
              }]}
              placeholder="e.g. 2"
              placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
              keyboardType="numeric"
              value={hours}
              onChangeText={setHours}
              onFocus={() => setFocusedInput('hours')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <Button 
            title="Start My Journey →" 
            onPress={handleSave} 
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.m,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  formContainer: {
    padding: spacing.xl,
    paddingTop: spacing.l,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: borderRadius.l,
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    borderWidth: 1,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  chipActive: {
    borderWidth: 0,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chipGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  button: {
    marginTop: spacing.m,
    marginBottom: 40,
  }
});

export default OnboardingScreen;
