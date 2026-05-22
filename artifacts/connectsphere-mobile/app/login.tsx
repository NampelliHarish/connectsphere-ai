import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth, type UserRole } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import colors from "@/constants/colors";

const DEMO_ACCOUNTS: { role: UserRole; label: string; name: string; email: string; password: string; color: string }[] = [
  { role: "employee", label: "Employee", name: "Alex Rivera", email: "employee@connectsphere.com", password: "password123", color: "#06b6d4" },
  { role: "admin", label: "HR Admin", name: "Michael Torres", email: "admin@connectsphere.com", password: "admin123", color: "#8b5cf6" },
  { role: "ceo", label: "CEO", name: "Sarah Chen", email: "ceo@connectsphere.com", password: "ceo123", color: "#6366f1" },
];

export default function LoginScreen() {
  const { user, loginWithCredentials } = useAuth();
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("employee@connectsphere.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<UserRole>("employee");

  if (user) return <Redirect href="/(tabs)" />;

  const handleDemoSelect = (account: typeof DEMO_ACCOUNTS[0]) => {
    setActiveDemo(account.role);
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
    Haptics.selectionAsync();
  };

  const handleSignIn = async () => {
    setError(null);
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = loginWithCredentials(email, password);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } else {
      setLoading(false);
      setError(result.error ?? "Sign in failed.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LinearGradient colors={["#6366f1", "#8b5cf6", "#a78bfa"]} style={[styles.gradient, { paddingTop: topPad }]}>
        {/* Hero header */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="flash" size={32} color="#fff" />
          </View>
          <Text style={styles.appName}>ConnectSphere</Text>
          <Text style={styles.tagline}>Your company, connected.</Text>
        </View>

        {/* Card */}
        <ScrollView
          style={styles.cardScroll}
          contentContainerStyle={[styles.cardContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { backgroundColor: c.card }]}>
            <Text style={[styles.cardTitle, { color: c.foreground }]}>Sign in</Text>
            <Text style={[styles.cardSubtitle, { color: c.mutedForeground }]}>
              Use your work email or try a demo account
            </Text>

            {/* Email input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: c.foreground }]}>Email</Text>
              <View style={[styles.inputWrap, { borderColor: c.border, backgroundColor: c.secondary }]}>
                <Ionicons name="mail-outline" size={16} color={c.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: c.foreground, fontFamily: "Inter_400Regular" }]}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(null); }}
                  placeholder="you@connectsphere.com"
                  placeholderTextColor={c.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  testID="input-email"
                />
              </View>
            </View>

            {/* Password input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: c.foreground }]}>Password</Text>
              <View style={[styles.inputWrap, { borderColor: c.border, backgroundColor: c.secondary }]}>
                <Ionicons name="lock-closed-outline" size={16} color={c.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: c.foreground, fontFamily: "Inter_400Regular" }]}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(null); }}
                  placeholder="Enter password"
                  placeholderTextColor={c.mutedForeground}
                  secureTextEntry={!showPassword}
                  testID="input-password"
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color={c.mutedForeground} />
                </Pressable>
              </View>
            </View>

            {/* Error */}
            {error && (
              <View style={[styles.errorBox, { backgroundColor: "#fef2f2", borderColor: "#fecaca" }]}>
                <Ionicons name="alert-circle-outline" size={15} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Sign in button */}
            <Pressable
              style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              testID="button-sign-in"
            >
              <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.signInGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.signInText}>Sign in</Text>
                }
              </LinearGradient>
            </Pressable>

            {/* Demo accounts */}
            <View style={styles.demoSection}>
              <View style={[styles.divider, { borderColor: c.border }]}>
                <Text style={[styles.dividerText, { color: c.mutedForeground, backgroundColor: c.card }]}>
                  Demo accounts
                </Text>
              </View>
              <View style={styles.demoGrid}>
                {DEMO_ACCOUNTS.map((account) => (
                  <Pressable
                    key={account.role}
                    style={[
                      styles.demoCard,
                      { borderColor: activeDemo === account.role ? account.color : c.border, backgroundColor: c.secondary },
                      activeDemo === account.role && { backgroundColor: account.color + "15" },
                    ]}
                    onPress={() => handleDemoSelect(account)}
                    testID={`button-demo-${account.role}`}
                  >
                    <Text style={[styles.demoLabel, { color: account.color }]}>{account.label}</Text>
                    <Text style={[styles.demoName, { color: c.foreground }]}>{account.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  hero: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 24 },
  logoCircle: { width: 64, height: 64, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  appName: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.5 },
  tagline: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 4 },
  cardScroll: { flex: 1 },
  cardContent: { paddingHorizontal: 16 },
  card: { borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  cardTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 4 },
  cardSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  inputWrap: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 48 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, height: 48 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#ef4444", flex: 1 },
  signInBtn: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  signInBtnDisabled: { opacity: 0.7 },
  signInGrad: { height: 52, alignItems: "center", justifyContent: "center" },
  signInText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  demoSection: { marginTop: 24 },
  divider: { position: "relative", borderTopWidth: 1, alignItems: "center", marginBottom: 16 },
  dividerText: { position: "absolute", top: -9, fontSize: 11, fontFamily: "Inter_500Medium", paddingHorizontal: 10 },
  demoGrid: { flexDirection: "row", gap: 8 },
  demoCard: { flex: 1, borderWidth: 1.5, borderRadius: 12, padding: 10 },
  demoLabel: { fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  demoName: { fontSize: 11, fontFamily: "Inter_500Medium" },
});
