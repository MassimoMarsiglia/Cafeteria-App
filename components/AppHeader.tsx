import { BurgerMenu } from '@/components/BurgerMenu';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePathname } from 'expo-router';
import { useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <ThemedView style={[
        styles.header, 
        { 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderBottomColor: Colors[colorScheme ?? 'light'].tint + '20'
        }
      ]}>
        <TouchableOpacity 
          onPress={handleMenuPress} 
          style={styles.menuButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol 
            size={24} 
            name="line.3.horizontal" 
            color={Colors[colorScheme ?? 'light'].text} 
          />
        </TouchableOpacity>

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.headerTitle}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.headerSubtitle}>
              {subtitle}
            </ThemedText>
          )}
        </ThemedView>

        {/* Placeholder for right side (future features like notifications) */}
        <ThemedView style={styles.rightPlaceholder} />
      </ThemedView>

      <BurgerMenu 
        visible={menuVisible}
        onClose={handleMenuClose}
        currentRoute={pathname}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: (StatusBar.currentHeight || 0) + 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 2,
  },
  rightPlaceholder: {
    width: 40, // Same width as menu button for balance
    height: 40,
  },
});
