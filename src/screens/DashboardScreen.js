import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Flame, Target, BookOpen, Briefcase, Code, Brain } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';
import { colors, spacing, borderRadius } from '../theme/theme';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const DashboardScreen = () => {
  const { theme, userProfile, streak, dsaProgress, aptitudeProgress, resumeScore } = useContext(AppContext);
  const isDark = theme === 'dark';

  // Calculate generic readiness
  const totalDsa = Object.values(dsaProgress).reduce((acc, val) => acc + val.total, 0);
  const completedDsa = Object.values(dsaProgress).reduce((acc, val) => acc + val.completed, 0);
  const dsaPercent = totalDsa === 0 ? 0 : completedDsa / totalDsa;

  const totalApt = Object.keys(aptitudeProgress).length;
  const completedApt = Object.values(aptitudeProgress).filter(v => v.completed).length;
  const aptPercent = totalApt === 0 ? 0 : completedApt / totalApt;

  const totalResume = Object.keys(resumeScore).length;
  const completedResume = Object.values(resumeScore).filter(Boolean).length;
  const resumePercent = totalResume === 0 ? 0 : completedResume / totalResume;

  const overallReadiness = (dsaPercent * 0.5) + (aptPercent * 0.3) + (resumePercent * 0.2);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: isDark ? colors.textMuted.dark : colors.textMuted.light }]}>
              Hello, {userProfile?.name || 'Student'}!
            </Text>
            <Text style={[styles.title, { color: isDark ? colors.text.dark : colors.text.light }]}>
              Your Dashboard
            </Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame color={colors.warning} size={20} />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        </View>

        {/* Hero Section */}
        <Card style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View>
              <Text style={styles.heroTitle}>Placement Readiness</Text>
              <Text style={styles.heroSubtitle}>Keep pushing! You're doing great.</Text>
            </View>
            <View style={styles.percentCircle}>
              <Text style={styles.percentText}>{Math.round(overallReadiness * 100)}%</Text>
            </View>
          </View>
          <ProgressBar progress={overallReadiness} />
        </Card>

        {/* Quick Stats Grid */}
        <Text style={[styles.sectionTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>
          Quick Stats
        </Text>
        
        <View style={styles.grid}>
          <Card style={styles.gridItem}>
            <View style={styles.gridHeader}>
              <Code color={colors.primary} size={24} />
              <Text style={[styles.gridTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>DSA</Text>
            </View>
            <Text style={[styles.gridValue, { color: colors.primary }]}>{Math.round(dsaPercent * 100)}%</Text>
          </Card>

          <Card style={styles.gridItem}>
            <View style={styles.gridHeader}>
              <Brain color={colors.accent} size={24} />
              <Text style={[styles.gridTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>Aptitude</Text>
            </View>
            <Text style={[styles.gridValue, { color: colors.accent }]}>{Math.round(aptPercent * 100)}%</Text>
          </Card>

          <Card style={styles.gridItem}>
            <View style={styles.gridHeader}>
              <Briefcase color="#8B5CF6" size={24} />
              <Text style={[styles.gridTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>Resume</Text>
            </View>
            <Text style={[styles.gridValue, { color: '#8B5CF6' }]}>{Math.round(resumePercent * 100)}%</Text>
          </Card>

          <Card style={styles.gridItem}>
            <View style={styles.gridHeader}>
              <Target color="#EC4899" size={24} />
              <Text style={[styles.gridTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>Goal</Text>
            </View>
            <Text style={[styles.gridValue, { color: '#EC4899', fontSize: 16 }]} numberOfLines={1}>
              {userProfile?.companyType}
            </Text>
          </Card>
        </View>

        {/* Today's Goals preview */}
        <Text style={[styles.sectionTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>
          Today's Goal
        </Text>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <BookOpen color={colors.textMuted.light} size={24} />
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? colors.text.dark : colors.text.light }}>
                Study for {userProfile?.studyHours} hours
              </Text>
              <Text style={{ color: isDark ? colors.textMuted.dark : colors.textMuted.light }}>
                Focus on your weak areas today.
              </Text>
            </View>
          </View>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.m },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    marginTop: spacing.s,
  },
  greeting: { fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.round,
    gap: 4,
  },
  streakText: {
    color: '#D97706',
    fontWeight: 'bold',
    fontSize: 16,
  },
  heroCard: {
    backgroundColor: colors.primary,
    padding: spacing.l,
    marginBottom: spacing.l,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: '#E0F2FE',
    marginTop: 4,
  },
  percentCircle: {
    backgroundColor: '#ffffff33',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.s,
    marginTop: spacing.s,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  gridItem: {
    width: '47%',
    padding: spacing.m,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  gridValue: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export default DashboardScreen;
