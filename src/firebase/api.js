import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, isFirebaseConfigured } from './config';

// Mock database for testing when Firebase isn't set up yet
let mockQuestions = [
  // DSA - Arrays
  {
    id: 'dsa-arr-1',
    type: 'DSA',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    companyTags: ['Amazon', 'Google', 'TCS'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    solutionLink: 'https://leetcode.com/problems/two-sum/',
    notes: 'Use a hash map for O(n) time complexity.',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  {
    id: 'dsa-arr-2',
    type: 'DSA',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topic: 'Arrays',
    companyTags: ['Google', 'Adobe'],
    description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    solutionLink: 'https://leetcode.com/problems/container-with-most-water/',
    notes: 'Use two-pointer approach.',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  // DSA - Strings
  {
    id: 'dsa-str-1',
    type: 'DSA',
    title: 'Reverse String',
    difficulty: 'Easy',
    topic: 'Strings',
    companyTags: ['TCS', 'Infosys'],
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    solutionLink: 'https://leetcode.com/problems/reverse-string/',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  {
    id: 'dsa-str-2',
    type: 'DSA',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Strings',
    companyTags: ['Amazon', 'Microsoft'],
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    solutionLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  // DSA - Linked List
  {
    id: 'dsa-ll-1',
    type: 'DSA',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topic: 'Linked List',
    companyTags: ['Amazon', 'Adobe', 'TCS'],
    description: 'Given the head of a singly linked list, reverse the list, and return its reversed list.',
    solutionLink: 'https://leetcode.com/problems/reverse-linked-list/',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  // DSA - Stack & Queue
  {
    id: 'dsa-sq-1',
    type: 'DSA',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    companyTags: ['Google', 'Microsoft', 'TCS'],
    description: 'Given a string s containing just the characters brackets, determine if the input string is valid.',
    solutionLink: 'https://leetcode.com/problems/valid-parentheses/',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  // DSA - Trees
  {
    id: 'dsa-tr-1',
    type: 'DSA',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topic: 'Binary Tree',
    companyTags: ['Google', 'Amazon'],
    description: 'Given the root of a binary tree, return its maximum depth.',
    solutionLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  // DSA - Graph
  {
    id: 'dsa-gr-1',
    type: 'DSA',
    title: 'Number of Islands',
    difficulty: 'Medium',
    topic: 'Graph',
    companyTags: ['Amazon', 'Microsoft', 'Google'],
    description: 'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
    solutionLink: 'https://leetcode.com/problems/number-of-islands/',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  // DSA - Dynamic Programming
  {
    id: 'dsa-dp-1',
    type: 'DSA',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    companyTags: ['TCS', 'Infosys', 'Wipro'],
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    solutionLink: 'https://leetcode.com/problems/climbing-stairs/',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  {
    id: 'dsa-dp-2',
    type: 'DSA',
    title: '0-1 Knapsack Problem',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    companyTags: ['Amazon', 'Google'],
    description: 'Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack.',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },

  // Aptitude - Quantitative
  {
    id: 'apt-q-1',
    type: 'Aptitude',
    title: 'Average Speed of Train',
    content: 'If a train travels 60 km/h for 2 hours and then 80 km/h for 3 hours, what is its average speed?',
    difficulty: 'Medium',
    topic: 'Time Speed Distance',
    companyTags: ['TCS', 'Infosys'],
    answerExplanation: 'Total distance = (60*2) + (80*3) = 120 + 240 = 360 km. Total time = 5 hours. Average speed = 360 / 5 = 72 km/h.',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  {
    id: 'apt-q-2',
    type: 'Aptitude',
    title: 'Work and Time',
    content: 'A can do a work in 10 days and B in 15 days. If they work together, in how many days will the work be completed?',
    difficulty: 'Easy',
    topic: 'Time & Work',
    companyTags: ['TCS', 'Wipro'],
    answerExplanation: 'A\'s 1 day work = 1/10. B\'s 1 day work = 1/15. Together 1 day work = 1/10 + 1/15 = 5/30 = 1/6. So they complete the work in 6 days.',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  // Aptitude - Logical Reasoning
  {
    id: 'apt-l-1',
    type: 'Aptitude',
    title: 'Number Series',
    content: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    difficulty: 'Easy',
    topic: 'Number Series',
    companyTags: ['Infosys', 'Cognizant'],
    answerExplanation: 'The differences are consecutive even numbers: 6-2=4, 12-6=6, 20-12=8, 30-20=10. The next difference should be 12. So, 30 + 12 = 42.',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  },
  // Aptitude - Verbal Ability
  {
    id: 'apt-v-1',
    type: 'Aptitude',
    title: 'Synonym Finder',
    content: 'Find the synonym of the word "ABANDON":',
    difficulty: 'Easy',
    topic: 'Synonyms',
    companyTags: ['TCS', 'Wipro'],
    answerExplanation: 'ABANDON means to leave completely or desert. Therefore, "Forsake" or "Discard" is a synonym.',
    createdAt: new Date().toISOString(),
    authorId: 'system',
  }
];

export const addQuestion = async (questionData) => {
  if (isFirebaseConfigured) {
    try {
      const qData = {
        ...questionData,
        createdAt: questionData.createdAt || serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'questions'), qData);
      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  } else {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newQuestion = {
          id: questionData.id || Math.random().toString(36).substring(7),
          createdAt: questionData.createdAt || new Date().toISOString(),
          ...questionData,
        };
        mockQuestions = [newQuestion, ...mockQuestions];
        resolve(newQuestion.id);
      }, 800);
    });
  }
};

export const deleteQuestionFromMock = async (questionId) => {
  if (isFirebaseConfigured) {
    try {
      // In firebase we would delete the document
    } catch (e) {
      console.error("Error deleting mock question: ", e);
    }
  } else {
    mockQuestions = mockQuestions.filter(q => q.id !== questionId);
  }
};

export const getQuestions = async () => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const questions = [];
      querySnapshot.forEach((doc) => {
        questions.push({ id: doc.id, ...doc.data() });
      });
      return questions;
    } catch (e) {
      console.error("Error getting documents: ", e);
      throw e;
    }
  } else {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockQuestions]);
      }, 500);
    });
  }
};

