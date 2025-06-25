import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { cacheManager, useCanteens } from '@/hooks/useMensaApi';
import { useTabFocusEffect } from '@/hooks/useTabFocusEffect';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function AllCafeteriasScreen() {
  const colorScheme = useColorScheme();
  const { data: canteens, loading, error, refetch } = useCanteens();

  // Add focus effect to clean up cache when tab loses focus
  useTabFocusEffect(() => {
    // Clean up any stale cache entries when switching away from this tab
    cacheManager.cleanup();
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleCanteenPress = (canteenId: string) => {
    // TODO: Navigate to canteen detail page
    // Removed console.log to prevent memory issues
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <IconSymbol size={32} name="building.2" color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText type="title" style={styles.title}>Alle Cafeterias</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          {canteens ? `${canteens.length} Mensen gefunden` : 'Lade Mensen...'}
        </ThemedText>
      </ThemedView>

      {loading && (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>Lade Cafeterias...</ThemedText>
        </ThemedView>
      )}

      {error && (
        <ThemedView style={styles.errorContainer}>
          <IconSymbol size={24} name="exclamationmark.triangle" color="#FF6B6B" />
          <ThemedText style={styles.errorText}>Fehler beim Laden: {error}</ThemedText>
        </ThemedView>
      )}

      {!loading && !error && canteens && canteens.length > 0 && (
        <ThemedView style={styles.canteensContainer}>
          {canteens.map((canteen) => (
            <TouchableOpacity
              key={canteen.ID}
              style={[styles.canteenCard, { borderColor: Colors[colorScheme ?? 'light'].tint + '30' }]}
              onPress={() => handleCanteenPress(canteen.ID)}
              activeOpacity={0.7}
            >
              <ThemedView style={styles.canteenHeader}>
                <IconSymbol 
                  size={24} 
                  name="fork.knife.circle" 
                  color={Colors[colorScheme ?? 'light'].tint} 
                />
                <ThemedView style={styles.canteenInfo}>
                  <ThemedText type="subtitle" style={styles.canteenName}>
                    {canteen.name}
                  </ThemedText>
                  {canteen.address && (
                    <ThemedText style={styles.canteenAddress}>
                      {[
                        canteen.address.street,
                        [canteen.address.zipcode, canteen.address.city].filter(Boolean).join(' '),
                        canteen.address.district
                      ].filter(Boolean).join(', ') || 'Adresse nicht verfügbar'}
                    </ThemedText>
                  )}
                </ThemedView>
                <IconSymbol 
                  size={16} 
                  name="chevron.right" 
                  color={Colors[colorScheme ?? 'light'].text + '50'} 
                />
              </ThemedView>

              {canteen.address?.geolocation && (
                <ThemedView style={styles.locationContainer}>
                  <IconSymbol size={14} name="location" color={Colors[colorScheme ?? 'light'].text + '70'} />
                  <ThemedText style={styles.locationText}>
                    {canteen.address.geolocation.latitude.toFixed(4)}, {canteen.address.geolocation.longitude.toFixed(4)}
                  </ThemedText>
                </ThemedView>
              )}

              {canteen.businessDays && canteen.businessDays.length > 0 && (
                <ThemedView style={styles.hoursContainer}>
                  <IconSymbol size={14} name="clock" color={Colors[colorScheme ?? 'light'].text + '70'} />
                  <ThemedView style={styles.hoursInfo}>
                    {canteen.businessDays.slice(0, 2).map((businessDay, index: number) => (
                      <ThemedText key={index} style={styles.hoursText}>
                        {businessDay.day}: {businessDay.businesshours && businessDay.businesshours.length > 0 
                          ? `${businessDay.businesshours[0].openAt} - ${businessDay.businesshours[0].closeAt}` 
                          : 'Geschlossen'}
                      </ThemedText>
                    ))}
                    {canteen.businessDays.length > 2 && (
                      <ThemedText style={[styles.hoursText, { opacity: 0.7 }]}>
                        +{canteen.businessDays.length - 2} weitere Tage
                      </ThemedText>
                    )}
                  </ThemedView>
                </ThemedView>
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}

      {!loading && !error && (!canteens || canteens.length === 0) && (
        <ThemedView style={styles.centerContainer}>
          <IconSymbol size={48} name="building.2" color={Colors[colorScheme ?? 'light'].tint + '50'} />
          <ThemedText style={styles.noDataText}>Keine Cafeterias gefunden</ThemedText>
          <ThemedText style={styles.noDataSubtext}>
            Versuche es später erneut
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
  canteensContainer: {
    gap: 12,
  },
  canteenCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
  },
  canteenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  canteenInfo: {
    flex: 1,
    marginLeft: 12,
  },
  canteenName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  canteenAddress: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 36,
  },
  locationText: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 6,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 36,
  },
  hoursInfo: {
    marginLeft: 6,
    flex: 1,
  },
  hoursText: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
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
});
