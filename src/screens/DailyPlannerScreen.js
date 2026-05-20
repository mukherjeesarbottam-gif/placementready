import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors, spacing } from '../theme/theme';
import Card from '../components/Card';
import { CheckSquare, Square } from 'lucide-react-native';

const DailyPlannerScreen = () => {
  const { theme, plannerTasks, togglePlannerTask } = useContext(AppContext);
  const isDark = theme === 'dark';

  const completedCount = plannerTasks.filter(t => t.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Daily Planner
          </Text>
          <Text style={{ color: isDark ? colors.textMuted.dark : colors.textMuted.light }}>
            {completedCount} / {plannerTasks.length} tasks completed today.
          </Text>
        </View>

        {plannerTasks.map((task) => (
          <Card key={task.id} style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => togglePlannerTask(task.id)} activeOpacity={0.7}>
              <View style={styles.textContainer}>
                <Text style={[
                  styles.taskTitle, 
                  { color: isDark ? colors.text.dark : colors.text.light },
                  task.completed && { textDecorationLine: 'line-through', color: isDark ? colors.textMuted.dark : colors.textMuted.light }
                ]}>
                  {task.title}
                </Text>
              </View>
              {task.completed ? (
                <CheckSquare color={colors.accent} size={28} />
              ) : (
                <Square color={isDark ? colors.border.dark : colors.border.light} size={28} />
              )}
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.m },
  header: { marginBottom: spacing.l },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  card: { padding: spacing.m, marginBottom: spacing.s },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: { flex: 1, paddingRight: spacing.m },
  taskTitle: { fontSize: 16, fontWeight: '500' },
});

export default DailyPlannerScreen;