export const signInWithGoogle = async () => {
  if (isFirebaseConfigured && auth) {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      return {
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email,
        photoURL: user.photoURL || null,
      };
    } catch (error) {
      console.error("Firebase Google Sign-In error:", error);
      throw error;
    }
  } else {
    // Mock login for localhost testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uid: 'mock-google-uid-123',
          name: 'Sarbottam',
          email: 'sarbottam@example.com',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
        });
      }, 1000);
    });
  }
};

export const logoutUser = async () => {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase Sign-Out error:", error);
      throw error;
    }
  }
};

// Firestore helper functions for user-specific data tracking
export const saveUserData = async (uid, field, data) => {
  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'users', uid), { [field]: data }, { merge: true });
    } catch (e) {
      console.error(`Error saving user data for ${field}:`, e);
    }
  }
};

export const getUserData = async (uid) => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data();
      }
    } catch (e) {
      console.error("Error getting user data:", e);
    }
  }
  return null;
};

export const saveUserQuestion = async (uid, question) => {
  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'users', uid, 'questions'), question);
      return docRef.id;
    } catch (e) {
      console.error("Error saving user question to Firestore:", e);
    }
  }
  return null;
};

export const getUserQuestions = async (uid) => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'questions'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error("Error getting user questions from Firestore:", e);
    }
  }
  return [];
};

export const deleteUserQuestion = async (uid, questionId) => {
  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'questions', questionId));
    } catch (e) {
      console.error("Error deleting user question from Firestore:", e);
    }
  }
};
