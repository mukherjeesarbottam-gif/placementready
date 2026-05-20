import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { 
  getQuestions, 
  logoutUser, 
  saveUserData, 
  getUserData, 
  saveUserQuestion, 
  getUserQuestions, 
  deleteUserQuestion 
} from '../firebase/api';
import { auth, isFirebaseConfigured } from '../firebase/config';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || 'light');
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  const [resumeScore, setResumeScore] = useState({
    Education: false,
    Skills: false,
    Projects: false,
    Experience: false,
    Achievements: false,
  });

  const [streak, setStreak] = useState(0);

  const [resumeBuilderData, setResumeBuilderData] = useState({
    personal: { name: '', email: '', phone: '', linkedin: '', github: '', portfolio: '' },
    education: { college: '', degree: '', branch: '', cgpa: '', passingYear: '' },
    skills: { languages: '', frameworks: '', tools: '', dsaLevel: 'Beginner' },
    projects: [{ name: '', techStack: '', description: '', refinedPoints: [] }],
    experience: [{ title: '', company: '', duration: '', description: '', refinedPoints: [] }],
  });

  // Community Progress
  const [communityProgress, setCommunityProgress] = useState({
    solvedQuestions: [], // array of question IDs
    xp: 0
  });

  const [plannerTasks, setPlannerTasks] = useState([
    { id: 1, title: 'Solve 2 DSA questions', completed: false },
    { id: 2, title: 'Practice aptitude for 20 mins', completed: false },
    { id: 3, title: 'Update resume', completed: false },
    { id: 4, title: 'Revise one Core CS topic', completed: false },
  ]);

  // Load questions
  const loadQuestions = async (userId = 'guest') => {
    try {
      const data = await getQuestions();
      let customQuestions = [];
      if (isFirebaseConfigured) {
        customQuestions = await getUserQuestions(userId);
      } else {
        const storedCustomQuestions = await AsyncStorage.getItem(`customQuestions_${userId}`);
        customQuestions = storedCustomQuestions ? JSON.parse(storedCustomQuestions) : [];
      }
      
      const allQs = [...customQuestions, ...data];
      const uniqueQs = allQs.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      
      setQuestions(uniqueQs);
    } catch (e) {
      console.error('Failed to load questions in context', e);
    }
  };

  // Helper to load user-specific progress, resume, planner, and questions
  const loadUserData = async (userId) => {
    try {
      // 1. Load custom questions
      await loadQuestions(userId);

      // 2. Fetch progress, resume score, and planner from Firestore or AsyncStorage
      let progressData = { solvedQuestions: [], xp: 0 };
      let resumeData = {
        Education: false,
        Skills: false,
        Projects: false,
        Experience: false,
        Achievements: false,
      };
      let plannerData = [
        { id: 1, title: 'Solve 2 DSA questions', completed: false },
        { id: 2, title: 'Practice aptitude for 20 mins', completed: false },
        { id: 3, title: 'Update resume', completed: false },
        { id: 4, title: 'Revise one Core CS topic', completed: false },
      ];
      let builderData = {
        personal: { name: '', email: '', phone: '', linkedin: '', github: '', portfolio: '' },
        education: { college: '', degree: '', branch: '', cgpa: '', passingYear: '' },
        skills: { languages: '', frameworks: '', tools: '', dsaLevel: 'Beginner' },
        projects: [{ name: '', techStack: '', description: '', refinedPoints: [] }],
        experience: [{ title: '', company: '', duration: '', description: '', refinedPoints: [] }],
      };

      if (isFirebaseConfigured) {
        const firestoreData = await getUserData(userId);
        if (firestoreData) {
          if (firestoreData.progress) progressData = firestoreData.progress;
          if (firestoreData.resumeScore) resumeData = firestoreData.resumeScore;
          if (firestoreData.plannerTasks) plannerData = firestoreData.plannerTasks;
          if (firestoreData.resumeBuilder) builderData = firestoreData.resumeBuilder;
        }
      } else {
        const storedProgress = await AsyncStorage.getItem(`communityProgress_${userId}`);
        if (storedProgress) progressData = JSON.parse(storedProgress);

        const storedResume = await AsyncStorage.getItem(`resumeScore_${userId}`);
        if (storedResume) resumeData = JSON.parse(storedResume);

        const storedPlanner = await AsyncStorage.getItem(`plannerTasks_${userId}`);
        if (storedPlanner) plannerData = JSON.parse(storedPlanner);

        const storedBuilder = await AsyncStorage.getItem(`resumeBuilder_${userId}`);
        if (storedBuilder) builderData = JSON.parse(storedBuilder);
      }

      setCommunityProgress(progressData);
      setResumeScore(resumeData);
      setPlannerTasks(plannerData);
      setResumeBuilderData(builderData);
    } catch (e) {
      console.error("AppContext: Failed to load user data: ", e);
    }
  };

  // Set up Firebase Auth state listener if Firebase is configured
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in via Firebase Auth
        const storedProfile = await AsyncStorage.getItem('userProfile');
        let localProfile = {};
        if (storedProfile) {
          localProfile = JSON.parse(storedProfile);
        }

        const newProfile = {
          ...localProfile,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || localProfile.name || 'Google User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || localProfile.photoURL || null,
          isLoggedIn: true,
        };

        setUserProfile(newProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
        await saveUserData(firebaseUser.uid, 'profile', newProfile);
      } else {
        // Only reset if they were previously logged in via Real Firebase
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          if (profile.uid && profile.uid !== 'mock-google-uid-123') {
            setUserProfile(null);
            await AsyncStorage.removeItem('userProfile');
          }
        }
      }
    });

    return unsubscribe;
  }, []);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        const storedTheme = await AsyncStorage.getItem('theme');
        const storedStreak = await AsyncStorage.getItem('streak');

        let profile = null;
        if (storedProfile) {
          profile = JSON.parse(storedProfile);
          setUserProfile(profile);
        }
        
        if (storedTheme) setTheme(storedTheme);
        if (storedStreak) setStreak(JSON.parse(storedStreak));

        // Load user-specific progress, questions, resume, planner
        const userId = profile?.uid || 'guest';
        await loadUserData(userId);
      } catch (e) {
        console.error('Failed to load local data', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // React to userProfile changes (e.g. login / logout) to switch progress context
  useEffect(() => {
    if (isLoading) return;
    const switchUserContext = async () => {
      const userId = userProfile?.uid || 'guest';
      await loadUserData(userId);
    };
    switchUserContext();
  }, [userProfile]);

  // Compute DSA Progress dynamically
  const dsaTopics = [
    // Basics
    'Time Complexity', 'Space Complexity', 'Big O Analysis', 'Recursion', 'Bit Manipulation',
    // Linear Structures
    'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Hashing',
    // Trees & Graphs
    'Binary Tree', 'BST', 'Heap', 'Trie', 'Graph', 'BFS', 'DFS',
    // Algorithms
    'Sorting', 'Searching', 'Greedy', 'Backtracking', 'Dynamic Programming', 'Sliding Window', 'Two Pointer', 'Binary Search', 'Prefix Sum',
    // Advanced
    'Segment Tree', 'Union Find (DSU)', 'Graph Algorithms', 'Shortest Path', 'Topological Sort'
  ];
  const calculatedDsaProgress = {};
  dsaTopics.forEach(topic => {
    const topicQuestions = questions.filter(q => q.type === 'DSA' && q.topic === topic);
    const total = topicQuestions.length;
    const completed = topicQuestions.filter(q => communityProgress?.solvedQuestions?.includes(q.id)).length;
    calculatedDsaProgress[topic] = { 
      total: total || 1, // Avoid NaN division
      completed 
    };
  });

  // Compute Aptitude Progress dynamically
  const aptSubtopics = [
    // Quantitative Aptitude
    'Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 'Time & Work', 'Time Speed Distance', 'Ratio & Proportion', 'Average', 'Mixture & Allegation', 'Permutation & Combination', 'Probability', 'Number System', 'HCF & LCM', 'Ages', 'Pipes & Cistern', 'Data Interpretation', 'Mensuration', 'Geometry', 'Algebra', 'Logarithm', 'Clock & Calendar',
    // Logical Reasoning
    'Seating Arrangement', 'Blood Relation', 'Coding Decoding', 'Syllogism', 'Statement & Conclusion', 'Direction Sense', 'Number Series', 'Puzzle', 'Odd One Out', 'Ranking', 'Input Output', 'Data Sufficiency', 'Pattern Recognition',
    // Verbal Ability
    'Reading Comprehension', 'Sentence Correction', 'Para Jumbles', 'Synonyms', 'Antonyms', 'Vocabulary', 'Grammar', 'Fill in the Blanks', 'Error Detection', 'Sentence Arrangement', 'Active Passive', 'Direct Indirect Speech'
  ];
  const calculatedAptitudeProgress = {};
  aptSubtopics.forEach(topic => {
    const topicQuestions = questions.filter(q => q.type === 'Aptitude' && q.topic === topic);
    const total = topicQuestions.length;
    const completed = topicQuestions.filter(q => communityProgress?.solvedQuestions?.includes(q.id)).length;
    calculatedAptitudeProgress[topic] = {
      total: total || 1, // Avoid NaN division
      completed
    };
  });

  const saveProfile = async (profileData) => {
    if (profileData === null) {
      await logout();
      return;
    }
    const updatedProfile = {
      ...(userProfile || {}),
      ...profileData,
    };
    setUserProfile(updatedProfile);
    await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    if (updatedProfile.uid) {
      await saveUserData(updatedProfile.uid, 'profile', updatedProfile);
    }
  };

  const login = async (userData) => {
    const existingProfile = userProfile || {};
    const newProfile = {
      ...existingProfile,
      uid: userData.uid,
      name: userData.name,
      email: userData.email,
      photoURL: userData.photoURL || null,
      isLoggedIn: true,
    };
    setUserProfile(newProfile);
    await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
    await saveUserData(userData.uid, 'profile', newProfile);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Signout Firebase Auth error:", e);
    }
    setUserProfile(null);
    await AsyncStorage.removeItem('userProfile');
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const toggleQuestionSolved = async (questionId) => {
    const solvedQuestions = communityProgress?.solvedQuestions || [];
    const isSolved = solvedQuestions.includes(questionId);
    let newSolved;
    let newXp = communityProgress?.xp || 0;
    
    if (isSolved) {
      newSolved = solvedQuestions.filter(id => id !== questionId);
      newXp = Math.max(0, newXp - 10);
    } else {
      newSolved = [...solvedQuestions, questionId];
      newXp += 10;
    }
    
    const newProgress = {
      solvedQuestions: newSolved,
      xp: newXp
    };
    
    setCommunityProgress(newProgress);
    const userId = userProfile?.uid || 'guest';
    await AsyncStorage.setItem(`communityProgress_${userId}`, JSON.stringify(newProgress));
    await saveUserData(userId, 'progress', newProgress);
  };

  const updateDsaProgress = async (topic, increment) => {
    const topicQuestions = questions.filter(q => q.type === 'DSA' && q.topic === topic);
    const solvedQuestions = communityProgress?.solvedQuestions || [];
    
    if (increment > 0) {
      const unsolved = topicQuestions.find(q => !solvedQuestions.includes(q.id));
      if (unsolved) {
        await toggleQuestionSolved(unsolved.id);
      }
    } else if (increment < 0) {
      const solved = [...topicQuestions].reverse().find(q => solvedQuestions.includes(q.id));
      if (solved) {
        await toggleQuestionSolved(solved.id);
      }
    }
  };

  const updateAptitudeProgress = async (topic, increment) => {
    const topicQuestions = questions.filter(q => q.type === 'Aptitude' && q.topic === topic);
    const solvedQuestions = communityProgress?.solvedQuestions || [];
    
    if (increment > 0) {
      const unsolved = topicQuestions.find(q => !solvedQuestions.includes(q.id));
      if (unsolved) {
        await toggleQuestionSolved(unsolved.id);
      }
    } else if (increment < 0) {
      const solved = [...topicQuestions].reverse().find(q => solvedQuestions.includes(q.id));
      if (solved) {
        await toggleQuestionSolved(solved.id);
      }
    }
  };

  const updateResumeScore = async (section, isCompleted) => {
    const newScore = { ...resumeScore };
    newScore[section] = isCompleted;
    setResumeScore(newScore);
    const userId = userProfile?.uid || 'guest';
    await AsyncStorage.setItem(`resumeScore_${userId}`, JSON.stringify(newScore));
    await saveUserData(userId, 'resumeScore', newScore);
  };

  const markQuestionSolved = async (questionId) => {
    const solvedQuestions = communityProgress?.solvedQuestions || [];
    if (solvedQuestions.includes(questionId)) return;
    
    const newProgress = {
      solvedQuestions: [...solvedQuestions, questionId],
      xp: (communityProgress?.xp || 0) + 10
    };
    
    setCommunityProgress(newProgress);
    const userId = userProfile?.uid || 'guest';
    await AsyncStorage.setItem(`communityProgress_${userId}`, JSON.stringify(newProgress));
    await saveUserData(userId, 'progress', newProgress);
  };

  const uploadQuestion = async (questionData) => {
    console.log("AppContext: uploadQuestion called with: ", questionData);
    try {
      const newQuestion = {
        ...questionData,
        id: 'custom-' + Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString()
      };

      console.log("AppContext: generated newQuestion: ", newQuestion);
      
      // Synchronously update context state so it's instantly visible in all lists
      setQuestions(prevQuestions => [newQuestion, ...prevQuestions]);
      
      // Persist locally to AsyncStorage in background
      const userId = userProfile?.uid || 'guest';
      const storedCustomQuestions = await AsyncStorage.getItem(`customQuestions_${userId}`);
      const customQuestions = storedCustomQuestions ? JSON.parse(storedCustomQuestions) : [];
      const updatedCustom = [newQuestion, ...customQuestions];
      await AsyncStorage.setItem(`customQuestions_${userId}`, JSON.stringify(updatedCustom));
      
      // Persist to Firebase if configured
      if (isFirebaseConfigured) {
        try {
          await saveUserQuestion(userId, newQuestion);
        } catch (err) {
          console.warn('AppContext: Could not upload to Firestore:', err);
        }
      } else {
        // Persist to mock API/Firebase in memory in background
        try {
          await addQuestion(newQuestion);
        } catch (err) {
          console.warn('AppContext: Could not upload to mock database:', err);
        }
      }
    } catch (e) {
      console.error('AppContext: Failed to upload question: ', e);
      throw e;
    }
  };

  const deleteQuestion = async (questionId) => {
    console.log("AppContext: deleteQuestion called with: ", questionId);
    try {
      // 1. Remove from in-memory questions list synchronously
      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));

      // 2. Remove from customQuestions in AsyncStorage
      const userId = userProfile?.uid || 'guest';
      const storedCustomQuestions = await AsyncStorage.getItem(`customQuestions_${userId}`);
      const customQuestions = storedCustomQuestions ? JSON.parse(storedCustomQuestions) : [];
      const updatedCustom = customQuestions.filter(q => q.id !== questionId);
      await AsyncStorage.setItem(`customQuestions_${userId}`, JSON.stringify(updatedCustom));

      // 3. If it was solved, remove it from solvedQuestions to update stats
      const solvedQuestions = communityProgress?.solvedQuestions || [];
      if (solvedQuestions.includes(questionId)) {
        const newSolved = solvedQuestions.filter(id => id !== questionId);
        const newXp = Math.max(0, (communityProgress?.xp || 0) - 10);
        const newProgress = {
          solvedQuestions: newSolved,
          xp: newXp
        };
        setCommunityProgress(newProgress);
        await AsyncStorage.setItem(`communityProgress_${userId}`, JSON.stringify(newProgress));
        await saveUserData(userId, 'progress', newProgress);
        console.log("AppContext: Removed question from solved list. Updated communityProgress.");
      }

      // 4. Delete from mock memory database or real Firestore
      if (isFirebaseConfigured) {
        try {
          await deleteUserQuestion(userId, questionId);
        } catch (err) {
          console.warn('AppContext: Could not delete from Firestore:', err);
        }
      } else {
        try {
          await deleteQuestionFromMock(questionId);
        } catch (err) {
          console.warn('AppContext: Could not delete from mock database:', err);
        }
      }
    } catch (e) {
      console.error('AppContext: Failed to delete question: ', e);
      throw e;
    }
  };

  const togglePlannerTask = async (taskId) => {
    const updatedTasks = plannerTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setPlannerTasks(updatedTasks);
    const userId = userProfile?.uid || 'guest';
    await AsyncStorage.setItem(`plannerTasks_${userId}`, JSON.stringify(updatedTasks));
    await saveUserData(userId, 'plannerTasks', updatedTasks);
  };

  const saveResumeBuilderData = async (newData) => {
    setResumeBuilderData(newData);
    const userId = userProfile?.uid || 'guest';
    await AsyncStorage.setItem(`resumeBuilder_${userId}`, JSON.stringify(newData));
    await saveUserData(userId, 'resumeBuilder', newData);
  };

  const value = {
    theme,
    toggleTheme,
    userProfile,
    saveProfile,
    isLoading,
    dsaProgress: calculatedDsaProgress,
    updateDsaProgress,
    aptitudeProgress: calculatedAptitudeProgress,
    updateAptitudeProgress,
    resumeScore,
    updateResumeScore,
    streak,
    communityProgress,
    markQuestionSolved,
    toggleQuestionSolved,
    questions,
    loadQuestions,
    uploadQuestion,
    deleteQuestion,
    login,
    logout,
    plannerTasks,
    togglePlannerTask,
    resumeBuilderData,
    saveResumeBuilderData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

