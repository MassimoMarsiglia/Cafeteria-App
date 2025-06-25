import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { cacheManager, useCanteens, useTodaysMenu } from '@/hooks/useMensaApi';
import { useTabFocusEffect } from '@/hooks/useTabFocusEffect';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { data: canteens, loading: canteensLoading, error: canteensError, refetch: refetchCanteens } = useCanteens();
  const [selectedCanteenId, setSelectedCanteenId] = useState<string | null>(null);
  
  const { data: todaysMenu, loading: menuLoading, error: menuError, refetch: refetchMenu } = useTodaysMenu(selectedCanteenId);

  // Add focus effect to refresh data when tab gains focus, but clean cache when losing focus
  useTabFocusEffect(() => {
    // Clean up cache when leaving tab to prevent stale data on return
    console.log('Tab losing focus, cleaning cache...');
    cacheManager.cleanup();
  });

  // Set default canteen and trigger immediate menu loading
  useEffect(() => {
    if (canteens && canteens.length > 0 && !selectedCanteenId) {
      // Debug: Log all canteens to see what's available
      console.log('Available canteens:', canteens.map(c => ({ ID: c.ID, name: c.name })));
      
      // Look for HTW canteen with multiple search criteria
      const htwCanteen = canteens.find((canteen) => 
        canteen.ID === '655ff175136d3b580c970f80' ||
        canteen.name.toLowerCase().includes('htw') ||
        canteen.name.toLowerCase().includes('treskowallee') ||
        canteen.name.toLowerCase().includes('technik') ||
        canteen.name.toLowerCase().includes('wirtschaft')
      );
      
      console.log('HTW Canteen found:', htwCanteen ? { ID: htwCanteen.ID, name: htwCanteen.name } : 'Not found');
      const targetCanteenId = htwCanteen ? htwCanteen.ID : canteens[0]?.ID;
      console.log('Selected canteen ID will be:', targetCanteenId);
      
      // Set the canteen ID immediately to trigger menu loading
      if (targetCanteenId) {
        setSelectedCanteenId(targetCanteenId);
      }
    }
  }, [canteens]); // Remove selectedCanteenId from dependencies to prevent loops

  const loading = canteensLoading || menuLoading;
  const error = canteensError || menuError;
  const selectedCanteen = canteens?.find((c) => c.ID === selectedCanteenId);

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    // Clear cache to force fresh data
    cacheManager.clearAll();
    refetchCanteens();
    if (selectedCanteenId) {
      refetchMenu();
    }
  };

  // Auto-retry mechanism with improved timing for faster response
  useEffect(() => {
    if (!loading && !error && canteens && canteens.length > 0 && selectedCanteenId && (!todaysMenu || todaysMenu.length === 0)) {
      console.log('Auto-retry: No menu data found, retrying...');
      const retryTimeout = setTimeout(() => {
        console.log('Executing auto-retry...');
        refetchMenu();
      }, 500); // Further reduced to 500ms for immediate response
      
      return () => clearTimeout(retryTimeout);
    }
  }, [loading, error, canteens, selectedCanteenId, todaysMenu, refetchMenu]);

  // Flatten all meals from all menus for grid display
  const allMeals = todaysMenu?.flatMap(menu => menu.meals || []) || [];

  // Get screen width for responsive layout
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48) / 2; // 16px padding on each side + 16px gap between cards

  // Render individual meal card
  const renderMealCard = ({ item: meal, index }: { item: any, index: number }) => (
    <TouchableOpacity 
      key={meal.ID || index} 
      style={[styles.mealCard, { 
        borderColor: Colors[colorScheme ?? 'light'].tint + '30',
        width: cardWidth
      }]}
      onPress={() => handleMealPress(meal)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.mealHeader}>
        <ThemedText type="subtitle" style={styles.mealName} numberOfLines={2}>
          {meal.name || 'Unbekanntes Gericht'}
        </ThemedText>
      </ThemedView>
      
      {meal.prices && meal.prices.length > 0 && (
        <ThemedText style={[styles.price, { color: Colors[colorScheme ?? 'light'].tint }]}>
          {meal.prices.find((p: any) => p.priceType === 'Student')?.price.toFixed(2) || 
           meal.prices[0]?.price?.toFixed(2) || '0.00'}€
        </ThemedText>
      )}
      
      {meal.category && (
        <ThemedView style={[styles.categoryBadge, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}>
          <ThemedText style={[styles.categoryText, { color: Colors[colorScheme ?? 'light'].tint }]}>
            {meal.category}
          </ThemedText>
        </ThemedView>
      )}
      
      {/* Visual indicator that this is clickable */}
      <ThemedView style={styles.clickIndicator}>
        <IconSymbol size={16} name="chevron.right" color={Colors[colorScheme ?? 'light'].text} style={{ opacity: 0.5 }} />
      </ThemedView>
    </TouchableOpacity>
  );

  // Handle meal card press
  const handleMealPress = (meal: any) => {
    try {
      // Navigate to meal detail screen with meal data
      router.push({
        pathname: '/meal-detail',
        params: {
          mealData: JSON.stringify(meal)
        }
      });
    } catch (error) {
      console.error('Error navigating to meal detail:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <AppHeader 
        title="Heutige Gerichte" 
        subtitle={selectedCanteen?.name || 'HTW Mensa'}
      />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {/* Debug info */}
        {__DEV__ && (
          <ThemedText style={{ fontSize: 10, opacity: 0.7, margin: 16, textAlign: 'center' }}>
            Debug: Canteen ID: {selectedCanteenId || 'none'} | Menu items: {todaysMenu?.length || 0} | Total meals: {allMeals.length}
          </ThemedText>
        )}

      {loading && (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>Lade Gerichte...</ThemedText>
          {canteensLoading && <ThemedText style={{fontSize: 12, opacity: 0.7, marginTop: 4}}>Lade Mensen...</ThemedText>}
          {menuLoading && <ThemedText style={{fontSize: 12, opacity: 0.7, marginTop: 4}}>Lade Menü...</ThemedText>}
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

      {!loading && !error && (!allMeals || allMeals.length === 0) && (
        <ThemedView style={styles.centerContainer}>
          <IconSymbol size={32} name="tray" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.emptyText}>Heute sind keine Gerichte verfügbar</ThemedText>
        </ThemedView>
      )}

      {!loading && !error && allMeals && allMeals.length > 0 && (
        <ThemedView style={styles.gridContainer}>
          <FlatList
            data={allMeals}
            renderItem={renderMealCard}
            keyExtractor={(item) => item.ID}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </ThemedView>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    minHeight: 120, // Reduced from 140 since no badges
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealHeader: {
    marginBottom: 8,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
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
  clickIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
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
  // Grid layout styles
  gridContainer: {
    paddingBottom: 32,
  },
  gridContent: {
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-between',
    gap: 16,
  },
  emptyGridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});
