import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Briefcase, ChevronRight } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';
import { colors, spacing, borderRadius } from '../theme/theme';
import { signInWithGoogle } from '../firebase/api';

const LoginScreen = () => {
  const { theme, login } = useContext(AppContext);
  const isDark = theme === 'dark';
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      const user = await signInWithGoogle();
      if (login) {
        await login(user);
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("Login Failed", error.message || "An error occurred during Google Sign-In. Please try again.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoadingGuest(true);
    try {
      const guestUser = {
        uid: 'guest-' + Math.random().toString(36).substring(7),
        name: 'Guest User',
        email: 'guest@placeready.com',
        photoURL: null,
        isGuest: true
      };
      if (login) {
        await login(guestUser);
      }
    } catch (error) {
      console.error("Guest login error:", error);
      Alert.alert("Login Failed", "Failed to login as Guest. Please try again.");
    } finally {
      setLoadingGuest(false);
    }
  };

  const cardBg = isDark ? '#1F2937' : '#FFFFFF';
  const textCol = isDark ? colors.text.dark : colors.text.light;
  const textMutedCol = isDark ? colors.textMuted.dark : colors.textMuted.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
      <LinearGradient
        colors={isDark ? ['#1E1B4B', '#111827', '#111827'] : ['#EEF2FF', '#FFFFFF', '#FFFFFF']}
        style={styles.gradientBg}
      >
        <View style={styles.content}>
          {/* Logo Container */}
          <View style={styles.logoOuterContainer}>
            <LinearGradient
              colors={['#4F46E5', '#3B82F6']}
              style={styles.logoGradient}
            >
              <Briefcase color="#FFFFFF" size={42} strokeWidth={2} />
            </LinearGradient>
            <View style={[styles.logoPulse, { borderColor: isDark ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)' }]} />
          </View>

          {/* Titles */}
          <Text style={[styles.brandText, { color: '#4F46E5' }]}>PlaceReady</Text>
          <Text style={[styles.title, { color: textCol }]}>Welcome to PlaceReady</Text>
          <Text style={[styles.subtitle, { color: textMutedCol }]}>
            Your personal placement preparation platform
          </Text>

          {/* Buttons Area */}
          <View style={styles.buttonsContainer}>
            {/* Google Sign In */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGoogleLogin}
              disabled={loadingGoogle || loadingGuest}
              style={[styles.loginBtn, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1 }]}
            >
              {loadingGoogle ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <View style={styles.btnContentRow}>
                  {/* Google Custom Minimal Vector Logo */}
                  <View style={styles.googleIconContainer}>
                    <Image 
                      source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} 
                      style={styles.googleIconImage} 
                    />
                  </View>
                  <Text style={[styles.loginBtnText, { color: '#1E293B', fontWeight: '600' }]}>
                    Continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Guest Login */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGuestLogin}
              disabled={loadingGoogle || loadingGuest}
              style={[styles.guestBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
            >
              {loadingGuest ? (
                <ActivityIndicator size="small" color={isDark ? '#F9FAFB' : '#4F46E5'} />
              ) : (
                <View style={styles.btnContentRow}>
                  <Text style={[styles.guestBtnText, { color: isDark ? '#E5E7EB' : '#475569' }]}>
                    Continue as Guest
                  </Text>
                  <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer info */}
        <Text style={[styles.footerText, { color: textMutedCol }]}>
          Secure authentication powered by Firebase
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoOuterContainer: {
    position: 'relative',
    marginBottom: spacing.l,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoGradient: {
    width: 86,
    height: 86,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 2,
  },
  logoPulse: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 36,
    borderWidth: 2,
    zIndex: 1,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.s,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.s,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginBottom: spacing.xl * 1.5,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 340,
    gap: 14,
  },
  loginBtn: {
    height: 54,
    borderRadius: borderRadius.l,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  googleIconContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  loginBtnText: {
    fontSize: 16,
  },
  guestBtn: {
    height: 52,
    borderRadius: borderRadius.l,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  }
});

export default LoginScreen;
