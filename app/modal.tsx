import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";
import { Coffee, Zap, Database, Clock } from "lucide-react-native";

export default function ModalScreen() {
  const updateDate = "2026.04.20"; // 데이터 마지막 업데이트 일자

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <View style={styles.iconTitle}>
          <Coffee size={24} color="#6F4E37" />
          <Text style={styles.title}>카성비(Cafficiency)란?</Text>
        </View>
        <Text style={styles.description}>
          "카페인 가성비"의 줄임말로, 지불한 금액(100원 단위) 대비 얼마나 많은
          카페인을 섭취할 수 있는지 나타내는 수치입니다.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.iconTitle}>
          <Zap size={24} color="#FFD700" />
          <Text style={styles.title}>앱 설명</Text>
        </View>
        <Text style={styles.description}>
          다양한 프랜차이즈 카페와 믹스커피의 카페인 함량 및 가격 정보를 한눈에
          비교할 수 있습니다. 각 사이즈별로 데이터를 평탄화하여 가장 효율적인
          선택을 도와드립니다.
        </Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoLine}>
          <Database size={16} color="#757575" />
          <Text style={styles.infoText}>
            데이터 출처: 각 브랜드별 공식 홈페이지
          </Text>
        </View>
        <View style={styles.infoLine}>
          <Clock size={16} color="#757575" />
          <Text style={styles.infoText}>데이터 갱신일: {updateDate}</Text>
        </View>
      </View>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  iconTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#212121",
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: "#424242",
    lineHeight: 24,
  },
  infoBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 100,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#757575",
    marginLeft: 8,
  },
});
