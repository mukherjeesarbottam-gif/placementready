import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors, spacing } from '../theme/theme';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import { CheckCircle2, Circle } from 'lucide-react-native';

const AptitudeTrackerScreen = ({ navigation }) => {
  const { theme, questions, communityProgress, toggleQuestionSolved, deleteQuestion, updateAptitudeProgress } = useContext(AppContext);
  const isDark = theme === 'dark';

  const [expandedTopic, setExpandedTopic] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const aptQuestions = questions.filter(q => q.type === 'Aptitude');

  // Categorized topics mapping
  const categories = {
    "Quantitative Aptitude": [
      'Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 'Time & Work', 'Time Speed Distance', 'Ratio & Proportion', 'Average', 'Mixture & Allegation', 'Permutation & Combination', 'Probability', 'Number System', 'HCF & LCM', 'Ages', 'Pipes & Cistern', 'Data Interpretation', 'Mensuration', 'Geometry', 'Algebra', 'Logarithm', 'Clock & Calendar'
    ],
    "Logical Reasoning": [
      'Seating Arrangement', 'Blood Relation', 'Coding Decoding', 'Syllogism', 'Statement & Conclusion', 'Direction Sense', 'Number Series', 'Puzzle', 'Odd One Out', 'Ranking', 'Input Output', 'Data Sufficiency', 'Pattern Recognition'
    ],
    "Verbal Ability": [
      'Reading Comprehension', 'Sentence Correction', 'Para Jumbles', 'Synonyms', 'Antonyms', 'Vocabulary', 'Grammar', 'Fill in the Blanks', 'Error Detection', 'Sentence Arrangement', 'Active Passive', 'Direct Indirect Speech'
    ]
  };

  // Dynamic list of companies based on loaded Aptitude questions
  const allCompanies = ['All', ...new Set(aptQuestions.flatMap(q => q.companyTags || []))];

  const handleIncrement = (topic) => {
    updateAptitudeProgress(topic, 1);
  };

  const handleDecrement = (topic) => {
    updateAptitudeProgress(topic, -1);
  };

  const getFilteredQuestions = (topic) => {
    return aptQuestions.filter(q => {
      if (q.topic !== topic) return false;
      
      // Company filter
      if (selectedCompany !== 'All') {
        if (!q.companyTags || !q.companyTags.includes(selectedCompany)) return false;
      }
      
      // Difficulty filter
      if (selectedDifficulty !== 'All') {
        if (q.difficulty !== selectedDifficulty) return false;
      }
      
      // Status filter
      if (selectedStatus !== 'All') {
        const isSolved = communityProgress?.solvedQuestions?.includes(q.id) || false;
        if (selectedStatus === 'Solved' && !isSolved) return false;
        if (selectedStatus === 'Unsolved' && isSolved) return false;
      }
      
      return true;
    });
  };

  const renderFilterRow = (label, options, selectedValue, onSelect) => (
    <View style={styles.filterRow}>
      <Text style={[styles.filterLabel, { color: isDark ? colors.textMuted.dark : colors.textMuted.light }]}>
        {label}:
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
        {options.map(opt => {
          const isSelected = selectedValue === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : (isDark ? '#2D3748' : '#EDF2F7'),
                  borderColor: isSelected ? colors.primary : (isDark ? '#4A5568' : '#CBD5E0')
                }
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#FFFFFF' : (isDark ? colors.text.dark : colors.text.light) }
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header with Upload Button */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: isDark ? colors.text.dark : colors.text.light }]}>
              Aptitude Tracker
            </Text>
            <Text style={{ color: isDark ? colors.textMuted.dark : colors.textMuted.light }}>
              Practice quantitative, logical reasoning, and verbal topics.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.uploadBtn}
            onPress={() => navigation.navigate('UploadQuestion', { prefilledType: 'Aptitude', prefilledTopic: 'Percentage' })}
          >
            <Text style={styles.uploadBtnText}>+ Upload</Text>
          </TouchableOpacity>
        </View>

        {/* Filter System */}
        <Card style={styles.filterCard}>
          <Text style={[styles.filterCardTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Filters
          </Text>
          {renderFilterRow('Company', allCompanies, selectedCompany, setSelectedCompany)}
          {renderFilterRow('Difficulty', ['All', 'Easy', 'Medium', 'Hard'], selectedDifficulty, setSelectedDifficulty)}
          {renderFilterRow('Status', ['All', 'Solved', 'Unsolved'], selectedStatus, setSelectedStatus)}
        </Card>

        {/* Categorized Topic List */}
        {Object.entries(categories).map(([categoryName, categoryTopics]) => (
          <View key={categoryName} style={styles.categorySection}>
            <Text style={[styles.categoryHeading, { color: isDark ? colors.text.dark : colors.text.light }]}>
              {categoryName}
            </Text>
            
            {categoryTopics.map(topic => {
              const topicQuestions = aptQuestions.filter(q => q.topic === topic);
              const total = topicQuestions.length;
              const completed = topicQuestions.filter(q => communityProgress?.solvedQuestions?.includes(q.id)).length;
              const progress = total === 0 ? 0 : completed / total;
              const isDone = completed === total && total > 0;
              const isExpanded = expandedTopic === topic;
              const filteredQs = getFilteredQuestions(topic);

              return (
                <Card key={topic} style={[styles.card, isExpanded && styles.expandedCard]}>
                  <TouchableOpacity 
                    activeOpacity={0.7} 
                    onPress={() => setExpandedTopic(isExpanded ? null : topic)}
                    style={styles.cardHeader}
                  >
                    <View style={styles.topicInfo}>
                      <Text style={[styles.topicTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>
                        {topic}
                      </Text>
                      <View style={styles.progressTextRow}>
                        <Text style={{ color: isDark ? colors.textMuted.dark : colors.textMuted.light, fontSize: 12, marginTop: 2 }}>
                          {completed} / {total} Solved
                        </Text>
                        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: 'bold', marginTop: 2, marginLeft: 8 }}>
                          {(progress * 100).toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                    <View style={styles.controls}>
                      <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleDecrement(topic); }} style={styles.btn}>
                        <Text style={[styles.btnText, { color: colors.danger }]}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleIncrement(topic); }} style={styles.btn}>
                        <Text style={[styles.btnText, { color: colors.accent }]}>+</Text>
                      </TouchableOpacity>
                      {isDone ? (
                        <CheckCircle2 color={colors.accent} size={24} style={{ marginLeft: 8 }} />
                      ) : (
                        <Circle color={isDark ? colors.border.dark : colors.border.light} size={24} style={{ marginLeft: 8 }} />
                      )}
                    </View>
                  </TouchableOpacity>
                  <ProgressBar progress={progress} />

                  {isExpanded && (
                    <View style={styles.questionsList}>
                      <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionSubtitle, { color: isDark ? colors.text.dark : colors.text.light }]}>
                          Questions ({filteredQs.length}):
                        </Text>
                        <TouchableOpacity 
                          style={styles.topicUploadBtn}
                          onPress={() => navigation.navigate('UploadQuestion', { prefilledType: 'Aptitude', prefilledTopic: topic })}
                        >
                          <Text style={styles.topicUploadBtnText}>+ Upload Question</Text>
                        </TouchableOpacity>
                      </View>
                      {filteredQs.length === 0 ? (
                        <Text style={styles.noQuestionsText}>No questions match the selected filters.</Text>
                      ) : (
                        filteredQs.map(q => (
                          <QuestionCard
                            key={q.id}
                            question={q}
                            isSolved={communityProgress?.solvedQuestions?.includes(q.id) || false}
                            onMarkSolved={() => toggleQuestionSolved(q.id)}
                            onDeleteQuestion={deleteQuestion}
                          />
                        ))
                      )}
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        ))}
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
    marginBottom: spacing.l 
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  uploadBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterCard: {
    marginBottom: spacing.m,
    padding: spacing.m,
  },
  filterCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.s,
    textTransform: 'uppercase',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 75,
    textTransform: 'uppercase',
  },
  chipsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: spacing.l,
  },
  categoryHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.s,
    marginTop: spacing.s,
  },
  card: { marginBottom: spacing.s },
  expandedCard: {
    paddingBottom: spacing.m,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 16, fontWeight: '600' },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00000010',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionsList: {
    marginTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: '#00000010',
    paddingTop: spacing.m,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  topicUploadBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  topicUploadBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noQuestionsText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: spacing.s,
  }
});

export default AptitudeTrackerScreen;
