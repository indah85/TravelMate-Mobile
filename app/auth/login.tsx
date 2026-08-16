import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import api from "@/services/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] =
    useState(false);

  const [userName, setUserName] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Login",
        "Email dan password wajib diisi."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } =
        response.data;

      await SecureStore.setItemAsync(
        "token",
        token
      );

      await SecureStore.setItemAsync(
        "user",
        JSON.stringify(user)
      );

      setUserName(user.name);
      setShowSuccess(true);

    } catch (error: any) {
      console.error(
        "GAGAL LOGIN MOBILE:",
        error
      );

      Alert.alert(
        "Login gagal",
        error.response?.data?.message ||
          "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowSuccess(false)
        }
      >
        <View style={styles.modalOverlay}>

          <View style={styles.successModal}>

            <View style={styles.successIcon}>
              <Text style={styles.successCheck}>
                ✓
              </Text>
            </View>

            <Text style={styles.successTitle}>
              Yeyy,.
            </Text>

            <Text style={styles.successMessage}>
              Selamat datang kembali , {userName}!
            </Text>

            <Text style={styles.successDescription}>
              Siap jelajahi berbagai
              destinasi menarik di Indonesia.
            </Text>

            <Pressable
              style={styles.successButton}
              onPress={() => {
                setShowSuccess(false);
                router.replace("/(tabs)");
              }}
            >
              <Text style={styles.successButtonText}>
                Let's Go
              </Text>
            </Pressable>

          </View>

        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* BACK */}

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>
            ‹
          </Text>

          <Text style={styles.backText}>
            Kembali
          </Text>
        </Pressable>


        {/* BRAND */}

        <View style={styles.brandRow}>

          <Image
            source={require(
              "@/assets/images/logo.png"
            )}
            style={styles.logoIcon}
          />

          <Text style={styles.logoText}>
            TravelMate
          </Text>

        </View>


        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Selamat Datang
          </Text>

          <Text style={styles.titleAccent}>
            Kembali
          </Text>

          <Text style={styles.subtitle}>
            Login untuk melanjutkan
            perjalananmu.
          </Text>

        </View>


        {/* FORM */}

        <View style={styles.form}>

          {/* EMAIL */}

          <Text style={styles.label}>
            Email
          </Text>

          <View style={styles.inputContainer}>

            <Text style={styles.inputIcon}>
              ✉
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

          </View>


          {/* PASSWORD */}

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>

            <Text style={styles.inputIcon}>
              🔒
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              <Text style={styles.eye}>
                {showPassword ? "◉" : "◌"}
              </Text>
            </Pressable>

          </View>


          {/* LOGIN BUTTON */}

          <Pressable
            style={[
              styles.button,
              loading &&
                styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >

            <Text style={styles.buttonText}>
              {loading
                ? "Memproses..."
                : "Masuk"}
            </Text>

            {!loading && (
              <Text style={styles.buttonArrow}>
                →
              </Text>
            )}

          </Pressable>


          {/* REGISTER */}

          <View style={styles.registerContainer}>

            <Text style={styles.registerText}>
              Belum punya akun?
            </Text>

            <Pressable
              onPress={() =>
                router.push(
                  "/auth/register"
                )
              }
            >

              <Text style={styles.registerLink}>
                Daftar sekarang
              </Text>

            </Pressable>

          </View>

        </View>


        {/* FOOTER */}

        <Text style={styles.footer}>
          Jelajahi Indonesia bersama TravelMate
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 30,
  },


  /* BACK */

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 30,
  },

  backIcon: {
    color: "#102b67",
    fontSize: 30,
    lineHeight: 30,
    marginRight: 5,
  },

  backText: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
  },


  /* BRAND */

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 38,
  },

  logoIcon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
    marginRight: 8,
  },

  logoText: {
    color: "#102b67",
    fontSize: 20,
    fontWeight: "700",
  },


  /* HEADER */

  header: {
    marginBottom: 30,
  },

  title: {
    color: "#102b67",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
  },

  titleAccent: {
    color: "#157791",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
  },

  subtitle: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },


  /* FORM */

  form: {
    width: "100%",
  },

  label: {
    color: "#102b67",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 14,
  },


  /* INPUT */

  inputContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbe4e7",
    borderRadius: 14,
    backgroundColor: "#f9fbfb",
    paddingHorizontal: 14,
  },

  inputIcon: {
    width: 26,
    color: "#157791",
    fontSize: 16,
    textAlign: "center",
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: "100%",
    color: "#102b67",
    fontSize: 14,
  },

  eyeButton: {
    width: 35,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  eye: {
    color: "#64748b",
    fontSize: 18,
  },


  /* BUTTON */

  button: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#157791",
    borderRadius: 14,
    marginTop: 30,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  buttonArrow: {
    color: "#ffffff",
    fontSize: 20,
    marginLeft: 10,
  },


  /* REGISTER */

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  registerText: {
    color: "#64748b",
    fontSize: 13,
  },

  registerLink: {
    color: "#157791",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 5,
  },


  /* FOOTER */

  footer: {
    color: "#94a3b8",
    fontSize: 11,
    textAlign: "center",
    marginTop: 45,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  successModal: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
  },

  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e8f5f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  successCheck: {
    color: "#157791",
    fontSize: 34,
    fontWeight: "700",
  },

  successTitle: {
    color: "#102b67",
    fontSize: 21,
    fontWeight: "700",
  },

  successMessage: {
    color: "#157791",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 7,
  },

  successDescription: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 10,
  },

  successButton: {
    width: "100%",
    height: 50,
    borderRadius: 13,
    backgroundColor: "#157791",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  successButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

});