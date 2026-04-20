import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Search, Coffee, Zap, DollarSign } from "lucide-react-native";
import * as Progress from "react-native-progress";
import { useSearchStore } from "@/store/useSearchStore";
import drinksData from "@/assets/data.json";
import { Drink, SortOption } from "@/types";

const PRIMARY_COLOR = "#6F4E37";
const ACCENT_COLOR = "#FFD700";

const EfficiencyBadge = ({
  caffeine,
  price,
}: {
  caffeine: number;
  price: number;
}) => {
  const efficiency = (caffeine / price) * 100;
  return (
    <View style={styles.badge}>
      <DollarSign size={12} color={PRIMARY_COLOR} />
      <Text style={styles.badgeText}>{efficiency.toFixed(1)} mg / 100₩</Text>
    </View>
  );
};

const DrinkCard = ({ drink }: { drink: Drink }) => {
  const defaultSize = drink.sizes[0];
  const maxCaffeine = 300;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.brandText}>{drink.brand}</Text>
          <Text style={styles.drinkName}>{drink.name}</Text>
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
        <View style={styles.sizeSection}>
          {drink.sizes.map((size, idx) => (
            <View key={idx} style={styles.sizeInfo}>
              <Text style={styles.sizeLabel}>
                {size.sizeName} ({size.volume})
              </Text>
              <Text style={styles.priceText}>
                ₩{size.price.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.caffeineRow}>
          <Zap size={16} color={ACCENT_COLOR} fill={ACCENT_COLOR} />
          <Text style={styles.caffeineValue}>{defaultSize.caffeine}mg</Text>
          <Progress.Bar
            progress={Math.min(defaultSize.caffeine / maxCaffeine, 1)}
            width={null}
            height={8}
            color={PRIMARY_COLOR}
            unfilledColor="#E0E0E0"
            borderWidth={0}
            style={styles.progressBar}
          />
        </View>

        <EfficiencyBadge
          caffeine={defaultSize.caffeine}
          price={defaultSize.price}
        />
      </View>
    </View>
  );
};

export default function SearchScreen() {
  const {
    searchQuery,
    category,
    sortBy,
    setSearchQuery,
    setCategory,
    setSortBy,
  } = useSearchStore();

  const filteredDrinks = useMemo(() => {
    let result = [...drinksData] as Drink[];

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
      const aBest = a.sizes[0];
      const bBest = b.sizes[0];

      if (sortBy === "HighCaffeine") return bBest.caffeine - aBest.caffeine;
      if (sortBy === "LowPrice") return aBest.price - bBest.price;
      if (sortBy === "BestEfficiency") {
        const aEff = aBest.caffeine / aBest.price;
        const bEff = bBest.caffeine / bBest.price;
        return bEff - aEff;
      }
      return 0;
    });

    return result;
  }, [searchQuery, category, sortBy]);

  const categories: (typeof category)[] = ["All", "Franchise", "Mix"];
  const sortOptions: { label: string; value: SortOption }[] = [
    { label: "고카페인", value: "HighCaffeine" },
    { label: "최저가", value: "LowPrice" },
    { label: "가성비", value: "BestEfficiency" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
              onPress={() => setSortBy(opt.value)}
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
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: "#212121" },
  filterRow: { flexDirection: "row" },
  filterChip: {
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
    marginBottom: 12,
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
  sizeSection: { marginBottom: 8 },
  sizeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sizeLabel: { fontSize: 13, color: "#616161" },
  priceText: { fontSize: 13, fontWeight: "600", color: PRIMARY_COLOR },
  caffeineRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  caffeineValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginHorizontal: 8,
  },
  progressBar: { flex: 1 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    alignSelf: "flex-start",
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
  emptyState: { alignItems: "center", marginTop: 60 },
  emptyText: { marginTop: 12, fontSize: 16, color: "#9E9E9E" },
});
