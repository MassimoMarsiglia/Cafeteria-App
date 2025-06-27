import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Switch,
} from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    colorScheme === 'dark',
  );

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Profil bearbeiten',
      'Diese Funktion ist noch nicht verfügbar.',
    );
  };

  const handleFavorites = () => {
    Alert.alert('Favoriten', 'Diese Funktion ist noch nicht verfügbar.');
  };

  const handleSettings = () => {
    Alert.alert('Einstellungen', 'Diese Funktion ist noch nicht verfügbar.');
  };

  const handleLogout = () => {
    Alert.alert('Abmelden', 'Möchten Sie sich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Abmelden',
        style: 'destructive',
        onPress: () => {
          // TODO: Implement logout logic
          Alert.alert('Abgemeldet', 'Sie wurden erfolgreich abgemeldet.');
        },
      },
    ]);
  };

  const profileItems = [
    {
      id: 'edit',
      title: 'Profil bearbeiten',
      icon: 'person.circle',
      action: handleEditProfile,
      showArrow: true,
    },
    {
      id: 'favorites',
      title: 'Meine Favoriten',
      icon: 'heart',
      action: handleFavorites,
      showArrow: true,
    },
    {
      id: 'settings',
      title: 'Einstellungen',
      icon: 'gearshape',
      action: handleSettings,
      showArrow: true,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
    >
      {/* Header mit Back Button */}
      <ThemedView
        style={[
          styles.header,
          {
            borderBottomColor: Colors[colorScheme ?? 'light'].tint + '20',
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol
            size={24}
            name="chevron.left"
            color={Colors[colorScheme ?? 'light'].text}
          />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Profil
        </ThemedText>
        <View style={styles.headerRight} />
      </ThemedView>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profil Header */}
        <ThemedView style={styles.profileHeader}>
          <ThemedView
            style={[
              styles.avatarContainer,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].tint + '20',
              },
            ]}
          >
            <IconSymbol
              size={60}
              name="person.fill"
              color={Colors[colorScheme ?? 'light'].tint}
            />
          </ThemedView>
          <ThemedText type="title" style={styles.userName}>
            Max Mustermann
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            max.mustermann@htw-berlin.de
          </ThemedText>
          <ThemedText style={styles.userRole}>Student • HTW Berlin</ThemedText>
        </ThemedView>

        {/* Statistiken */}
        <ThemedView
          style={[
            styles.section,
            {
              borderColor: Colors[colorScheme ?? 'light'].tint + '20',
            },
          ]}
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Statistiken
          </ThemedText>
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statItem}>
              <ThemedText
                style={[
                  styles.statNumber,
                  {
                    color: Colors[colorScheme ?? 'light'].tint,
                  },
                ]}
              >
                23
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                Besuche diese Woche
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.statItem}>
              <ThemedText
                style={[
                  styles.statNumber,
                  {
                    color: Colors[colorScheme ?? 'light'].tint,
                  },
                ]}
              >
                12
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                Lieblingsgerichte
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.statItem}>
              <ThemedText
                style={[
                  styles.statNumber,
                  {
                    color: Colors[colorScheme ?? 'light'].tint,
                  },
                ]}
              >
                4.8
              </ThemedText>
              <ThemedText style={styles.statLabel}>Ø Bewertung</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Profil Optionen */}
        <ThemedView
          style={[
            styles.section,
            {
              borderColor: Colors[colorScheme ?? 'light'].tint + '20',
            },
          ]}
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Profil
          </ThemedText>
          {profileItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.action}
            >
              <ThemedView style={styles.menuItemContent}>
                <ThemedView
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor:
                        Colors[colorScheme ?? 'light'].tint + '20',
                    },
                  ]}
                >
                  <IconSymbol
                    size={20}
                    name={item.icon as any}
                    color={Colors[colorScheme ?? 'light'].tint}
                  />
                </ThemedView>
                <ThemedText style={styles.menuItemTitle}>
                  {item.title}
                </ThemedText>
                {item.showArrow && (
                  <IconSymbol
                    size={16}
                    name="chevron.right"
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ opacity: 0.5 }}
                  />
                )}
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Einstellungen */}
        <ThemedView
          style={[
            styles.section,
            {
              borderColor: Colors[colorScheme ?? 'light'].tint + '20',
            },
          ]}
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Einstellungen
          </ThemedText>

          <ThemedView style={styles.menuItem}>
            <ThemedView style={styles.menuItemContent}>
              <ThemedView
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: Colors[colorScheme ?? 'light'].tint + '20',
                  },
                ]}
              >
                <IconSymbol
                  size={20}
                  name="moon"
                  color={Colors[colorScheme ?? 'light'].tint}
                />
              </ThemedView>
              <ThemedText style={styles.menuItemTitle}>Dark Mode</ThemedText>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{
                  false: '#767577',
                  true: Colors[colorScheme ?? 'light'].tint + '50',
                }}
                thumbColor={
                  darkModeEnabled
                    ? Colors[colorScheme ?? 'light'].tint
                    : '#f4f3f4'
                }
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Logout Button */}
        <ThemedView style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: '#FF6B6B' }]}
            onPress={handleLogout}
          >
            <IconSymbol size={20} name="arrow.right.square" color="#FF6B6B" />
            <ThemedText style={[styles.logoutText, { color: '#FF6B6B' }]}>
              Abmelden
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* App Info */}
        <ThemedView style={styles.appInfo}>
          <ThemedText style={styles.appInfoText}>Mensa App v1.0</ThemedText>
          <ThemedText style={styles.appInfoText}>© 2025 HTW Berlin</ThemedText>
        </ThemedView>

        {/* Bottom Padding */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Kompensation für Back Button
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  menuItem: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutSection: {
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appInfoText: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 2,
  },
});
