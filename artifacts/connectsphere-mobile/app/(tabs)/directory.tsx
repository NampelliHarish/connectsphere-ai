import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { EMPLOYEES, type Employee } from "@/constants/mockData";

const STATUS_COLORS = { online: "#34d399", away: "#fbbf24", busy: "#f87171", offline: "#94a3b8" } as const;
const DEPTS = ["All", "Engineering", "HR", "Product", "Marketing", "Sales", "Design", "Finance", "Leadership"];

function Avatar({ initials, color, size = 40 }: { initials: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}

function EmployeeDetailModal({ employee, onClose }: { employee: Employee | null; onClose: () => void }) {
  const c = useColors();
  if (!employee) return null;
  const statusColor = STATUS_COLORS[employee.status];

  return (
    <Modal visible={!!employee} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modalCard, { backgroundColor: c.card }]} onPress={() => {}}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: c.border }]} />

          {/* Profile header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrap}>
              <Avatar initials={employee.initials} color={employee.avatarColor} size={72} />
              <View style={[styles.statusDot, { backgroundColor: statusColor, borderColor: c.card }]} />
            </View>
            <Text style={[styles.profileName, { color: c.foreground }]}>{employee.name}</Text>
            <Text style={[styles.profileRole, { color: c.mutedForeground }]}>{employee.role}</Text>
            <View style={[styles.deptBadge, { backgroundColor: employee.avatarColor + "18" }]}>
              <Text style={[styles.deptBadgeText, { color: employee.avatarColor }]}>{employee.department}</Text>
            </View>
          </View>

          {/* Details */}
          <View style={[styles.detailsSection, { borderColor: c.border }]}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={c.mutedForeground} />
              <Text style={[styles.detailText, { color: c.foreground }]}>{employee.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={16} color={c.mutedForeground} />
              <Text style={[styles.detailText, { color: c.foreground }]}>{employee.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="trophy-outline" size={16} color={c.mutedForeground} />
              <Text style={[styles.detailText, { color: c.foreground }]}>{employee.points.toLocaleString()} engagement points</Text>
            </View>
          </View>

          {/* Skills */}
          <View style={styles.skillsSection}>
            <Text style={[styles.skillsLabel, { color: c.mutedForeground }]}>SKILLS</Text>
            <View style={styles.skillsRow}>
              {employee.skills.map((s) => (
                <View key={s} style={[styles.skillChip, { backgroundColor: c.accent }]}>
                  <Text style={[styles.skillText, { color: c.primary }]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action */}
          <Pressable style={[styles.messageBtn, { backgroundColor: employee.avatarColor }]} onPress={onClose}>
            <Ionicons name="mail" size={16} color="#fff" />
            <Text style={styles.messageBtnText}>Send Email</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function EmployeeRow({ employee, onPress }: { employee: Employee; onPress: () => void }) {
  const c = useColors();
  const statusColor = STATUS_COLORS[employee.status];

  return (
    <Pressable style={[styles.row, { backgroundColor: c.card, borderColor: c.border }]} onPress={onPress} testID={`employee-${employee.id}`}>
      <View style={styles.avatarWrapSmall}>
        <Avatar initials={employee.initials} color={employee.avatarColor} size={44} />
        <View style={[styles.statusDotSmall, { backgroundColor: statusColor, borderColor: c.card }]} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, { color: c.foreground }]}>{employee.name}</Text>
        <Text style={[styles.rowRole, { color: c.mutedForeground }]}>{employee.role}</Text>
        <View style={[styles.rowDeptBadge, { backgroundColor: employee.avatarColor + "18" }]}>
          <Text style={[styles.rowDeptText, { color: employee.avatarColor }]}>{employee.department}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={c.mutedForeground} />
    </Pressable>
  );
}

export default function DirectoryScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filtered = EMPLOYEES.filter((e) => {
    const matchDept = activeDept === "All" || e.department === activeDept;
    const q = search.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.skills.some((s) => s.toLowerCase().includes(q));
    return matchDept && matchSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: c.card, borderBottomColor: c.border }]}>
        <Text style={[styles.headerTitle, { color: c.foreground }]}>People</Text>
        <Text style={[styles.headerSub, { color: c.mutedForeground }]}>{EMPLOYEES.length} colleagues</Text>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: c.secondary, borderColor: c.border }]}>
          <Feather name="search" size={15} color={c.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: c.foreground, fontFamily: "Inter_400Regular" }]}
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, role, or skill..."
            placeholderTextColor={c.mutedForeground}
            testID="input-search-directory"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <Feather name="x" size={14} color={c.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Dept filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {DEPTS.map((d) => {
            const active = d === activeDept;
            return (
              <Pressable
                key={d}
                style={[styles.filterChip, { backgroundColor: active ? c.primary : c.secondary, borderColor: active ? c.primary : c.border }]}
                onPress={() => { setActiveDept(d); Haptics.selectionAsync(); }}
              >
                <Text style={[styles.filterText, { color: active ? "#fff" : c.mutedForeground }]}>{d}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <EmployeeRow
            employee={item}
            onPress={() => {
              setSelectedEmployee(item);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 80 }]}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="user-x" size={36} color={c.mutedForeground} />
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No employees found</Text>
          </View>
        }
      />

      <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 0, borderBottomWidth: 1 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 42, marginTop: 12 },
  searchInput: { flex: 1, fontSize: 14, height: 42 },
  filterRow: { paddingVertical: 12, gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  listContent: { padding: 16 },
  row: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, padding: 14, gap: 12 },
  avatarWrapSmall: { position: "relative" },
  statusDotSmall: { position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: 5, borderWidth: 1.5 },
  rowInfo: { flex: 1, gap: 3 },
  rowName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  rowRole: { fontSize: 12, fontFamily: "Inter_400Regular" },
  rowDeptBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  rowDeptText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, minHeight: 500 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 20 },
  profileHeader: { alignItems: "center", marginBottom: 24 },
  avatarWrap: { position: "relative", marginBottom: 12 },
  statusDot: { position: "absolute", bottom: 2, right: 2, width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  profileName: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 4 },
  profileRole: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 8 },
  deptBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  deptBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  detailsSection: { borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 16, gap: 12, marginBottom: 20 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  detailText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  skillsSection: { marginBottom: 24 },
  skillsLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1, marginBottom: 10 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  skillText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  messageBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, height: 52 },
  messageBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
