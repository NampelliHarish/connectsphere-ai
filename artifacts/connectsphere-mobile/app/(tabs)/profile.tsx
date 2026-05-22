import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { EMPLOYEES } from "@/constants/mockData";

const ROLE_BADGE_COLOR: Record<string, string> = {
  employee: "#06b6d4",
  admin: "#8b5cf6",
  ceo: "#6366f1",
};

const ROLE_LABEL: Record<string, string> = {
  employee: "Employee",
  admin: "HR Admin",
  ceo: "CEO",
};

function SettingRow({ icon, label, value, onPress, destructive }: {
  icon: string; label: string; value?: string; onPress?: () => void; destructive?: boolean;
}) {
  const c = useColors();
  return (
    <Pressable style={[styles.settingRow, { borderBottomColor: c.border }]} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: destructive ? "#ef444418" : c.secondary }]}>
        <Ionicons name={icon as any} size={18} color={destructive ? "#ef4444" : c.primary} />
      </View>
      <Text style={[styles.settingLabel, { color: destructive ? "#ef4444" : c.foreground }]}>{label}</Text>
      <View style={{ flex: 1 }} />
      {value && <Text style={[styles.settingValue, { color: c.mutedForeground }]}>{value}</Text>}
      {!destructive && <Feather name="chevron-right" size={16} color={c.mutedForeground} />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Find matching employee data
  const empData = EMPLOYEES.find((e) => e.initials === user?.initials) ?? EMPLOYEES[2];
  const roleColor = ROLE_BADGE_COLOR[user?.systemRole ?? "employee"] ?? "#6366f1";
  const roleLabel = ROLE_LABEL[user?.systemRole ?? "employee"] ?? "Employee";

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    logout();
    router.replace("/login");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile hero */}
      <LinearGradient colors={[roleColor, roleColor + "aa"]} style={[styles.hero, { paddingTop: topPad + 16 }]}>
        <View style={styles.avatarWrap}>
          <View style={[styles.avatarCircle, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
            <Text style={styles.avatarInitials}>{user?.initials ?? "?"}</Text>
          </View>
        </View>
        <Text style={styles.heroName}>{user?.name ?? "—"}</Text>
        <Text style={styles.heroRole}>{user?.role ?? "—"}</Text>
        <View style={[styles.roleBadge, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
          <Text style={styles.roleBadgeText}>{roleLabel}</Text>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: c.primary }]}>{empData.points.toLocaleString()}</Text>
          <Text style={[styles.statLabel, { color: c.mutedForeground }]}>Eng. Points</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: c.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: c.primary }]}>3</Text>
          <Text style={[styles.statLabel, { color: c.mutedForeground }]}>Badges</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: c.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: c.primary }]}>12</Text>
          <Text style={[styles.statLabel, { color: c.mutedForeground }]}>Kudos Given</Text>
        </View>
      </View>

      {/* Info card */}
      <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.sectionTitle, { color: c.mutedForeground }]}>PROFILE</Text>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={16} color={c.mutedForeground} />
          <Text style={[styles.infoText, { color: c.foreground }]}>{user?.email ?? "—"}</Text>
        </View>
        <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: c.border }]}>
          <Ionicons name="business-outline" size={16} color={c.mutedForeground} />
          <Text style={[styles.infoText, { color: c.foreground }]}>{user?.department ?? "—"}</Text>
        </View>
        <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: c.border }]}>
          <Ionicons name="location-outline" size={16} color={c.mutedForeground} />
          <Text style={[styles.infoText, { color: c.foreground }]}>{empData.location}</Text>
        </View>
        <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: c.border }]}>
          <Ionicons name="calendar-outline" size={16} color={c.mutedForeground} />
          <Text style={[styles.infoText, { color: c.foreground }]}>Joined {new Date(empData.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</Text>
        </View>
      </View>

      {/* Skills */}
      <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.sectionTitle, { color: c.mutedForeground }]}>SKILLS</Text>
        <View style={styles.skillsWrap}>
          {empData.skills.map((s) => (
            <View key={s} style={[styles.skillChip, { backgroundColor: c.accent }]}>
              <Text style={[styles.skillText, { color: c.primary }]}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Settings */}
      <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.sectionTitle, { color: c.mutedForeground }]}>SETTINGS</Text>
        <SettingRow icon="notifications-outline" label="Notifications" value="On" />
        <SettingRow icon="moon-outline" label="Appearance" value={colorScheme === "dark" ? "Dark" : "Light"} />
        <SettingRow icon="shield-checkmark-outline" label="Privacy" />
        <SettingRow icon="help-circle-outline" label="Help & Support" />
      </View>

      {/* Logout */}
      <Pressable style={[styles.logoutBtn, { backgroundColor: "#ef444414", borderColor: "#ef444430" }]} onPress={handleLogout} testID="button-logout">
        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>

      <Text style={[styles.versionText, { color: c.mutedForeground }]}>ConnectSphere Mobile v1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { alignItems: "center", paddingHorizontal: 20, paddingBottom: 28 },
  avatarWrap: { marginBottom: 14 },
  avatarCircle: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
  avatarInitials: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#fff" },
  heroName: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 4 },
  heroRole: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.85)", marginBottom: 10 },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  roleBadgeText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#fff" },
  statsRow: { flexDirection: "row", marginHorizontal: 16, marginTop: -1, borderRadius: 16, borderWidth: 1, padding: 16, justifyContent: "space-around" },
  statItem: { alignItems: "center", gap: 4 },
  statNumber: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statDivider: { width: 1, height: "100%" },
  section: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, borderWidth: 1, overflow: "hidden", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  sectionTitle: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1.2, marginBottom: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  infoText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingBottom: 12 },
  skillChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  skillText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, borderBottomWidth: 1 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  settingLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  settingValue: { fontSize: 13, fontFamily: "Inter_400Regular", marginRight: 6 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 16, marginTop: 20, borderRadius: 14, borderWidth: 1, height: 52 },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#ef4444" },
  versionText: { textAlign: "center", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 20, marginBottom: 8 },
});
