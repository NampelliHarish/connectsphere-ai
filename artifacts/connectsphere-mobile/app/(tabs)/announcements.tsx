import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { ANNOUNCEMENTS, CATEGORY_COLORS, type Announcement } from "@/constants/mockData";

const CATEGORIES = ["All", "Company", "Engineering", "HR", "Product", "Marketing", "Sales"];

function Avatar({ initials, color, size = 28 }: { initials: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: size * 0.38 }}>{initials}</Text>
    </View>
  );
}

function AnnouncementCard({ item }: { item: Announcement }) {
  const c = useColors();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.reactions);
  const catColor = CATEGORY_COLORS[item.category] ?? "#6366f1";

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikes((v) => (liked ? v - 1 : v + 1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Pressable style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
      {/* Priority stripe */}
      <View style={[styles.stripe, { backgroundColor: catColor }]} />
      <View style={styles.cardBody}>
        {/* Top row */}
        <View style={styles.cardTop}>
          <View style={[styles.catBadge, { backgroundColor: catColor + "18" }]}>
            <Text style={[styles.catBadgeText, { color: catColor }]}>{item.category}</Text>
          </View>
          {item.pinned && (
            <View style={[styles.pinnedBadge, { backgroundColor: "#f59e0b18" }]}>
              <Ionicons name="pin" size={10} color="#f59e0b" />
              <Text style={styles.pinnedText}>Pinned</Text>
            </View>
          )}
          {item.priority === "high" && (
            <View style={[styles.priorityBadge, { backgroundColor: "#ef444418" }]}>
              <Text style={[styles.priorityText, { color: "#ef4444" }]}>Priority</Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          <Text style={[styles.date, { color: c.mutedForeground }]}>{item.date}</Text>
        </View>

        {/* Title & content */}
        <Text style={[styles.title, { color: c.foreground }]}>{item.title}</Text>
        <Text style={[styles.content, { color: c.mutedForeground }]} numberOfLines={3}>{item.content}</Text>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Avatar initials={item.authorInitials} color={item.authorColor} size={22} />
          <Text style={[styles.author, { color: c.mutedForeground }]}>{item.author}</Text>
          <View style={{ flex: 1 }} />
          <Pressable onPress={toggleLike} style={styles.likeBtn} hitSlop={8}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={16} color={liked ? "#ef4444" : c.mutedForeground} />
            <Text style={[styles.likeCount, { color: liked ? "#ef4444" : c.mutedForeground }]}>{likes}</Text>
          </Pressable>
          <Ionicons name="share-outline" size={16} color={c.mutedForeground} style={{ marginLeft: 12 }} />
        </View>
      </View>
    </Pressable>
  );
}

export default function AnnouncementsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = ANNOUNCEMENTS.filter(
    (a) => activeCategory === "All" || a.category === activeCategory
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: c.card, borderBottomColor: c.border }]}>
        <Text style={[styles.headerTitle, { color: c.foreground }]}>Company Feed</Text>
        <Text style={[styles.headerSub, { color: c.mutedForeground }]}>{ANNOUNCEMENTS.length} updates</Text>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow} style={{ marginTop: 12 }}>
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            const catColor = cat === "All" ? "#6366f1" : (CATEGORY_COLORS[cat] ?? "#6366f1");
            return (
              <Pressable
                key={cat}
                style={[styles.filterChip, { backgroundColor: active ? catColor : c.secondary, borderColor: active ? catColor : c.border }]}
                onPress={() => { setActiveCategory(cat); Haptics.selectionAsync(); }}
              >
                <Text style={[styles.filterText, { color: active ? "#fff" : c.mutedForeground }]}>{cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <AnnouncementCard item={item} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="megaphone-outline" size={40} color={c.mutedForeground} />
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No announcements in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 0, borderBottomWidth: 1 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  filterRow: { paddingBottom: 14, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  listContent: { padding: 16 },
  card: { borderRadius: 16, borderWidth: 1, flexDirection: "row", overflow: "hidden" },
  stripe: { width: 3 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  catBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  pinnedBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20 },
  pinnedText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#f59e0b" },
  priorityBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20 },
  priorityText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  date: { fontSize: 11, fontFamily: "Inter_400Regular" },
  title: { fontSize: 15, fontFamily: "Inter_700Bold", lineHeight: 22, marginBottom: 6 },
  content: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 6 },
  author: { fontSize: 12, fontFamily: "Inter_400Regular" },
  likeBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  likeCount: { fontSize: 12, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
