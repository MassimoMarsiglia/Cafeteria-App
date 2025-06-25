import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCanteens, useTodaysMenu } from '@/hooks/useMensaApi';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { data: canteens, loading: canteensLoading, error: canteensError, refetch: refetchCanteens } = useCanteens();
  const [selectedCanteenId, setSelectedCanteenId] = useState<string | null>(null);
  
  const { data: todaysMenu, loading: menuLoading, error: menuError, refetch: refetchMenu } = useTodaysMenu(selectedCanteenId);

  // Set default canteen when canteens are loaded
  useEffect(() => {
    if (canteens && canteens.length > 0 && !selectedCanteenId) {
      // Look for HTW canteen or use the first one
      const htwCanteen = canteens.find((canteen: any) => 
        canteen.id === '655ff175136d3b580c970f80' ||
        canteen.name.toLowerCase().includes('htw') ||
        canteen.name.toLowerCase().includes('treskowallee')
      );
      
      setSelectedCanteenId(htwCanteen ? htwCanteen.id : canteens[0].id);
    }
  }, [canteens, selectedCanteenId]);

  const handleRefresh = () => {
    refetchCanteens();
    refetchMenu();
  };

  const loading = canteensLoading || menuLoading;
  const error = canteensError || menuError;
  const selectedCanteen = canteens?.find((c: any) => c.id === selectedCanteenId);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <IconSymbol size={32} name="fork.knife" color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText type="title" style={styles.title}>Heutige Gerichte</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          {selectedCanteen?.name || 'HTW Mensa'}
        </ThemedText>
      </ThemedView>

      {loading && (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>Lade Gerichte...</ThemedText>
        </ThemedView>
      )}

      {error && (
        <ThemedView style={styles.errorContainer}>
          <IconSymbol size={24} name="exclamationmark.triangle" color="#FF6B6B" />
          <ThemedText style={styles.errorText}>Fehler: {error}</ThemedText>
          <ThemedText style={styles.retryText} onPress={handleRefresh}>
            Tippen zum erneut versuchen
          </ThemedText>
        </ThemedView>
      )}

      {!loading && !error && (!todaysMenu || todaysMenu.length === 0) && (
        <ThemedView style={styles.centerContainer}>
          <IconSymbol size={32} name="tray" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.emptyText}>Heute sind keine Gerichte verfügbar</ThemedText>
        </ThemedView>
      )}

      {!loading && !error && todaysMenu && todaysMenu.length > 0 && (
        <ThemedView style={styles.menuContainer}>
          {todaysMenu.map((menu: any, menuIndex: number) => (
            <ThemedView key={menu.id || menuIndex} style={styles.menuSection}>
              {menu.meals && menu.meals.map((meal: any, mealIndex: number) => (
                <ThemedView key={meal.id || mealIndex} style={[styles.mealCard, { borderColor: Colors[colorScheme ?? 'light'].tint + '30' }]}>
                  <ThemedView style={styles.mealHeader}>
                    <ThemedText type="subtitle" style={styles.mealName}>{meal.name}</ThemedText>
                    {meal.price?.students && (
                      <ThemedText style={[styles.price, { color: Colors[colorScheme ?? 'light'].tint }]}>
                        {meal.price.students.toFixed(2)}€
                      </ThemedText>
                    )}
                  </ThemedView>
                  
                  {meal.description && (
                    <ThemedText style={styles.description}>{meal.description}</ThemedText>
                  )}
                  
                  {meal.category && (
                    <ThemedView style={[styles.categoryBadge, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}>
                      <ThemedText style={[styles.categoryText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                        {meal.category}
                      </ThemedText>
                    </ThemedView>
                  )}
                  
                  {meal.badges && meal.badges.length > 0 && (
                    <ThemedView style={styles.badgesContainer}>
                      {meal.badges.map((badge: any, badgeIndex: number) => (
                        <ThemedView key={badgeIndex} style={[styles.badge, { backgroundColor: '#4CAF50' + '20' }]}>
                          <ThemedText style={[styles.badgeText, { color: '#4CAF50' }]}>
                            {badge.name}
                          </ThemedText>
                        </ThemedView>
                      ))}
                    </ThemedView>
                  )}
                </ThemedView>
              ))}
            </ThemedView>
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 4,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#FF6B6B20',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 8,
  },
  menuContainer: {
    gap: 16,
  },
  menuSection: {
    gap: 12,
  },
  mealCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealName: {
    flex: 1,
    marginRight: 12,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    opacity: 0.8,
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  retryText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
});
