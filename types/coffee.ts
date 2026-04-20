export type Category = "Franchise" | "Mix" | "Convenience";

export interface SizeOption {
  sizeName: string; // 예: 'Tall', '1스틱', 'Large'
  volume: number; // 용량 (ml 또는 g)
  price: number; // 가격 (원)
  caffeine: number; // 카페인 함량 (mg)
  efficiency: number; // 가성비: caffeine / price (미리 계산된 값)
}

export interface CoffeeItem {
  id: string; // 고유 ID (예: 'stb-001')
  brand: string; // 브랜드명 (예: '스타벅스')
  name: string; // 음료명 (예: '아메리카노')
  category: Category; // 카테고리
  options: SizeOption[]; // 사이즈별 상세 정보 (배열)
  imageUrl?: string; // 이미지 경로 (선택사항)
  isHighCaffeine: boolean; // 고카페인 여부 (기준치 이상 시 true)
}
