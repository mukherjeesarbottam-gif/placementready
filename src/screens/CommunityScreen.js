import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/theme';
import QuestionCard from '../components/QuestionCard';
import { getQuestions } from '../firebase/api';

const CommunityScreen = ({ navigation }) => {
  const { theme, communityProgress, toggleQuestionSolved, questions, loadQuestions, isLoading } = useContext(AppContext);
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('All'); // All, DSA, Aptitude

  useEffect(() => {
    loadQuestions();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadQuestions();
    });
    
    return unsubscribe;
  }, [navigation]);

  const handleMarkSolved = (questionId) => {
    toggleQuestionSolved(questionId);
  };

  const filteredQuestions = (questions || []).filter(q => {
    if (filter === 'All') return true;
    return q.type === filter;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? colors.text.dark : colors.text.light }]}>
          Community Hub
        </Text>
        <TouchableOpacity 
          style={styles.uploadBtn}
          onPress={() => navigation.navigate('UploadQuestion')}
        >
          <Plus size={20} color="#FFF" />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'DSA', 'Aptitude'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              filter === f 
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: 'transparent', borderColor: isDark ? colors.border.dark : colors.border.light }
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === f ? '#FFF' : (isDark ? colors.textMuted.dark : colors.textMuted.light) }
            ]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredQuestions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <QuestionCard 
              question={item}
              isSolved={communityProgress?.solvedQuestions?.includes(item?.id) || false}
              onMarkSolved={handleMarkSolved}
              onPress={() => {/* Navigate to details if needed */}}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: isDark ? colors.textMuted.dark : colors.textMuted.light }]}>
                No questions found. Be the first to upload one!
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  uploadBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  uploadBtnText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CommunityScreen;
