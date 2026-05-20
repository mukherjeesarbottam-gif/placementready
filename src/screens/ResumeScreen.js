import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  Switch
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors, spacing, borderRadius } from '../theme/theme';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Globe, 
  GraduationCap, 
  Award,
  Briefcase,
  Code2,
  FileCheck
} from 'lucide-react-native';
import { refineDescription } from '../utils/aiResumeRefiner';

const ResumeScreen = () => {
  const { 
    theme, 
    resumeScore, 
    updateResumeScore, 
    resumeBuilderData, 
    saveResumeBuilderData 
  } = useContext(AppContext);
  
  const isDark = theme === 'dark';
  const activeColors = {
    background: isDark ? colors.background.dark : colors.background.light,
    card: isDark ? colors.card.dark : colors.card.light,
    text: isDark ? colors.text.dark : colors.text.light,
    textMuted: isDark ? colors.textMuted.dark : colors.textMuted.light,
    border: isDark ? colors.border.dark : colors.border.light,
    inputBg: isDark ? '#1e293b' : '#f8fafc',
    inputBorder: isDark ? '#334155' : '#cbd5e1',
  };

  // State to manage builder mode vs checklist mode
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(resumeBuilderData);
  const [isRefining, setIsRefining] = useState({ type: null, index: null });

  const sections = Object.keys(resumeScore);
  const completedCount = sections.filter(sec => resumeScore[sec]).length;
  const progress = completedCount / sections.length;

  const toggleSection = (section) => {
    updateResumeScore(section, !resumeScore[section]);
  };

  const handleTextChange = (stepKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [field]: value
      }
    }));
  };

  const handleArrayItemChange = (stepKey, index, field, value) => {
    setFormData(prev => {
      const items = [...prev[stepKey]];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, [stepKey]: items };
    });
  };

  const addArrayItem = (stepKey) => {
    setFormData(prev => {
      const newItem = stepKey === 'projects' 
        ? { name: '', techStack: '', description: '', refinedPoints: [] }
        : { title: '', company: '', duration: '', description: '', refinedPoints: [] };
      return { ...prev, [stepKey]: [...prev[stepKey], newItem] };
    });
  };

  const removeArrayItem = (stepKey, index) => {
    setFormData(prev => {
      const items = prev[stepKey].filter((_, i) => i !== index);
      return { ...prev, [stepKey]: items };
    });
  };

  const handleAIRefinement = async (stepKey, index) => {
    const item = formData[stepKey][index];
    const textToRefine = item.description;

    if (!textToRefine || textToRefine.trim().length < 5) {
      Alert.alert("Input Needed", "Please write a brief description first so AI can refine it!");
      return;
    }

    setIsRefining({ type: stepKey, index });
    try {
      const refined = await refineDescription(textToRefine, stepKey === 'projects' ? 'project' : 'experience');
      setFormData(prev => {
        const items = [...prev[stepKey]];
        items[index] = { ...items[index], refinedPoints: refined };
        return { ...prev, [stepKey]: items };
      });
    } catch (e) {
      console.error(e);
      Alert.alert("AI Error", "Failed to refine description. Please try again.");
    } finally {
      setIsRefining({ type: null, index: null });
    }
  };

  const saveBuilderProgress = async () => {
    await saveResumeBuilderData(formData);
  };

  const handleNextStep = async () => {
    await saveBuilderProgress();
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finalizeResume = async () => {
    await saveBuilderProgress();
    
    // Automatically check off checklist sections that are completed
    if (formData.personal.name && formData.personal.email) {
      await updateResumeScore('Education', !!(formData.education.college && formData.education.degree));
      await updateResumeScore('Skills', !!(formData.skills.languages || formData.skills.frameworks));
      await updateResumeScore('Projects', formData.projects.length > 0 && !!formData.projects[0].name);
      await updateResumeScore('Experience', formData.experience.length > 0 && !!formData.experience[0].title);
      await updateResumeScore('Achievements', true);
    }

    setIsBuilding(false);
    Alert.alert("Success 🎉", "Resume builder data saved and score updated!");
  };

  const triggerMockDownload = () => {
    Alert.alert(
      "Resume Ready! 📥",
      "Would you like to export your premium resume as a PDF?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Download PDF", 
          onPress: () => {
            Alert.alert("Downloaded", "placement_ready_resume.pdf downloaded successfully!");
          } 
        }
      ]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: activeColors.text }]}>Personal Details</Text>
            <Text style={[styles.stepSubtitle, { color: activeColors.textMuted }]}>Let's start with your contact information.</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Full Name</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="John Doe"
                placeholderTextColor={activeColors.textMuted}
                value={formData.personal.name}
                onChangeText={(val) => handleTextChange('personal', 'name', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Email Address</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="johndoe@example.com"
                placeholderTextColor={activeColors.textMuted}
                keyboardType="email-address"
                value={formData.personal.email}
                onChangeText={(val) => handleTextChange('personal', 'email', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Phone Number</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="+1 234 567 890"
                placeholderTextColor={activeColors.textMuted}
                keyboardType="phone-pad"
                value={formData.personal.phone}
                onChangeText={(val) => handleTextChange('personal', 'phone', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>LinkedIn Profile Link</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="linkedin.com/in/johndoe"
                placeholderTextColor={activeColors.textMuted}
                value={formData.personal.linkedin}
                onChangeText={(val) => handleTextChange('personal', 'linkedin', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>GitHub Profile Link</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="github.com/johndoe"
                placeholderTextColor={activeColors.textMuted}
                value={formData.personal.github}
                onChangeText={(val) => handleTextChange('personal', 'github', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Portfolio or Other Link</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="johndoe.dev"
                placeholderTextColor={activeColors.textMuted}
                value={formData.personal.portfolio}
                onChangeText={(val) => handleTextChange('personal', 'portfolio', val)}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: activeColors.text }]}>Education Details</Text>
            <Text style={[styles.stepSubtitle, { color: activeColors.textMuted }]}>Where did you study?</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>College/University Name</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="Stanford University"
                placeholderTextColor={activeColors.textMuted}
                value={formData.education.college}
                onChangeText={(val) => handleTextChange('education', 'college', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Degree</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="B.Tech / B.E / B.S"
                placeholderTextColor={activeColors.textMuted}
                value={formData.education.degree}
                onChangeText={(val) => handleTextChange('education', 'degree', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Branch / Major</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="Computer Science & Engineering"
                placeholderTextColor={activeColors.textMuted}
                value={formData.education.branch}
                onChangeText={(val) => handleTextChange('education', 'branch', val)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.s }]}>
                <Text style={[styles.label, { color: activeColors.text }]}>CGPA / Percentage</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                  placeholder="9.2 or 92%"
                  placeholderTextColor={activeColors.textMuted}
                  value={formData.education.cgpa}
                  onChangeText={(val) => handleTextChange('education', 'cgpa', val)}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.s }]}>
                <Text style={[styles.label, { color: activeColors.text }]}>Passing Year</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                  placeholder="2026"
                  placeholderTextColor={activeColors.textMuted}
                  keyboardType="numeric"
                  value={formData.education.passingYear}
                  onChangeText={(val) => handleTextChange('education', 'passingYear', val)}
                />
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: activeColors.text }]}>Skills & DSA Level</Text>
            <Text style={[styles.stepSubtitle, { color: activeColors.textMuted }]}>Highlight your tech stack and expertise.</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Programming Languages</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="C++, Java, Python, JavaScript"
                placeholderTextColor={activeColors.textMuted}
                value={formData.skills.languages}
                onChangeText={(val) => handleTextChange('skills', 'languages', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Frameworks & Libraries</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="React Native, Node.js, Express, Django"
                placeholderTextColor={activeColors.textMuted}
                value={formData.skills.frameworks}
                onChangeText={(val) => handleTextChange('skills', 'frameworks', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Developer Tools</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                placeholder="Git, Docker, VS Code, AWS"
                placeholderTextColor={activeColors.textMuted}
                value={formData.skills.tools}
                onChangeText={(val) => handleTextChange('skills', 'tools', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>DSA Level</Text>
              <View style={styles.badgeRow}>
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                  const isSelected = formData.skills.dsaLevel === level;
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.levelBadge,
                        { borderColor: activeColors.inputBorder },
                        isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                      ]}
                      onPress={() => handleTextChange('skills', 'dsaLevel', level)}
                    >
                      <Text style={[
                        styles.levelBadgeText, 
                        { color: isSelected ? '#fff' : activeColors.text }
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.stepTitle, { color: activeColors.text }]}>Projects</Text>
                <Text style={[styles.stepSubtitle, { color: activeColors.textMuted }]}>Showcase your coding projects.</Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => addArrayItem('projects')}
              >
                <Plus size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add Project</Text>
              </TouchableOpacity>
            </View>

            {formData.projects.map((proj, index) => (
              <Card key={index} style={styles.formCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.formCardNumber, { color: colors.primary }]}>Project #{index + 1}</Text>
                  {formData.projects.length > 1 && (
                    <TouchableOpacity onPress={() => removeArrayItem('projects', index)}>
                      <Trash2 size={18} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: activeColors.text }]}>Project Name</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                    placeholder="E-commerce Web App"
                    placeholderTextColor={activeColors.textMuted}
                    value={proj.name}
                    onChangeText={(val) => handleArrayItemChange('projects', index, 'name', val)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: activeColors.text }]}>Tech Stack Used</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                    placeholder="React, Redux, Node.js, MongoDB"
                    placeholderTextColor={activeColors.textMuted}
                    value={proj.techStack}
                    onChangeText={(val) => handleArrayItemChange('projects', index, 'techStack', val)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: activeColors.text }]}>Raw Description (What did you build?)</Text>
                  <TextInput 
                    style={[
                      styles.input, 
                      styles.textArea, 
                      { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }
                    ]}
                    placeholder="I made an e-commerce website using react. It has secure login and payments integration. I also optimized database queries."
                    placeholderTextColor={activeColors.textMuted}
                    multiline
                    numberOfLines={4}
                    value={proj.description}
                    onChangeText={(val) => handleArrayItemChange('projects', index, 'description', val)}
                  />
                </View>

                {proj.refinedPoints && proj.refinedPoints.length > 0 ? (
                  <View style={styles.refinedPreviewContainer}>
                    <Text style={[styles.refinedLabel, { color: colors.accent }]}>✨ Professional AI Resume Points:</Text>
                    {proj.refinedPoints.map((pt, pIdx) => (
                      <Text key={pIdx} style={[styles.refinedPointText, { color: activeColors.text }]}>• {pt}</Text>
                    ))}
                  </View>
                ) : null}

                <TouchableOpacity 
                  style={[styles.aiButton, { backgroundColor: colors.accent }]}
                  onPress={() => handleAIRefinement('projects', index)}
                  disabled={isRefining.type === 'projects' && isRefining.index === index}
                >
                  {isRefining.type === 'projects' && isRefining.index === index ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Sparkles size={16} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={styles.aiButtonText}>Optimize Description with AI</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.stepTitle, { color: activeColors.text }]}>Experience (Optional)</Text>
                <Text style={[styles.stepSubtitle, { color: activeColors.textMuted }]}>Include internships or job experience.</Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => addArrayItem('experience')}
              >
                <Plus size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add Experience</Text>
              </TouchableOpacity>
            </View>

            {formData.experience.map((exp, index) => (
              <Card key={index} style={styles.formCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.formCardNumber, { color: colors.primary }]}>Job Record #{index + 1}</Text>
                  {formData.experience.length > 1 && (
                    <TouchableOpacity onPress={() => removeArrayItem('experience', index)}>
                      <Trash2 size={18} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: activeColors.text }]}>Job Title / Role</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                    placeholder="Software Engineering Intern"
                    placeholderTextColor={activeColors.textMuted}
                    value={exp.title}
                    onChangeText={(val) => handleArrayItemChange('experience', index, 'title', val)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: activeColors.text }]}>Company Name</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                    placeholder="Google / Acme Corp"
                    placeholderTextColor={activeColors.textMuted}
                    value={exp.company}
                    onChangeText={(val) => handleArrayItemChange('experience', index, 'company', val)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: activeColors.text }]}>Duration</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }]}
                    placeholder="May 2025 - August 2025"
                    placeholderTextColor={activeColors.textMuted}
                    value={exp.duration}
                    onChangeText={(val) => handleArrayItemChange('experience', index, 'duration', val)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: activeColors.text }]}>Raw Description (What did you achieve?)</Text>
                  <TextInput 
                    style={[
                      styles.input, 
                      styles.textArea, 
                      { backgroundColor: activeColors.inputBg, borderColor: activeColors.inputBorder, color: activeColors.text }
                    ]}
                    placeholder="I worked on the backend API development. I resolved bugs and improved code test coverage."
                    placeholderTextColor={activeColors.textMuted}
                    multiline
                    numberOfLines={4}
                    value={exp.description}
                    onChangeText={(val) => handleArrayItemChange('experience', index, 'description', val)}
                  />
                </View>

                {exp.refinedPoints && exp.refinedPoints.length > 0 ? (
                  <View style={styles.refinedPreviewContainer}>
                    <Text style={[styles.refinedLabel, { color: colors.accent }]}>✨ Professional AI Resume Points:</Text>
                    {exp.refinedPoints.map((pt, pIdx) => (
                      <Text key={pIdx} style={[styles.refinedPointText, { color: activeColors.text }]}>• {pt}</Text>
                    ))}
                  </View>
                ) : null}

                <TouchableOpacity 
                  style={[styles.aiButton, { backgroundColor: colors.accent }]}
                  onPress={() => handleAIRefinement('experience', index)}
                  disabled={isRefining.type === 'experience' && isRefining.index === index}
                >
                  {isRefining.type === 'experience' && isRefining.index === index ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Sparkles size={16} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={styles.aiButtonText}>Optimize Description with AI</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: activeColors.text }]}>Review & Finalize</Text>
            <Text style={[styles.stepSubtitle, { color: activeColors.textMuted }]}>Your professional resume preview.</Text>
            
            <Card style={[styles.previewPaper, { backgroundColor: '#fff', borderColor: '#e2e8f0' }]}>
              {/* Header */}
              <View style={styles.previewHeader}>
                <Text style={styles.previewName}>{formData.personal.name || 'Your Name'}</Text>
                <Text style={styles.previewContact}>
                  {formData.personal.email || 'email@example.com'} | {formData.personal.phone || 'Phone'}
                </Text>
                <Text style={styles.previewContact}>
                  {formData.personal.linkedin || 'linkedin'} | {formData.personal.github || 'github'} | {formData.personal.portfolio || 'portfolio'}
                </Text>
              </View>

              <View style={styles.previewDivider} />

              {/* Education */}
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>EDUCATION</Text>
                <View style={styles.previewRow}>
                  <Text style={styles.previewTextBold}>{formData.education.college || 'College/University Name'}</Text>
                  <Text style={styles.previewTextMuted}>{formData.education.passingYear || 'Year'}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewText}>{formData.education.degree || 'Degree'} in {formData.education.branch || 'Branch'}</Text>
                  <Text style={styles.previewTextBold}>CGPA: {formData.education.cgpa || 'CGPA'}</Text>
                </View>
              </View>

              <View style={styles.previewDivider} />

              {/* Skills */}
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>SKILLS</Text>
                <Text style={styles.previewText}><Text style={styles.previewTextBold}>Languages: </Text>{formData.skills.languages || 'C++, Python'}</Text>
                <Text style={styles.previewText}><Text style={styles.previewTextBold}>Frameworks: </Text>{formData.skills.frameworks || 'React'}</Text>
                <Text style={styles.previewText}><Text style={styles.previewTextBold}>Tools: </Text>{formData.skills.tools || 'Git, VS Code'}</Text>
                <Text style={styles.previewText}><Text style={styles.previewTextBold}>DSA Level: </Text>{formData.skills.dsaLevel || 'Beginner'}</Text>
              </View>

              <View style={styles.previewDivider} />

              {/* Projects */}
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>PROJECTS</Text>
                {formData.projects.map((proj, pIdx) => (
                  <View key={pIdx} style={{ marginBottom: 8 }}>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewTextBold}>{proj.name || 'Project Name'}</Text>
                      <Text style={styles.previewTextItalic}>{proj.techStack || 'Tech Stack'}</Text>
                    </View>
                    {proj.refinedPoints && proj.refinedPoints.length > 0 ? (
                      proj.refinedPoints.map((pt, ptIdx) => (
                        <Text key={ptIdx} style={styles.previewBullet}>• {pt}</Text>
                      ))
                    ) : (
                      <Text style={styles.previewBullet}>• {proj.description || 'Project Description'}</Text>
                    )}
                  </View>
                ))}
              </View>

              {/* Experience */}
              {formData.experience.length > 0 && formData.experience[0].title ? (
                <>
                  <View style={styles.previewDivider} />
                  <View style={styles.previewSection}>
                    <Text style={styles.previewSectionTitle}>EXPERIENCE</Text>
                    {formData.experience.map((exp, eIdx) => (
                      <View key={eIdx} style={{ marginBottom: 8 }}>
                        <View style={styles.previewRow}>
                          <Text style={styles.previewTextBold}>{exp.title || 'Role'} - {exp.company || 'Company'}</Text>
                          <Text style={styles.previewTextMuted}>{exp.duration || 'Duration'}</Text>
                        </View>
                        {exp.refinedPoints && exp.refinedPoints.length > 0 ? (
                          exp.refinedPoints.map((pt, ptIdx) => (
                            <Text key={ptIdx} style={styles.previewBullet}>• {pt}</Text>
                          ))
                        ) : (
                          <Text style={styles.previewBullet}>• {exp.description || 'Experience Description'}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                </>
              ) : null}
            </Card>

            <TouchableOpacity 
              style={[styles.downloadButton, { backgroundColor: colors.primary }]}
              onPress={triggerMockDownload}
            >
              <Download size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.downloadButtonText}>Download Resume PDF</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  if (isBuilding) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
        <View style={[styles.wizardHeader, { borderBottomColor: activeColors.border }]}>
          <TouchableOpacity onPress={() => {
            Alert.alert(
              "Exit Builder?",
              "Any unsaved step changes will be lost.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Exit", onPress: () => setIsBuilding(false) }
              ]
            );
          }}>
            <Text style={{ color: colors.error, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.wizardStepText, { color: activeColors.text }]}>Step {currentStep} of 6</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.stepProgressContainer}>
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <View 
              key={step} 
              style={[
                styles.stepDot, 
                { backgroundColor: activeColors.border },
                step <= currentStep && { backgroundColor: colors.primary }
              ]} 
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {renderStepContent()}
        </ScrollView>

        {/* Action Bar */}
        <View style={[styles.actionBar, { backgroundColor: activeColors.card, borderTopColor: activeColors.border }]}>
          {currentStep > 1 ? (
            <TouchableOpacity 
              style={[styles.navButton, { borderColor: activeColors.border }]} 
              onPress={handlePrevStep}
            >
              <ArrowLeft size={18} color={activeColors.text} />
              <Text style={[styles.navButtonText, { color: activeColors.text, marginLeft: 6 }]}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 80 }} />
          )}

          {currentStep < 6 ? (
            <TouchableOpacity 
              style={[styles.navButton, { backgroundColor: colors.primary, borderColor: colors.primary }]} 
              onPress={handleNextStep}
            >
              <Text style={[styles.navButtonText, { color: '#fff', marginRight: 6 }]}>Next</Text>
              <ArrowRight size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.navButton, { backgroundColor: colors.accent, borderColor: colors.accent }]} 
              onPress={finalizeResume}
            >
              <Text style={[styles.navButtonText, { color: '#fff', marginRight: 6 }]}>Finish</Text>
              <FileCheck size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: activeColors.text }]}>
            AI Resume Builder
          </Text>
          <Text style={{ color: activeColors.textMuted }}>
            Generate a professional, placement-ready resume with AI guidance.
          </Text>
        </View>

        <Card style={styles.scoreCard}>
          <Text style={[styles.scoreTitle, { color: activeColors.text }]}>
            Resume Readiness Score
          </Text>
          <Text style={[styles.scoreValue, { color: progress === 1 ? colors.accent : colors.primary }]}>
            {Math.round(progress * 100)}%
          </Text>
          <ProgressBar progress={progress} />
          {progress === 1 && (
            <Text style={{ color: colors.accent, marginTop: 8, fontWeight: 'bold' }}>
              🎉 Your resume sections are complete and verified!
            </Text>
          )}
        </Card>

        {/* Launch Button */}
        <TouchableOpacity 
          style={styles.launchButton} 
          onPress={() => {
            setFormData(resumeBuilderData);
            setCurrentStep(1);
            setIsBuilding(true);
          }}
        >
          <Sparkles size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.launchButtonText}>✨ Launch Guided AI Resume Builder</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
          Manual Checklist
        </Text>

        <Card>
          {sections.map((section, index) => {
            const isDone = resumeScore[section];
            return (
              <TouchableOpacity 
                key={section} 
                style={[
                  styles.checklistItem, 
                  index !== sections.length - 1 && { 
                    borderBottomWidth: 1, 
                    borderBottomColor: activeColors.border 
                  }
                ]}
                onPress={() => toggleSection(section)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.checklistText, 
                  { color: activeColors.text },
                  isDone && { color: activeColors.textMuted, textDecorationLine: 'line-through' }
                ]}>
                  {section}
                </Text>
                {isDone ? (
                  <CheckCircle2 color={colors.accent} size={24} />
                ) : (
                  <Circle color={activeColors.border} size={24} />
                )}
              </TouchableOpacity>
            );
          })}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.m },
  header: { marginBottom: spacing.l },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  scoreCard: { marginBottom: spacing.m, padding: spacing.l },
  scoreTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  scoreValue: { fontSize: 36, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.s },
  checklistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
  },
  checklistText: { fontSize: 16, fontWeight: '500' },
  
  // Launch button
  launchButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderRadius: borderRadius.m,
    marginBottom: spacing.l,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  launchButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Wizard Header
  wizardHeader: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    borderBottomWidth: 1,
  },
  wizardStepText: { fontSize: 16, fontWeight: 'bold' },
  stepProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
  },
  stepDot: { flex: 1, height: 4, marginHorizontal: 2, borderRadius: 2 },

  // Steps style
  stepContainer: { paddingBottom: 100 },
  stepTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  stepSubtitle: { fontSize: 14, marginBottom: spacing.l },
  
  inputGroup: { marginBottom: spacing.m },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.s,
    paddingHorizontal: spacing.m,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.s,
    textAlignVertical: 'top',
  },
  badgeRow: { flexDirection: 'row', marginTop: spacing.xs },
  levelBadge: {
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    marginRight: spacing.s,
  },
  levelBadgeText: { fontSize: 14, fontWeight: '600' },

  // Array items
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  addButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.s,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginLeft: 4 },
  formCard: { padding: spacing.m, marginBottom: spacing.m },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  formCardNumber: { fontSize: 15, fontWeight: 'bold' },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.s,
    borderRadius: borderRadius.s,
    marginTop: spacing.s,
  },
  aiButtonText: { color: '#fff', fontWeight: 'bold' },
  refinedPreviewContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: borderRadius.s,
    padding: spacing.s,
    marginTop: spacing.s,
  },
  refinedLabel: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  refinedPointText: { fontSize: 13, lineHeight: 18, marginBottom: 4 },

  // Preview Paper
  previewPaper: {
    padding: spacing.l,
    borderRadius: borderRadius.s,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: spacing.l,
  },
  previewHeader: { alignItems: 'center', marginBottom: 12 },
  previewName: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  previewContact: { fontSize: 10, color: '#64748b' },
  previewDivider: { height: 1, backgroundColor: '#cbd5e1', marginVertical: 12 },
  previewSection: { marginBottom: 12 },
  previewSectionTitle: { fontSize: 12, fontWeight: 'bold', color: colors.primary, marginBottom: 6, letterSpacing: 1 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  previewTextBold: { fontSize: 11, fontWeight: 'bold', color: '#1e293b' },
  previewTextItalic: { fontSize: 10, fontStyle: 'italic', color: '#64748b' },
  previewText: { fontSize: 10, color: '#334155' },
  previewTextMuted: { fontSize: 10, color: '#64748b' },
  previewBullet: { fontSize: 10, color: '#334155', paddingLeft: 8, lineHeight: 14 },
  
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderRadius: borderRadius.s,
  },
  downloadButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Action Bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.s,
    borderWidth: 1,
  },
  navButtonText: { fontSize: 15, fontWeight: 'bold' },
});

export default ResumeScreen;
