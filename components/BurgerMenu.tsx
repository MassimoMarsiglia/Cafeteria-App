import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface BurgerMenuProps {
  visible: boolean;
  onClose: () => void;
  currentRoute: string;
}

export function BurgerMenu({
  visible,
  onClose,
  currentRoute,
}: BurgerMenuProps) {
  const colorScheme = useColorScheme();
  const { width: screenWidth } = Dimensions.get('window');

  const menuItems = [
    {
      id: 'dishes',
      title: 'Heutige Gerichte',
      icon: 'fork.knife',
      route: '/(tabs)/',
      description: 'Aktuelle Speisen der Mensa',
    },
    {
      id: 'cafeterias',
      title: 'Alle Cafeterias',
      icon: 'building.2',
      route: '/(tabs)/all_cafeterias',
      description: 'Übersicht aller Mensen',
    },
  ];

  const handleMenuItemPress = (route: string) => {
    onClose();
    router.push(route as any);
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <ThemedView
            style={[
              styles.menuContainer,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                width: screenWidth * 0.8,
                maxWidth: 300,
              },
            ]}
          >
            {/* Header */}
            <ThemedView
              style={[
                styles.menuHeader,
                {
                  borderBottomColor: Colors[colorScheme ?? 'light'].tint + '20',
                },
              ]}
            >
              <ThemedText type="title" style={styles.menuTitle}>
                Navigation
              </ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconSymbol
                  size={24}
                  name="xmark"
                  color={Colors[colorScheme ?? 'light'].text}
                />
              </TouchableOpacity>
            </ThemedView>

            {/* Menu Items */}
            <ThemedView style={styles.menuContent}>
              {menuItems.map(item => {
                const isActive =
                  currentRoute.includes(item.id) ||
                  (item.id === 'dishes' && currentRoute === '/(tabs)/');

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      isActive && {
                        backgroundColor:
                          Colors[colorScheme ?? 'light'].tint + '10',
                      },
                    ]}
                    onPress={() => handleMenuItemPress(item.route)}
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
                          size={24}
                          name={item.icon as any}
                          color={
                            isActive
                              ? Colors[colorScheme ?? 'light'].tint
                              : Colors[colorScheme ?? 'light'].text
                          }
                        />
                      </ThemedView>
                      <ThemedView style={styles.textContainer}>
                        <ThemedText
                          style={[
                            styles.menuItemTitle,
                            isActive && {
                              color: Colors[colorScheme ?? 'light'].tint,
                              fontWeight: 'bold',
                            },
                          ]}
                        >
                          {item.title}
                        </ThemedText>
                        <ThemedText style={styles.menuItemDescription}>
                          {item.description}
                        </ThemedText>
                      </ThemedView>
                      <IconSymbol
                        size={16}
                        name="chevron.right"
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{
                          opacity: 0.5,
                        }}
                      />
                    </ThemedView>
                  </TouchableOpacity>
                );
              })}
            </ThemedView>

            {/* Footer */}
            <ThemedView
              style={[
                styles.menuFooter,
                {
                  borderTopColor: Colors[colorScheme ?? 'light'].tint + '20',
                },
              ]}
            >
              <ThemedText style={styles.appVersion}>Mensa App v1.0</ThemedText>
            </ThemedView>
          </ThemedView>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  menuContainer: {
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 12,
    opacity: 0.6,
  },
});
