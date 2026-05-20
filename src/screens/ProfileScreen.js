import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, Image } from 'react-native';
import { User, LogOut } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';
import { colors, spacing, borderRadius } from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';

const ProfileScreen = () => {
  const { theme, toggleTheme, userProfile, saveProfile } = useContext(AppContext);
  const isDark = theme === 'dark';

  const handleReset = () => {
    // For demo purposes, resetting the profile logs out the user
    saveProfile(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? colors.text.dark : colors.text.light }]}>
            Profile
          </Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            {userProfile?.photoURL ? (
              <Image source={{ uri: userProfile.photoURL }} style={styles.avatarImage} />
            ) : (
              <User color="#fff" size={40} />
            )}
          </View>
          <Text style={[styles.name, { color: isDark ? colors.text.dark : colors.text.light }]}>
            {userProfile?.name || 'Student'}
          </Text>
          <Text style={{ color: isDark ? colors.textMuted.dark : colors.textMuted.light }}>
            {userProfile?.year} • {userProfile?.companyType} Target
          </Text>
          {userProfile?.email ? (
            <Text style={{ color: isDark ? colors.textMuted.dark : colors.textMuted.light, marginTop: 4, fontSize: 13 }}>
              {userProfile.email}
            </Text>
          ) : null}
        </Card>

        <Text style={[styles.sectionTitle, { color: isDark ? colors.text.dark : colors.text.light }]}>
          Settings
        </Text>
        
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: isDark ? colors.text.dark : colors.text.light }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primaryLight }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: isDark ? colors.border.dark : colors.border.light }]} />
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: isDark ? colors.text.dark : colors.text.light }]}>
              Daily Study Target
            </Text>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
              {userProfile?.studyHours} hours
            </Text>
          </View>
        </Card>

        <Button 
          title="Logout" 
          variant="secondary"
          onPress={handleReset} 
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.m },
  header: { marginBottom: spacing.l },
  title: { fontSize: 24, fontWeight: 'bold' },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.l,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.s },
  settingsCard: { padding: 0, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
  },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1 },
  logoutBtn: {
    marginTop: spacing.xl,
  }
});

export default ProfileScreen;
