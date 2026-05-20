import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView, Modal, Platform, Alert, Clipboard } from 'react-native';
import { CheckCircle, Code, Brain, Tag, MoreVertical, X, Edit3, Trash2, Calendar, User, Eye, Check } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/theme';

const QuestionCard = ({ question, isSolved, onMarkSolved, onDeleteQuestion }) => {
  const context = useContext(AppContext) || {};
  const theme = context.theme || 'light';
  const isDark = theme === 'dark';

  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedOptIndex, setSelectedOptIndex] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!question) {
    return null;
  }

  const isDSA = question.type === 'DSA';
  const difficulty = question.difficulty || 'Easy';
  const topic = question.topic || 'General';
  const title = question.title || 'Untitled Question';
  const fullContent = question.content || question.description || 'No description provided.';
  const explanation = question.explanation || question.answerExplanation || '';
  const companyTags = question.companyTags || [];
  const uploadedBy = question.uploadedBy || 'system';
  const isDeletable = question.id?.startsWith('custom-') || question.authorId !== 'system';

  const getDifficultyColors = () => {
    switch (difficulty) {
      case 'Easy': return { text: '#10B981', bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5' };
      case 'Medium': return { text: '#F59E0B', bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7' };
      case 'Hard': return { text: '#EF4444', bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2' };
      default: return { text: colors?.primary || '#3B82F6', bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE' };
    }
  };

  const getCorrectOptionIndex = () => {
    if (!question || !question.correctAnswer) return -1;
    const ans = question.correctAnswer.toString().toUpperCase().trim();
    if (ans === 'A') return 0;
    if (ans === 'B') return 1;
    if (ans === 'C') return 2;
    if (ans === 'D') return 3;
    return -1;
  };
  const correctOptIdx = getCorrectOptionIndex();

  React.useEffect(() => {
    if (isDetailsVisible) {
      if (isSolved) {
        setHasSubmitted(true);
        setSelectedOptIndex(getCorrectOptionIndex());
      } else {
        setHasSubmitted(false);
        setSelectedOptIndex(null);
      }
    }
  }, [isDetailsVisible, isSolved]);

  const handleAptitudeSubmit = () => {
    setHasSubmitted(true);
    if (onMarkSolved) {
      onMarkSolved(question.id);
    }
  };

  const difficultyColors = getDifficultyColors();
  const primaryColor = colors?.primary || '#3B82F6';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isSolved ? '#10B981' : (isDark ? '#334155' : '#E2E8F0');
  const textMutedCol = isDark ? '#94A3B8' : '#64748B';
  const textCol = isDark ? '#F1F5F9' : '#1E293B';
  
  const formattedDate = question.createdAt 
    ? new Date(question.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : 'System Generated';

  // Preview content text
  const previewText = fullContent.length > 90 ? `${fullContent.substring(0, 90)}...` : fullContent;

  const handleToggleSolved = () => {
    if (onMarkSolved) {
      onMarkSolved(question.id);
    }
  };

  const handleDeleteConfirm = () => {
    if (onDeleteQuestion) {
      onDeleteQuestion(question.id);
    }
    setIsDeleteConfirmVisible(false);
    setIsDetailsVisible(false);
    setIsMoreMenuVisible(false);
  };

  const handleCopyCode = (code) => {
    if (Platform.OS === 'web') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
        window.alert("Code copied to clipboard!");
      } else {
        window.alert("Clipboard not supported in this browser environment.");
      }
    } else {
      if (Clipboard && Clipboard.setString) {
        Clipboard.setString(code);
        Alert.alert("Success", "Code copied to clipboard!");
      } else {
        Alert.alert("Error", "Clipboard is not available.");
      }
    }
  };

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: cardBg,
        borderColor: borderCol,
        shadowColor: isDark ? '#000' : '#0F172A',
        shadowOpacity: isDark ? 0.3 : 0.06,
      }
    ]}>
      <Pressable onPress={() => setIsDetailsVisible(true)}>
        {/* Title */}
        <Text style={[styles.cardTitle, { color: textCol }]} numberOfLines={1}>
          {title}
        </Text>

        {/* Badges Container */}
        <View style={styles.badgesRow}>
          {/* Topic Badge */}
          <View style={[styles.badge, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
            {isDSA ? <Code size={11} color={textMutedCol} /> : <Brain size={11} color={textMutedCol} />}
            <Text style={[styles.badgeText, { color: textMutedCol }]}>{topic}</Text>
          </View>

          {/* Company Badge */}
          {companyTags.slice(0, 1).map((tag, index) => (
            <View key={index} style={[styles.badge, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
              <Tag size={10} color={textMutedCol} />
              <Text style={[styles.badgeText, { color: textMutedCol }]}>{tag}</Text>
            </View>
          ))}

          {/* Difficulty Badge */}
          <View style={[styles.badge, { backgroundColor: difficultyColors.bg }]}>
            <Text style={[styles.badgeText, { color: difficultyColors.text, fontWeight: '700' }]}>{difficulty}</Text>
          </View>
        </View>

        {/* Short Preview */}
        {isDSA && (
          <Text style={[styles.previewText, { color: textMutedCol }]} numberOfLines={2}>
            {previewText}
          </Text>
        )}

        {/* Progress Status Row */}
        {isDSA && (
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <CheckCircle size={14} color={isSolved ? '#10B981' : textMutedCol} />
              <Text style={[styles.statusText, { color: isSolved ? '#10B981' : textMutedCol }]}>
                {isSolved ? 'Solved' : 'Unsolved'}
              </Text>
            </View>
          </View>
        )}
      </Pressable>

      {/* Footer Action Buttons */}
      <View style={[styles.actionButtonsRow, { borderTopColor: isDark ? '#334155' : '#E2E8F0' }]}>
        {isDSA ? (
          <>
            <TouchableOpacity 
              style={[styles.btnOutline, { borderColor: isDark ? '#475569' : '#CBD5E1' }]}
              onPress={() => setIsDetailsVisible(true)}
            >
              <Eye size={14} color={textCol} />
              <Text style={[styles.btnOutlineText, { color: textCol }]}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.btnSolvedToggle, 
                { 
                  backgroundColor: isSolved ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  borderColor: isSolved ? '#10B981' : (isDark ? '#475569' : '#CBD5E1') 
                }
              ]}
              onPress={handleToggleSolved}
              disabled={isSolved}
            >
              <Check size={14} color={isSolved ? '#10B981' : textCol} />
              <Text style={[styles.btnSolvedToggleText, { color: isSolved ? '#10B981' : textCol }]}>
                {isSolved ? 'Solved' : 'Mark Solved'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.btnOutline, { flex: 1, borderColor: isSolved ? '#10B981' : (isDark ? '#475569' : '#CBD5E1'), backgroundColor: isSolved ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }]}
            onPress={() => setIsDetailsVisible(true)}
          >
            <Eye size={14} color={isSolved ? '#10B981' : textCol} />
            <Text style={[styles.btnOutlineText, { color: isSolved ? '#10B981' : textCol }]}>
              {isSolved ? 'Completed (Review)' : 'Start Solving'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.btnMore, { borderColor: isDark ? '#475569' : '#CBD5E1' }]}
          onPress={() => setIsMoreMenuVisible(true)}
        >
          <MoreVertical size={16} color={textCol} />
        </TouchableOpacity>
      </View>

      {/* 1. More Actions Drawer / Modal */}
      <Modal
        visible={isMoreMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMoreMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsMoreMenuVisible(false)}
        >
          <View style={[styles.actionsDrawer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: textCol }]}>Options</Text>
              <TouchableOpacity onPress={() => setIsMoreMenuVisible(false)}>
                <X size={20} color={textCol} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.drawerOption}
              onPress={() => {
                setIsMoreMenuVisible(false);
                if (Platform.OS === 'web') {
                  window.alert("Edit functionality coming soon!");
                } else {
                  Alert.alert("Coming Soon", "Edit functionality coming soon!");
                }
              }}
            >
              <Edit3 size={18} color={textCol} style={{ marginRight: 12 }} />
              <Text style={[styles.drawerOptionText, { color: textCol }]}>Edit Question</Text>
            </TouchableOpacity>

            {isDeletable && (
              <TouchableOpacity 
                style={[styles.drawerOption, styles.dangerOption]}
                onPress={() => {
                  setIsMoreMenuVisible(false);
                  setIsDeleteConfirmVisible(true);
                }}
              >
                <Trash2 size={18} color="#EF4444" style={{ marginRight: 12 }} />
                <Text style={[styles.drawerOptionText, { color: '#EF4444' }]}>Delete Question</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.drawerOption, { justifyContent: 'center', marginTop: 10 }]}
              onPress={() => setIsMoreMenuVisible(false)}
            >
              <Text style={{ color: textMutedCol, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* 2. Custom Delete Confirmation Modal */}
      <Modal
        visible={isDeleteConfirmVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleteConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.confirmTitle, { color: textCol }]}>Delete Question</Text>
            <Text style={[styles.confirmMessage, { color: textMutedCol }]}>Delete this question?</Text>
            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity 
                style={[styles.confirmBtnCancel, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}
                onPress={() => setIsDeleteConfirmVisible(false)}
              >
                <Text style={[styles.confirmBtnText, { color: textCol }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmBtnDelete, { backgroundColor: '#EF4444' }]}
                onPress={handleDeleteConfirm}
              >
                <Text style={[styles.confirmBtnText, { color: '#FFFFFF' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. Premium Details Modal */}
      <Modal
        visible={isDetailsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDetailsVisible(false)}
      >
        <View style={styles.detailsModalOverlay}>
          <View style={[styles.detailsContainer, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
            
            {/* Modal Header */}
            <View style={[styles.detailsHeader, { borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailsHeaderTitle, { color: textCol }]}>Question Details</Text>
                <Text style={{ color: textMutedCol, fontSize: 12 }}>{topic}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.closeBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                onPress={() => setIsDetailsVisible(false)}
              >
                <X size={20} color={textCol} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.detailsScrollBody} showsVerticalScrollIndicator={false}>
              
              {/* Question Title */}
              <Text style={[styles.detailsTitle, { color: textCol }]}>{title}</Text>

              {/* Badges Row in Details */}
              <View style={styles.detailsBadgesRow}>
                <View style={[styles.badge, { backgroundColor: difficultyColors.bg }]}>
                  <Text style={[styles.badgeText, { color: difficultyColors.text, fontWeight: '700' }]}>{difficulty}</Text>
                </View>
                {companyTags.map((tag, idx) => (
                  <View key={idx} style={[styles.badge, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                    <Tag size={10} color={textMutedCol} />
                    <Text style={[styles.badgeText, { color: textMutedCol }]}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Time & Space Complexity Blocks */}
              {isDSA && (question.timeComplexity || question.spaceComplexity) && (
                <View style={styles.complexityContainer}>
                  {question.timeComplexity ? (
                    <View style={[styles.complexityItem, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                      <Text style={[styles.complexityLabel, { color: textMutedCol }]}>Time Complexity</Text>
                      <Text style={[styles.complexityVal, { color: colors.primary, fontWeight: 'bold' }]}>{question.timeComplexity}</Text>
                    </View>
                  ) : null}
                  {question.spaceComplexity ? (
                    <View style={[styles.complexityItem, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', marginLeft: question.timeComplexity ? 12 : 0 }]}>
                      <Text style={[styles.complexityLabel, { color: textMutedCol }]}>Space Complexity</Text>
                      <Text style={[styles.complexityVal, { color: colors.primary, fontWeight: 'bold' }]}>{question.spaceComplexity}</Text>
                    </View>
                  ) : null}
                </View>
              )}

              {/* Content Description Code-box */}
              <Text style={[styles.sectionHeading, { color: textCol }]}>Question Description</Text>
              <View style={[styles.codeBox, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
                <Text style={[styles.codeText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                  {fullContent}
                </Text>
              </View>

              {/* MCQ Options Display */}
              {!isDSA && question.options && question.options.length > 0 && (
                <>
                  <Text style={[styles.sectionHeading, { color: textCol }]}>Options</Text>
                  <View style={{ gap: 8, marginBottom: 20 }}>
                    {question.options.map((opt, idx) => {
                      const optLabel = String.fromCharCode(65 + idx); // A, B, C, D
                      const isCorrect = question.correctAnswer === optLabel;
                      const isSelected = selectedOptIndex === idx;
                      const showResult = hasSubmitted || isSolved;
                      
                      let bg = isDark ? '#1E293B' : '#F8FAFC';
                      let border = isDark ? '#334155' : '#E2E8F0';
                      
                      if (showResult) {
                        if (isCorrect) {
                          bg = 'rgba(16, 185, 129, 0.1)';
                          border = '#10B981';
                        } else if (isSelected) {
                          bg = 'rgba(239, 68, 68, 0.1)';
                          border = '#EF4444';
                        }
                      } else if (isSelected) {
                        bg = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)';
                        border = colors.primary || '#3B82F6';
                      }

                      return (
                        <TouchableOpacity 
                          key={idx} 
                          disabled={showResult}
                          onPress={() => setSelectedOptIndex(idx)}
                          style={{ 
                            backgroundColor: bg,
                            borderColor: border,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 12,
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          <View style={{ 
                            backgroundColor: isCorrect && showResult ? '#10B981' : (isSelected ? (colors.primary || '#3B82F6') : (isDark ? '#334155' : '#E2E8F0')),
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12
                          }}>
                            <Text style={{ color: (isCorrect && showResult) || isSelected ? '#FFF' : textCol, fontSize: 12, fontWeight: 'bold' }}>
                              {optLabel}
                            </Text>
                          </View>
                          <Text style={{ color: textCol, flex: 1, fontSize: 14 }}>{opt}</Text>
                          {showResult && isCorrect && (
                            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                              <Text style={{ color: '#10B981', fontSize: 10, fontWeight: 'bold' }}>Correct</Text>
                            </View>
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                              <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: 'bold' }}>Wrong</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Submission and Result Feedback */}
                  {!hasSubmitted && !isSolved && (
                    <TouchableOpacity
                      disabled={selectedOptIndex === null}
                      onPress={handleAptitudeSubmit}
                      style={{
                        backgroundColor: selectedOptIndex === null ? (isDark ? '#334155' : '#E2E8F0') : (colors.primary || '#3B82F6'),
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                        marginBottom: 20
                      }}
                    >
                      <Text style={{ color: selectedOptIndex === null ? textMutedCol : '#FFF', fontSize: 15, fontWeight: 'bold' }}>
                        Submit Answer
                      </Text>
                    </TouchableOpacity>
                  )}

                  {(hasSubmitted || isSolved) && (
                    <View style={{ 
                      padding: 16, 
                      borderRadius: 12, 
                      backgroundColor: (selectedOptIndex === correctOptIdx || isSolved) ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      borderWidth: 1,
                      borderColor: (selectedOptIndex === correctOptIdx || isSolved) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      marginBottom: 20
                    }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: 'bold', 
                        color: (selectedOptIndex === correctOptIdx || isSolved) ? '#10B981' : '#EF4444',
                        marginBottom: 4
                      }}>
                        {(selectedOptIndex === correctOptIdx || isSolved) ? '✅ Correct Answer' : '❌ Wrong Answer'}
                      </Text>
                      <Text style={{ color: textCol, fontSize: 14, fontWeight: '500' }}>
                        Correct Answer: {question.options && question.options[correctOptIdx] ? question.options[correctOptIdx] : (question.correctAnswer || '')}
                      </Text>
                    </View>
                  )}
                </>
              )}

              {/* Backwards compatible fallback for non-MCQ Aptitude questions */}
              {!isDSA && (!question.options || question.options.length === 0) && (
                <>
                  <Text style={[styles.sectionHeading, { color: textCol }]}>Correct Answer</Text>
                  <View style={[styles.notesBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : '#D1FAE5', borderColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#10B981', marginBottom: 20 }]}>
                    <Text style={[styles.notesText, { color: isDark ? '#10B981' : '#047857', fontWeight: 'bold' }]}>
                      {question.correctAnswer || 'Check explanation below.'}
                    </Text>
                  </View>
                </>
              )}

              {/* Code Snippet Box */}
              {isDSA && question.codeSnippet && question.codeSnippet.trim().length > 0 ? (
                <>
                  <Text style={[styles.sectionHeading, { color: textCol }]}>Code Snippet</Text>
                  <View style={[styles.codeSnippetContainer, { backgroundColor: '#0F172A', borderColor: isDark ? '#334155' : '#1E293B' }]}>
                    <View style={styles.codeSnippetHeader}>
                      <View style={styles.langBadge}>
                        <Text style={styles.langBadgeText}>{question.language || 'Code'}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.copyBtn} 
                        onPress={() => handleCopyCode(question.codeSnippet)}
                      >
                        <Text style={styles.copyBtnText}>Copy Code</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.codeSnippetScroll}>
                      <Text style={styles.codeSnippetText}>
                        {question.codeSnippet}
                      </Text>
                    </ScrollView>
                  </View>
                </>
              ) : null}

              {/* Explanation / Notes */}
              {explanation.length > 0 && explanation !== fullContent && (isDSA || hasSubmitted || isSolved) && (
                <>
                  <Text style={[styles.sectionHeading, { color: textCol }]}>Explanation / Solution Notes</Text>
                  <View style={[styles.notesBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.05)' : '#EFF6FF', borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE' }]}>
                    <Text style={[styles.notesText, { color: isDark ? '#93C5FD' : '#1E40AF' }]}>
                      {explanation}
                    </Text>
                  </View>
                </>
              )}

              {/* Meta Info */}
              <View style={[styles.metaSection, { borderTopColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <View style={styles.metaRow}>
                  <User size={14} color={textMutedCol} />
                  <Text style={[styles.metaText, { color: textMutedCol }]}>Uploaded By: {uploadedBy}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Calendar size={14} color={textMutedCol} />
                  <Text style={[styles.metaText, { color: textMutedCol }]}>Date: {formattedDate}</Text>
                </View>
              </View>

            </ScrollView>

            {/* Modal Bottom Sticky Buttons */}
            {(isDSA || isDeletable) && (
              <View style={[styles.detailsFooter, { borderTopColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                {isDSA && (
                  <TouchableOpacity 
                    style={[
                      styles.detailsSolveBtn,
                      { backgroundColor: isSolved ? 'rgba(16, 185, 129, 0.1)' : primaryColor }
                    ]}
                    onPress={handleToggleSolved}
                    disabled={isSolved}
                  >
                    <Check size={18} color={isSolved ? '#10B981' : '#FFFFFF'} />
                    <Text style={[styles.detailsSolveBtnText, { color: isSolved ? '#10B981' : '#FFFFFF' }]}>
                      {isSolved ? 'Completed' : 'Mark as Solved'}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {isDeletable && (
                  <View style={[styles.detailsMoreActions, !isDSA && { flex: 1, justifyContent: 'flex-end' }]}>
                    <TouchableOpacity 
                      style={[styles.detailsActionIconBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
                      onPress={() => setIsDeleteConfirmVisible(true)}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 22,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  previewText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  btnOutline: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    gap: 6,
  },
  btnOutlineText: {
    fontSize: 13,
    fontWeight: '600',
  },
  btnSolvedToggle: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    gap: 6,
  },
  btnSolvedToggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  btnMore: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  actionsDrawer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00000010',
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#00000005',
  },
  dangerOption: {
    borderBottomWidth: 0,
  },
  drawerOptionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  confirmBox: {
    width: '85%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  confirmMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmBtnCancel: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnDelete: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  detailsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  detailsContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    paddingTop: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  detailsHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsScrollBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 14,
  },
  detailsBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  complexityContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  complexityItem: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  complexityLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  complexityVal: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 10,
  },
  codeBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  codeText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  codeSnippetContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  codeSnippetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  langBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  langBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  copyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  copyBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  codeSnippetScroll: {
    padding: 16,
  },
  codeSnippetText: {
    color: '#E2E8F0',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    lineHeight: 18,
  },
  notesBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaSection: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 10,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
  },
  detailsFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
    alignItems: 'center',
  },
  detailsSolveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  detailsSolveBtnText: {
    fontWeight: '700',
    fontSize: 15,
  },
  detailsMoreActions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsActionIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QuestionCard;
