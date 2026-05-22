import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import {
  ANNOUNCEMENTS,
  CEO_MESSAGE,
  LEADERBOARD,
  STATS,
} from "@/constants/mockData";

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

function StatTile({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  const c = useColors();
  return (
    <View style={[styles.statTile, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "18" }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color: c.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function AnnouncementPreviewCard({ item }: { item: typeof ANNOUNCEMENTS[0] }) {
  const c = useColors();
  const catColor = item.priority === "high" ? "#6366f1" : c.mutedForeground;
  return (
    <Pressable style={[styles.annoCard, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={[styles.annoPriorityBar, { backgroundColor: catColor }]} />
      <View style={styles.annoBody}>
        <View style={styles.annoHeader}>
          <View style={[styles.catBadge, { backgroundColor: catColor + "18" }]}>
            <Text style={[styles.catBadgeText, { color: catColor }]}>{item.category}</Text>
          </View>
          <Text style={[styles.annoDate, { color: c.mutedForeground }]}>{item.date}</Text>
        </View>
        <Text style={[styles.annoTitle, { color: c.foreground }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.annoContent, { color: c.mutedForeground }]} numberOfLines={2}>{item.content}</Text>
        <View style={styles.annoFooter}>
          <Avatar initials={item.authorInitials} color={item.authorColor} size={18} />
          <Text style={[styles.annoAuthor, { color: c.mutedForeground }]}>{item.author}</Text>
          <View style={styles.spacer} />
          <Ionicons name="heart-outline" size={13} color={c.mutedForeground} />
          <Text style={[styles.annoReactions, { color: c.mutedForeground }]}>{item.reactions}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <LinearGradient
        colors={["#6366f1", "#8b5cf6"]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerGreeting}>{greeting},</Text>
            <Text style={styles.headerName}>{user?.name?.split(" ")[0] ?? "there"}</Text>
          </View>
          <View style={styles.headerRight}>
            <Avatar initials={user?.initials ?? "?"} color={user?.avatarColor ?? "#6366f1"} size={40} />
          </View>
        </View>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </Text>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>At a Glance</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          <StatTile icon="people-outline" value={String(STATS.employees)} label="Employees" color="#6366f1" />
          <StatTile icon="megaphone-outline" value={String(STATS.announcements)} label="Posts" color="#8b5cf6" />
          <StatTile icon="calendar-outline" value={String(STATS.eventsThisMonth)} label="Events" color="#06b6d4" />
          <StatTile icon="star-outline" value={String(STATS.recognitionPosts)} label="Kudos" color="#f59e0b" />
        </ScrollView>

        {/* CEO Message */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>From Leadership</Text>
        </View>
        <View style={[styles.ceoCard, { backgroundColor: "#6366f1" }]}>
          <Ionicons name="chatbox-ellipses" size={22} color="rgba(255,255,255,0.6)" style={{ marginBottom: 10 }} />
          <Text style={styles.ceoQuote} numberOfLines={4}>"{CEO_MESSAGE.quote}"</Text>
          <View style={styles.ceoAuthorRow}>
            <Avatar initials={CEO_MESSAGE.initials} color="rgba(255,255,255,0.25)" size={32} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.ceoName}>{CEO_MESSAGE.name}</Text>
              <Text style={styles.ceoRole}>{CEO_MESSAGE.role}</Text>
            </View>
          </View>
        </View>

        {/* Recent Announcements */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>Recent Updates</Text>
          <Pressable>
            <Text style={[styles.seeAll, { color: c.primary }]}>See all</Text>
          </Pressable>
        </View>
        {ANNOUNCEMENTS.slice(0, 3).map((item) => (
          <AnnouncementPreviewCard key={item.id} item={item} />
        ))}

        {/* Leaderboard Preview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>Rising Stars</Text>
          <Pressable>
            <Text style={[styles.seeAll, { color: c.primary }]}>View all</Text>
          </Pressable>
        </View>
        <View style={[styles.leaderCard, { backgroundColor: c.card, borderColor: c.border }]}>
          {LEADERBOARD.slice(0, 3).map((entry, idx) => (
            <View key={entry.rank} style={[styles.leaderRow, idx < 2 && { borderBottomWidth: 1, borderBottomColor: c.border }]}>
              <Text style={[styles.leaderRank, { color: idx === 0 ? "#f59e0b" : c.mutedForeground }]}>
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
              </Text>
              <Avatar initials={entry.initials} color={entry.color} size={34} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.leaderName, { color: c.foreground }]}>{entry.name}</Text>
                <Text style={[styles.leaderDept, { color: c.mutedForeground }]}>{entry.department}</Text>
              </View>
              <Text style={[styles.leaderPoints, { color: c.primary }]}>{entry.points.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerGreeting: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)" },
  headerName: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#fff", marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  headerDate: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 8 },
  scrollContent: { paddingTop: 4 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  statsRow: { paddingHorizontal: 16, gap: 10 },
  statTile: { width: 90, borderRadius: 14, borderWidth: 1, padding: 12, alignItems: "flex-start", gap: 6 },
  statIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  ceoCard: { marginHorizontal: 16, borderRadius: 20, padding: 20 },
  ceoQuote: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#fff", lineHeight: 22, marginBottom: 16 },
  ceoAuthorRow: { flexDirection: "row", alignItems: "center" },
  ceoName: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
  ceoRole: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  annoCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 14, borderWidth: 1, flexDirection: "row", overflow: "hidden" },
  annoPriorityBar: { width: 3 },
  annoBody: { flex: 1, padding: 14 },
  annoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  catBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  annoDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  annoTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20, marginBottom: 4 },
  annoContent: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, marginBottom: 8 },
  annoFooter: { flexDirection: "row", alignItems: "center", gap: 5 },
  annoAuthor: { fontSize: 11, fontFamily: "Inter_400Regular" },
  spacer: { flex: 1 },
  annoReactions: { fontSize: 11, fontFamily: "Inter_400Regular" },
  leaderCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  leaderRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 2 },
  leaderRank: { fontSize: 16, width: 28, textAlign: "center" },
  leaderName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  leaderDept: { fontSize: 11, fontFamily: "Inter_400Regular" },
  leaderPoints: { fontSize: 14, fontFamily: "Inter_700Bold" },
  avatar: { alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontFamily: "Inter_700Bold" },
});
