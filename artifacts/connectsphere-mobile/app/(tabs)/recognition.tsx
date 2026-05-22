import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { EMPLOYEES, RECOGNITION, type Recognition } from "@/constants/mockData";
import { useAuth } from "@/context/AuthContext";

const BADGE_OPTIONS = [
  { name: "Innovator", color: "#6366f1" },
  { name: "Team Player", color: "#3b82f6" },
  { name: "Top Performer", color: "#f59e0b" },
  { name: "Leader", color: "#8b5cf6" },
  { name: "Culture Champion", color: "#ef4444" },
  { name: "Mentor", color: "#10b981" },
];

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}

function RecognitionCard({ item }: { item: Recognition }) {
  const c = useColors();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikes((v) => (liked ? v - 1 : v + 1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
      {/* From → To header */}
      <View style={styles.cardFrom}>
        <Avatar initials={item.fromInitials} color={item.fromColor} size={36} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.fromName, { color: c.foreground }]}>{item.from}</Text>
          <Text style={[styles.fromLabel, { color: c.mutedForeground }]}>recognized</Text>
        </View>
        <Text style={[styles.cardDate, { color: c.mutedForeground }]}>{item.date}</Text>
      </View>

      {/* To person */}
      <View style={[styles.toSection, { backgroundColor: c.secondary, borderRadius: 12 }]}>
        <Avatar initials={item.toInitials} color={item.toColor} size={44} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[styles.toName, { color: c.foreground }]}>{item.to}</Text>
          <View style={[styles.badgeChip, { backgroundColor: item.badgeColor }]}>
            <Ionicons name="ribbon" size={10} color="#fff" />
            <Text style={styles.badgeChipText}>{item.badge}</Text>
          </View>
        </View>
      </View>

      {/* Message */}
      <Text style={[styles.message, { color: c.foreground }]}>"{item.message}"</Text>

      {/* Like footer */}
      <View style={styles.cardFooter}>
        <Pressable onPress={toggleLike} style={styles.likeBtn} hitSlop={8}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#ef4444" : c.mutedForeground} />
          <Text style={[styles.likeCount, { color: liked ? "#ef4444" : c.mutedForeground }]}>{likes}</Text>
        </Pressable>
        <Text style={[styles.footerNote, { color: c.mutedForeground }]}>Tap to celebrate</Text>
      </View>
    </View>
  );
}

function SendKudosModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const c = useColors();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedBadge, setSelectedBadge] = useState<string>("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!selectedEmployee || !selectedBadge || !message.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedEmployee("");
      setSelectedBadge("");
      setMessage("");
      onClose();
    }, 1500);
  };

  const badge = BADGE_OPTIONS.find((b) => b.name === selectedBadge);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.kudosSheet, { backgroundColor: c.card, paddingBottom: insets.bottom + 24 }]} onPress={() => {}}>
          <View style={[styles.handle, { backgroundColor: c.border }]} />

          {sent ? (
            <View style={styles.sentState}>
              <Ionicons name="checkmark-circle" size={56} color="#10b981" />
              <Text style={[styles.sentTitle, { color: c.foreground }]}>Kudos Sent!</Text>
              <Text style={[styles.sentSub, { color: c.mutedForeground }]}>Your appreciation has been shared.</Text>
            </View>
          ) : (
            <>
              <Text style={[styles.sheetTitle, { color: c.foreground }]}>Send Kudos</Text>
              <Text style={[styles.sheetSub, { color: c.mutedForeground }]}>Recognize a colleague's great work</Text>

              <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>To</Text>
              <View style={styles.employeeGrid}>
                {EMPLOYEES.slice(0, 6).map((e) => (
                  <Pressable
                    key={e.id}
                    style={[styles.employeeChip, { borderColor: selectedEmployee === e.id ? e.avatarColor : c.border, backgroundColor: selectedEmployee === e.id ? e.avatarColor + "18" : c.secondary }]}
                    onPress={() => { setSelectedEmployee(e.id); Haptics.selectionAsync(); }}
                  >
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: e.avatarColor, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: 8 }}>{e.initials}</Text>
                    </View>
                    <Text style={[styles.employeeChipText, { color: selectedEmployee === e.id ? e.avatarColor : c.foreground }]} numberOfLines={1}>{e.name.split(" ")[0]}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: c.mutedForeground, marginTop: 16 }]}>Badge</Text>
              <View style={styles.badgeGrid}>
                {BADGE_OPTIONS.map((b) => (
                  <Pressable
                    key={b.name}
                    style={[styles.badgeOption, { borderColor: selectedBadge === b.name ? b.color : c.border, backgroundColor: selectedBadge === b.name ? b.color : c.secondary }]}
                    onPress={() => { setSelectedBadge(b.name); Haptics.selectionAsync(); }}
                  >
                    <Text style={[styles.badgeOptionText, { color: selectedBadge === b.name ? "#fff" : c.foreground }]}>{b.name}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: c.mutedForeground, marginTop: 16 }]}>Message</Text>
              <TextInput
                style={[styles.messageInput, { backgroundColor: c.secondary, borderColor: c.border, color: c.foreground, fontFamily: "Inter_400Regular" }]}
                value={message}
                onChangeText={setMessage}
                placeholder="What did they do that inspired you?"
                placeholderTextColor={c.mutedForeground}
                multiline
                maxLength={200}
              />
              <Text style={[styles.charCount, { color: c.mutedForeground }]}>{message.length}/200</Text>

              <Pressable
                style={[styles.sendBtn, { backgroundColor: badge?.color ?? "#6366f1", opacity: (!selectedEmployee || !selectedBadge || !message.trim()) ? 0.5 : 1 }]}
                onPress={handleSend}
                disabled={!selectedEmployee || !selectedBadge || !message.trim()}
              >
                <Ionicons name="star" size={16} color="#fff" />
                <Text style={styles.sendBtnText}>Send Recognition</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function RecognitionScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const [kudosVisible, setKudosVisible] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: c.card, borderBottomColor: c.border }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: c.foreground }]}>Kudos Wall</Text>
            <Text style={[styles.headerSub, { color: c.mutedForeground }]}>Celebrating our people</Text>
          </View>
          <Pressable
            style={[styles.kudosBtn, { backgroundColor: "#f59e0b" }]}
            onPress={() => setKudosVisible(true)}
            testID="button-send-kudos"
          >
            <Ionicons name="star" size={15} color="#fff" />
            <Text style={styles.kudosBtnText}>Send Kudos</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={RECOGNITION}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <RecognitionCard item={item} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 80 }]}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />

      <SendKudosModal visible={kudosVisible} onClose={() => setKudosVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  kudosBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  kudosBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
  listContent: { padding: 16 },
  card: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 12 },
  cardFrom: { flexDirection: "row", alignItems: "center" },
  fromName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  fromLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  cardDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  toSection: { flexDirection: "row", alignItems: "center", padding: 12 },
  toName: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 6 },
  badgeChip: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeChipText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },
  message: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, fontStyle: "italic" },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, paddingTop: 10 },
  likeBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  likeCount: { fontSize: 13, fontFamily: "Inter_500Medium" },
  footerNote: { fontSize: 11, fontFamily: "Inter_400Regular" },
  // Modal
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  kudosSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 4 },
  sheetSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 20 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 },
  employeeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  employeeChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, maxWidth: 110 },
  employeeChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  badgeOption: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  badgeOptionText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  messageInput: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 80, fontSize: 14, lineHeight: 22 },
  charCount: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right", marginTop: 4 },
  sendBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14, marginTop: 16 },
  sendBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  sentState: { alignItems: "center", paddingVertical: 32, gap: 12 },
  sentTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  sentSub: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
