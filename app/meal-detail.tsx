import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Meal } from "@/services/mensaApi";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function MealDetailScreen() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const [meal, setMeal] = useState<Meal | null>(null);

  // Get screen dimensions for responsive layout
  const { width: screenWidth } = Dimensions.get("window");

  useEffect(() => {
    // Parse meal data from route params
    if (params.mealData && typeof params.mealData === "string") {
      try {
        const parsedMeal = JSON.parse(params.mealData) as Meal;
        setMeal(parsedMeal);
      } catch (error) {
        console.error("Error parsing meal data:", error);
      }
    }
  }, [params.mealData]);

  const handleBack = () => {
    router.back();
  };

  if (!meal) {
    return (
      <ThemedView
        style={[
          styles.container,
          {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        ]}
      >
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <IconSymbol
              size={24}
              name="chevron.left"
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <ThemedText type="title">Gericht nicht gefunden</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // Get student price or first available price
  const studentPrice = meal.prices?.find((p) => p.priceType === "Student");
  const displayPrice = studentPrice || meal.prices?.[0];

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with back button */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol
            size={24}
            name="chevron.left"
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Gericht Details
        </ThemedText>
      </ThemedView>

      {/* Main content */}
      <ThemedView style={styles.content}>
        {/* Meal name */}
        <ThemedView style={styles.titleSection}>
          <ThemedText type="title" style={styles.mealTitle}>
            {meal.name}
          </ThemedText>
          {/* Debug info */}
          {__DEV__ && meal.ID && (
            <ThemedText style={styles.debugId}>ID: {meal.ID}</ThemedText>
          )}
        </ThemedView>

        {/* Price section */}
        {meal.prices && meal.prices.length > 0 && (
          <ThemedView
            style={[
              styles.priceSection,
              {
                borderColor: Colors[colorScheme ?? "light"].tint + "20",
              },
            ]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Preise
            </ThemedText>
            {meal.prices.map((price, index) => (
              <ThemedView key={index} style={styles.priceItem}>
                <ThemedText style={styles.priceType}>
                  {price.priceType}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.priceValue,
                    {
                      color: Colors[colorScheme ?? "light"].tint,
                    },
                  ]}
                >
                  {price.price.toFixed(2)}€
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Category section */}
        {meal.category && (
          <ThemedView
            style={[
              styles.section,
              {
                borderColor: Colors[colorScheme ?? "light"].tint + "20",
              },
            ]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Kategorie
            </ThemedText>
            <ThemedView
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: Colors[colorScheme ?? "light"].tint + "20",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.categoryText,
                  {
                    color: Colors[colorScheme ?? "light"].tint,
                  },
                ]}
              >
                {meal.category}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}

        {/* Badges section */}
        {meal.badges && meal.badges.length > 0 && (
          <ThemedView
            style={[
              styles.section,
              {
                borderColor: Colors[colorScheme ?? "light"].tint + "20",
              },
            ]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Eigenschaften
            </ThemedText>
            <ThemedView style={styles.badgesContainer}>
              {meal.badges.map((badge, index) => (
                <ThemedView
                  key={badge.ID || index}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: "#4CAF50" + "20",
                    },
                  ]}
                >
                  <ThemedText style={[styles.badgeText, { color: "#4CAF50" }]}>
                    {badge.name}
                  </ThemedText>
                  {badge.description && (
                    <ThemedText style={styles.badgeDescription}>
                      {badge.description}
                    </ThemedText>
                  )}
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {/* Additives section */}
        {meal.additives && meal.additives.length > 0 && (
          <ThemedView
            style={[
              styles.section,
              {
                borderColor: Colors[colorScheme ?? "light"].tint + "20",
              },
            ]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Zusatzstoffe
            </ThemedText>
            {meal.additives.map((additive, index) => (
              <ThemedView
                key={additive.ID || index}
                style={styles.additiveItem}
              >
                <ThemedText style={styles.additiveReference}>
                  {additive.referenceid}
                </ThemedText>
                <ThemedText style={styles.additiveText}>
                  {additive.text}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Environmental data section */}
        {(meal.co2Bilanz !== undefined && meal.co2Bilanz !== null) ||
        (meal.waterBilanz !== undefined && meal.waterBilanz !== null) ? (
          <ThemedView
            style={[
              styles.section,
              {
                borderColor: Colors[colorScheme ?? "light"].tint + "20",
              },
            ]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Umweltdaten
            </ThemedText>
            {meal.co2Bilanz !== undefined && meal.co2Bilanz !== null && (
              <ThemedView style={styles.environmentItem}>
                <IconSymbol size={20} name="leaf" color="#4CAF50" />
                <ThemedText style={styles.environmentLabel}>
                  CO₂-Bilanz:
                </ThemedText>
                <ThemedText
                  style={[styles.environmentValue, { color: "#4CAF50" }]}
                >
                  {meal.co2Bilanz} kg CO₂
                </ThemedText>
              </ThemedView>
            )}
            {meal.waterBilanz !== undefined && meal.waterBilanz !== null && (
              <ThemedView style={styles.environmentItem}>
                <IconSymbol size={20} name="drop" color="#2196F3" />
                <ThemedText style={styles.environmentLabel}>
                  Wasser-Bilanz:
                </ThemedText>
                <ThemedText
                  style={[styles.environmentValue, { color: "#2196F3" }]}
                >
                  {meal.waterBilanz} L
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        ) : null}

        {/* Reviews section */}
        {meal.mealReviews && meal.mealReviews.length > 0 && (
          <ThemedView
            style={[
              styles.section,
              {
                borderColor: Colors[colorScheme ?? "light"].tint + "20",
              },
            ]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Bewertungen
            </ThemedText>
            {meal.mealReviews.slice(0, 3).map((review, index) => (
              <ThemedView key={review.ID || index} style={styles.reviewItem}>
                {review.averageRating && (
                  <ThemedView style={styles.ratingContainer}>
                    <ThemedText
                      style={[
                        styles.rating,
                        {
                          color: Colors[colorScheme ?? "light"].tint,
                        },
                      ]}
                    >
                      ⭐ {review.averageRating.toFixed(1)}
                    </ThemedText>
                  </ThemedView>
                )}
                {review.comment && (
                  <ThemedText style={styles.reviewComment}>
                    "{review.comment}"
                  </ThemedText>
                )}
              </ThemedView>
            ))}
            {meal.mealReviews.length > 3 && (
              <ThemedText
                style={[
                  styles.moreReviews,
                  {
                    color: Colors[colorScheme ?? "light"].tint,
                  },
                ]}
              >
                +{meal.mealReviews.length - 3} weitere Bewertungen
              </ThemedText>
            )}
          </ThemedView>
        )}

        {/* Add some bottom padding */}
        <ThemedView style={{ height: 32 }} />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Compensate for back button
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 24,
  },
  mealTitle: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 34,
    textAlign: "center",
  },
  debugId: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: "center",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  priceSection: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  priceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  priceType: {
    fontSize: 16,
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeDescription: {
    fontSize: 10,
    opacity: 0.8,
    marginTop: 2,
  },
  additiveItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  additiveReference: {
    fontWeight: "bold",
    marginRight: 8,
    minWidth: 30,
  },
  additiveText: {
    flex: 1,
    opacity: 0.8,
  },
  environmentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  environmentLabel: {
    marginLeft: 8,
    marginRight: 8,
    flex: 1,
  },
  environmentValue: {
    fontWeight: "bold",
  },
  reviewItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  ratingContainer: {
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
  },
  reviewComment: {
    fontSize: 14,
    fontStyle: "italic",
    opacity: 0.8,
  },
  moreReviews: {
    textAlign: "center",
    fontWeight: "500",
    marginTop: 8,
  },
});
