import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors, spacing, borderRadius } from '../theme/theme';
import Card from '../components/Card';
import { CheckCircle2 } from 'lucide-react-native';

const roadmaps = {
  'Mass Recruiter': [
    { title: 'Aptitude & Logical', desc: 'Focus heavily on quantitative aptitude and logical reasoning. Practice daily.' },
    { title: 'Basic Programming', desc: 'Strong grasp of syntax in C++/Java/Python. Know OOPs concepts.' },
    { title: 'Core Subjects', desc: 'Basic knowledge of DBMS, OS, and Computer Networks.' },
    { title: 'Communication Skills', desc: 'Clear communication is key for HR and Technical rounds.' },
  ],
  'Product': [
    { title: 'Data Structures & Algorithms', desc: 'In-depth knowledge of DSA. Focus on Trees, Graphs, and DP.' },
    { title: 'System Design', desc: 'Basic LLD for freshers. HLD overview.' },
    { title: 'Core CS Subjects', desc: 'Deep dive into OS, DBMS, and CN.' },
    { title: 'Development Projects', desc: 'At least 2 strong full-stack or backend projects.' },
  ],
  'Startup': [
    { title: 'Development Skills', desc: 'High focus on tech stack (MERN, React Native, etc.).' },
    { title: 'Projects & Portfolio', desc: 'Live projects with real users or strong GitHub profile.' },
    { title: 'Basic DSA', desc: 'Good enough DSA for problem solving (Arrays, Strings, Hashmaps).' },
    { title: 'Culture Fit', desc: 'Ability to work in fast-paced environments and wear multiple hats.' },
  ]
};

const RoadmapScreen = () => {
  const { theme, userProfile } = useContext(AppContext);
  const isDark = theme === 'dark';

  const companyType = userProfile?.companyType || 'Product';
  // Map standard types, handling slight mismatches
  const getRoadmapKey = () => {
    if (typeof companyType === 'string') {
      if (companyType.includes('Mass')) return 'Mass Recruiter';
      if (companyType.includes('Startup')) return 'Startup';
    }
    return 'Product';
  };
  
  const roadmapSteps = roadmaps[getRoadmapKey()] || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Company Roadmap
          </Text>
          <Text style={{ color: isDark ? colors.textMuted.dark : colors.textMuted.light }}>
            Customized path for <Text style={{ fontWeight: 'bold', color: colors.primary }}>{companyType}</Text>
          </Text>
        </View>

        <View style={styles.timeline}>
          {roadmapSteps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <CheckCircle2 color={colors.accent} size={24} />
                {index !== roadmapSteps.length - 1 && (
                  <View style={[styles.line, { backgroundColor: isDark ? colors.border.dark : colors.border.light }]} />
                )}
              </View>
              <Card style={styles.card}>
                <Text style={[styles.stepTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>
                  {step.title}
                </Text>
                <Text style={{ color: isDark ? colors.textMuted.dark : colors.textMuted.light, marginTop: 4 }}>
                  {step.desc}
                </Text>
              </Card>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.m },
  header: { marginBottom: spacing.l },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  timeline: {
    paddingLeft: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: spacing.m,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -spacing.m, // Extend to next step
  },
  card: {
    flex: 1,
    marginTop: -8, // Align with icon
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default RoadmapScreen;
