import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, UploadCloud } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/theme';

const UploadQuestionScreen = ({ route, navigation }) => {
  const { theme, userProfile, uploadQuestion } = useContext(AppContext);
  const isDark = theme === 'dark';

  // Read prefilled values from navigation route parameters
  const { prefilledType, prefilledTopic } = route?.params || {};
  const type = prefilledType || 'DSA';
  const topic = prefilledTopic || 'Arrays';

  const [title, setTitle] = useState(''); // Question Title
  const [content, setContent] = useState(''); // Question Content
  const [difficulty, setDifficulty] = useState('Easy');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState(''); // Answer / Explanation
  const [solutionLink, setSolutionLink] = useState('');
  const [notes, setNotes] = useState('');
  
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [timeComplexity, setTimeComplexity] = useState('');
  const [spaceComplexity, setSpaceComplexity] = useState('');
  
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('None');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    console.log("Submitting form: ", { title, content, company, topic, difficulty });

    // Form Validation (excluding topic as it is auto-assigned)
    if (!title.trim() || !content.trim() || !company.trim() || !difficulty) {
      console.log("Validation failed: some required fields are empty");
      if (Platform.OS === 'web') {
        window.alert("Please fill all required fields");
      } else {
        Alert.alert("Validation Error", "Please fill all required fields");
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newQuestion = {
        type,
        title: title.trim(),
        content: content.trim(),
        company: company.trim(),
        companyTags: [company.trim()], // For backwards compatibility
        topic,
        difficulty,
        uploadedBy: userProfile?.name || 'anonymous',
        authorId: userProfile?.uid || userProfile?.id || 'anonymous',
        description: description.trim(),
        answerExplanation: description.trim(), // For backwards compatibility
        solutionLink: solutionLink.trim(),
        notes: notes.trim(),
        codeSnippet: type === 'DSA' ? codeSnippet.trim() : '',
        language: type === 'DSA' ? language : '',
        timeComplexity: type === 'DSA' ? timeComplexity.trim() : '',
        spaceComplexity: type === 'DSA' ? spaceComplexity.trim() : '',
        options: type === 'Aptitude' && (optionA.trim() || optionB.trim()) ? [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()].filter(Boolean) : [],
        correctAnswer: type === 'Aptitude' && correctAnswer !== 'None' ? correctAnswer : '',
      };

      console.log("Publishing question object: ", newQuestion);

      await uploadQuestion(newQuestion);

      console.log("Question uploaded successfully, clearing form");

      // Clear the form fields
      setTitle('');
      setContent('');
      setCompany('');
      setDifficulty('Easy');
      setDescription('');
      setSolutionLink('');
      setNotes('');
      setCodeSnippet('');
      setLanguage('JavaScript');
      setTimeComplexity('');
      setSpaceComplexity('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('None');

      if (Platform.OS === 'web') {
        window.alert("Question published successfully");
        navigation.goBack();
      } else {
        Alert.alert("Success!", "Question published successfully", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error("Error during question submission: ", error);
      if (Platform.OS === 'web') {
        window.alert("Failed to upload question. Please try again.");
      } else {
        Alert.alert("Error", "Failed to upload question. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelector = (label, options, selectedValue, onSelect) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>{label}</Text>
      <View style={styles.selectorContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.selectorBtn,
              selectedValue === opt 
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: 'transparent', borderColor: isDark ? colors.border.dark : colors.border.light }
            ]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[
              styles.selectorText,
              { color: selectedValue === opt ? '#FFF' : (isDark ? colors.textMuted.dark : colors.textMuted.light) }
            ]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={isDark ? colors.text.dark : colors.text.light} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>
          Publish Question
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Auto-assigned context info for the user */}
        <View style={[styles.infoBanner, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
          <Text style={[styles.infoText, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Uploading to: <Text style={styles.boldText}>{type}</Text> → <Text style={styles.boldText}>{topic}</Text>
          </Text>
        </View>

        {renderSelector("Difficulty", ["Easy", "Medium", "Hard"], difficulty, setDifficulty)}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Question Title *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? colors.card.dark : colors.card.light,
              color: isDark ? colors.text.dark : colors.text.light,
              borderColor: isDark ? colors.border.dark : colors.border.light
            }]}
            placeholder="e.g., Two Sum"
            placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Question Content *
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { 
              backgroundColor: isDark ? colors.card.dark : colors.card.light,
              color: isDark ? colors.text.dark : colors.text.light,
              borderColor: isDark ? colors.border.dark : colors.border.light
            }]}
            placeholder="Write the full question description or text here..."
            placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Company *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? colors.card.dark : colors.card.light,
              color: isDark ? colors.text.dark : colors.text.light,
              borderColor: isDark ? colors.border.dark : colors.border.light
            }]}
            placeholder="e.g., TCS, Amazon, Google"
            placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
            value={company}
            onChangeText={setCompany}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Answer / Explanation
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { 
              backgroundColor: isDark ? colors.card.dark : colors.card.light,
              color: isDark ? colors.text.dark : colors.text.light,
              borderColor: isDark ? colors.border.dark : colors.border.light
            }]}
            placeholder="Provide answer details or explanation..."
            placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {type === 'DSA' && (
          <>
            {renderSelector("Programming Language", ["C", "C++", "Java", "Python", "JavaScript"], language, setLanguage)}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
                Code Snippet
              </Text>
              <TextInput
                style={[styles.input, styles.codeTextArea, { 
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  color: isDark ? '#E2E8F0' : '#0F172A',
                  borderColor: isDark ? colors.border.dark : colors.border.light,
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                }]}
                placeholder={`// Enter code snippet here...\nfunction solution() {\n  // ...\n}`}
                placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                value={codeSnippet}
                onChangeText={setCodeSnippet}
                multiline
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
                  Time Complexity
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDark ? colors.card.dark : colors.card.light,
                    color: isDark ? colors.text.dark : colors.text.light,
                    borderColor: isDark ? colors.border.dark : colors.border.light
                  }]}
                  placeholder="e.g., O(n)"
                  placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
                  value={timeComplexity}
                  onChangeText={setTimeComplexity}
                  autoCapitalize="none"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
                  Space Complexity
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDark ? colors.card.dark : colors.card.light,
                    color: isDark ? colors.text.dark : colors.text.light,
                    borderColor: isDark ? colors.border.dark : colors.border.light
                  }]}
                  placeholder="e.g., O(1)"
                  placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
                  value={spaceComplexity}
                  onChangeText={setSpaceComplexity}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
                Solution Link (Optional)
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDark ? colors.card.dark : colors.card.light,
                  color: isDark ? colors.text.dark : colors.text.light,
                  borderColor: isDark ? colors.border.dark : colors.border.light
                }]}
                placeholder="https://..."
                placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
                value={solutionLink}
                onChangeText={setSolutionLink}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
                Personal Notes (Optional)
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDark ? colors.card.dark : colors.card.light,
                  color: isDark ? colors.text.dark : colors.text.light,
                  borderColor: isDark ? colors.border.dark : colors.border.light
                }]}
                placeholder="Any hints or tricks?"
                placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </>
        )}

        {type === 'Aptitude' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? colors.text.dark : colors.text.light }]}>
                Options (MCQ - Optional)
              </Text>
              <View style={{ gap: 10 }}>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDark ? colors.card.dark : colors.card.light,
                    color: isDark ? colors.text.dark : colors.text.light,
                    borderColor: isDark ? colors.border.dark : colors.border.light
                  }]}
                  placeholder="Option A"
                  placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
                  value={optionA}
                  onChangeText={setOptionA}
                />
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDark ? colors.card.dark : colors.card.light,
                    color: isDark ? colors.text.dark : colors.text.light,
                    borderColor: isDark ? colors.border.dark : colors.border.light
                  }]}
                  placeholder="Option B"
                  placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
                  value={optionB}
                  onChangeText={setOptionB}
                />
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDark ? colors.card.dark : colors.card.light,
                    color: isDark ? colors.text.dark : colors.text.light,
                    borderColor: isDark ? colors.border.dark : colors.border.light
                  }]}
                  placeholder="Option C"
                  placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
                  value={optionC}
                  onChangeText={setOptionC}
                />
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDark ? colors.card.dark : colors.card.light,
                    color: isDark ? colors.text.dark : colors.text.light,
                    borderColor: isDark ? colors.border.dark : colors.border.light
                  }]}
                  placeholder="Option D"
                  placeholderTextColor={isDark ? colors.textMuted.dark : colors.textMuted.light}
                  value={optionD}
                  onChangeText={setOptionD}
                />
              </View>
            </View>

            {renderSelector("Correct Answer", ["A", "B", "C", "D", "None"], correctAnswer, setCorrectAnswer)}
          </>
        )}

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <UploadCloud color="#FFF" size={20} />
              <Text style={styles.submitBtnText}>Publish Question</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
    marginLeft: -5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
  },
  boldText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  selectorContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  selectorBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  selectorText: {
    fontWeight: '500',
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeTextArea: {
    height: 150,
    paddingTop: 12,
    fontSize: 14,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default UploadQuestionScreen;
