import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import {
  Search,
  Zap,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Coffee,
  Info,
} from "lucide-react-native";
import * as Progress from "react-native-progress";
import { useSearchStore } from "@/store/useSearchStore";
import drinksData from "@/assets/data.json";
import { Drink, Category, SortOption } from "@/types";
import { Link } from "expo-router";

const PRIMARY_COLOR = "#6F4E37";
const ACCENT_COLOR = "#FFD700";

interface FlatDrink {
  id: string;
  brand: string;
  name: string;
  category: Category;
  sizeName: string;
  volume: string;
  price: number;
  caffeine: number;
  efficiency: number;
}

const EfficiencyBadge = ({ efficiency }: { efficiency: number }) => {
  return (
    <View style={styles.badge}>
      <DollarSign size={12} color={PRIMARY_COLOR} />
      <Text style={styles.badgeText}>{efficiency.toFixed(1)} mg / 100₩</Text>
    </View>
  );
};

const DrinkCard = ({ drink }: { drink: FlatDrink }) => {
  const maxCaffeine = 300;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandText}>{drink.brand}</Text>
          <Text style={styles.drinkName}>
            {drink.name} ({drink.sizeName})
          </Text>
        </View>
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor:
                drink.category === "Franchise" ? "#EFEBE9" : "#FFF9C4",
            },
          ]}
        >
          <Text style={styles.categoryText}>{drink.category}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailContainer}>
          <View style={styles.sizeInfo}>
            <Text style={styles.sizeLabel}>용량: {drink.volume}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>
                ₩{drink.price.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.caffeineRow}>
            <View style={styles.caffeineHeader}>
              <View style={styles.caffeineLabelGroup}>
                <Zap size={16} color={ACCENT_COLOR} fill={ACCENT_COLOR} />
                <Text style={styles.caffeineValue}>{drink.caffeine}mg</Text>
              </View>
              <EfficiencyBadge efficiency={drink.efficiency} />
            </View>
            <Progress.Bar
              progress={Math.min(drink.caffeine / maxCaffeine, 1)}
              width={null}
              height={10}
              color={PRIMARY_COLOR}
              unfilledColor="#E0E0E0"
              borderWidth={0}
              style={styles.progressBar}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default function SearchScreen() {
  const {
    searchQuery,
    category,
    sortBy,
    sortOrder,
    setSearchQuery,
    setCategory,
    setSortBy,
    toggleSortOrder,
  } = useSearchStore();

  const flattenedDrinks = useMemo(() => {
    const flat: FlatDrink[] = [];
    (drinksData as Drink[]).forEach((drink) => {
      drink.sizes.forEach((size, idx) => {
        flat.push({
          id: `${drink.brand}-${drink.name}-${size.sizeName}-${idx}`,
          brand: drink.brand,
          name: drink.name,
          category: drink.category,
          sizeName: size.sizeName,
          volume: size.volume,
          price: size.price,
          caffeine: size.caffeine,
          efficiency: (size.caffeine / size.price) * 100,
        });
      });
    });
    return flat;
  }, []);

  const filteredDrinks = useMemo(() => {
    let result = [...flattenedDrinks];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(lowerQuery) ||
          d.brand.toLowerCase().includes(lowerQuery),
      );
    }

    if (category !== "All") {
      result = result.filter((d) => d.category === category);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "HighCaffeine") {
        comparison = a.caffeine - b.caffeine;
      } else if (sortBy === "LowPrice") {
        comparison = a.price - b.price;
      } else if (sortBy === "BestEfficiency") {
        comparison = a.efficiency - b.efficiency;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return result;
  }, [flattenedDrinks, searchQuery, category, sortBy, sortOrder]);

  const categories: (typeof category)[] = ["All", "Franchise", "Mix"];
  const sortOptions: { label: string; value: SortOption }[] = [
    { label: "고카페인", value: "HighCaffeine" },
    { label: "가격", value: "LowPrice" },
    { label: "가성비", value: "BestEfficiency" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>카성비</Text>
          <Link href="/modal" asChild>
            <Pressable hitSlop={10}>
              <Info size={22} color={PRIMARY_COLOR} />
            </Pressable>
          </Link>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color="#9E9E9E" />
          <TextInput
            style={styles.searchInput}
            placeholder="브랜드 또는 음료 검색"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[
                styles.filterChip,
                category === cat && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  category === cat && styles.filterChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.divider} />
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => {
                if (sortBy === opt.value) {
                  toggleSortOrder();
                } else {
                  setSortBy(opt.value);
                }
              }}
              style={[
                styles.filterChip,
                sortBy === opt.value && styles.sortChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  sortBy === opt.value && styles.filterChipTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {sortBy === opt.value && (
                <View style={{ marginLeft: 4 }}>
                  {sortOrder === "asc" ? (
                    <ArrowDown size={14} color="#FFF" />
                  ) : (
                    <ArrowUp size={14} color="#FFF" />
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDrinks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DrinkCard drink={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Coffee size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    userSelect: "none",
  },
  header: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    userSelect: "none",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: PRIMARY_COLOR,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    userSelect: "auto",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#212121",
    userSelect: "auto",
  },
  filterRow: { flexDirection: "row" },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: PRIMARY_COLOR },
  sortChipActive: { backgroundColor: ACCENT_COLOR },
  filterChipText: { fontSize: 14, color: "#757575", fontWeight: "600" },
  filterChipTextActive: { color: "#FFF" },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginHorizontal: 8,
  },
  listContent: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  brandText: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500",
    marginBottom: 2,
  },
  drinkName: { fontSize: 18, fontWeight: "bold", color: "#212121" },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  categoryText: { fontSize: 10, fontWeight: "bold", color: "#616161" },
  cardBody: { borderTopWidth: 1, borderTopColor: "#F5F5F5", paddingTop: 12 },
  detailContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 12,
  },
  sizeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sizeLabel: { fontSize: 14, color: "#616161", fontWeight: "500" },
  priceRow: { flexDirection: "row", alignItems: "center" },
  priceText: { fontSize: 16, fontWeight: "bold", color: PRIMARY_COLOR },
  caffeineRow: {
    width: "100%",
  },
  caffeineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  caffeineLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  caffeineValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
    marginLeft: 6,
  },
  progressBar: { width: "100%" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEBE9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    marginLeft: 4,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#BDBDBD",
  },
  emptyState: { alignItems: "center", marginTop: 60 },
});
