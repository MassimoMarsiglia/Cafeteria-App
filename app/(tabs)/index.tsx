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
  // Start with the known HTW ID directly
  const [htwCanteenId, setHtwCanteenId] = useState<string | null>('655ff175136d3b580c970f80');
  const { data: todaysMenu, loading: menuLoading, error: menuError, refetch: refetchMenu } = useTodaysMenu(htwCanteenId);
  const [isInitialized, setIsInitialized] = useState(false);

  // Simple one-time initialization when canteens are loaded
  useEffect(() => {
    if (canteens && canteens.length > 0 && !isInitialized) {
      console.log(`${canteens.length} Mensen gefunden`);
      
      // Look for HTW canteen or use the fixed ID
      const htwCanteen = canteens.find(canteen => 
        canteen.id === '655ff175136d3b580c970f80' ||
        canteen.name.toLowerCase().includes('htw') ||
        canteen.name.toLowerCase().includes('treskowallee')
      );
      
      if (htwCanteen && htwCanteen.id !== htwCanteenId) {
        console.log(`HTW Mensa gefunden: ${htwCanteen.name}`);
        setHtwCanteenId(htwCanteen.id);
      } else if (canteens.length > 0 && canteens[0].id !== htwCanteenId) {
        console.log(`HTW nicht gefunden, verwende erste Mensa: ${canteens[0].name}`);
        setHtwCanteenId(canteens[0].id);
      }
      
      setIsInitialized(true);
    }
  }, [canteens, isInitialized, htwCanteenId]);

  const handleRefresh = () => {
    refetchCanteens();
    if (htwCanteenId) {
      refetchMenu();
    }
  };

  const loading = canteensLoading || menuLoading;
  const error = canteensError || menuError;

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
          {canteens && htwCanteenId ? 
            canteens.find(c => c.id === htwCanteenId)?.name || 'Mensa' : 
            'HTW Mensa'
          }
        </ThemedText>
      </ThemedView>

      {!isInitialized && (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>App wird geladen...</ThemedText>
        </ThemedView>
      )}

      {loading && isInitialized && (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>Lade Gerichte...</ThemedText>
        </ThemedView>
      )}

      {error && isInitialized && (
        <ThemedView style={styles.errorContainer}>
          <IconSymbol size={24} name="exclamationmark.triangle" color="#FF6B6B" />
          <ThemedText style={styles.errorText}>Fehler beim Laden: {error}</ThemedText>
          <ThemedText style={styles.retryText} onPress={handleRefresh}>
            Tippen zum erneut versuchen
          </ThemedText>
        </ThemedView>
      )}

      {!loading && !error && isInitialized && (!todaysMenu || todaysMenu.length === 0) && (
        <ThemedView style={styles.centerContainer}>
          <IconSymbol size={32} name="tray" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.emptyText}>Heute sind keine Gerichte verfügbar</ThemedText>
          <ThemedText style={styles.retryText} onPress={handleRefresh}>
            Tippen zum aktualisieren
          </ThemedText>
        </ThemedView>
      )}

      {!loading && !error && isInitialized && todaysMenu && todaysMenu.length > 0 && (
        <ThemedView style={styles.menuContainer}>
          {todaysMenu.map((menu, menuIndex) => (
            <ThemedView key={`menu-${menu.id || menuIndex}`} style={styles.menuSection}>
              {menu.meals && menu.meals.map((meal: any, mealIndex: number) => (
                <ThemedView key={`meal-${meal.id || mealIndex}`} style={[styles.mealCard, { borderColor: Colors[colorScheme ?? 'light'].tint + '30' }]}>
                  <ThemedView style={styles.mealHeader}>
                    <ThemedText type="subtitle" style={styles.mealName}>{meal.name}</ThemedText>
                    {meal.price && (
                      <ThemedView style={styles.priceContainer}>
                        {meal.price.students && (
                          <ThemedText style={[styles.price, { color: Colors[colorScheme ?? 'light'].tint }]}>
                            {meal.price.students.toFixed(2)}€
                          </ThemedText>
                        )}
                      </ThemedView>
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
                        <ThemedView key={`badge-${meal.id}-${badge.id || badgeIndex}`} style={[styles.badge, { backgroundColor: '#4CAF50' + '20' }]}>
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

      {!loading && !error && (!todaysMenu || todaysMenu.length === 0) && (
        <ThemedView style={styles.centerContainer}>
          <IconSymbol size={48} name="fork.knife.circle" color={Colors[colorScheme ?? 'light'].tint + '50'} />
          <ThemedText style={styles.noDataText}>Heute keine Gerichte verfügbar</ThemedText>
          <ThemedText style={styles.noDataSubtext}>
            Versuche es später erneut oder prüfe andere Mensen
          </ThemedText>
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
  priceContainer: {
    alignItems: 'flex-end',
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
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  noDataSubtext: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 8,
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
  debugText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
    fontFamily: 'monospace',
  },
});
