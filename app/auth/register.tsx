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
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";

import api from "@/services/api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert(
        "Registrasi",
        "Nama, email, dan password wajib diisi."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      Alert.alert(
        "Registrasi berhasil",
        "Akun berhasil dibuat. Silakan login.",
        [
          {
            text: "Login",
            onPress: () =>
              router.replace("/auth/login"),
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "GAGAL REGISTER MOBILE:",
        error
      );

      Alert.alert(
        "Registrasi gagal",
        error.response?.data?.message ||
          "Terjadi kesalahan saat registrasi."
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
            Buat Akun
          </Text>

          <Text style={styles.titleAccent}>
            Baru
          </Text>

          <Text style={styles.subtitle}>
            Mulai perjalananmu menjelajahi
            Indonesia bersama TravelMate.
          </Text>

        </View>


        {/* FORM */}

        <View style={styles.form}>

          {/* NAMA */}

          <Text style={styles.label}>
            Nama Lengkap
          </Text>

          <View style={styles.inputContainer}>

            <Text style={styles.inputIcon}>
              👤
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

          </View>


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


          {/* REGISTER BUTTON */}

          <Pressable
            style={[
              styles.button,
              loading &&
                styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >

            <Text style={styles.buttonText}>
              {loading
                ? "Mendaftarkan..."
                : "Buat Akun"}
            </Text>

            {!loading && (
              <Text style={styles.buttonArrow}>
                →
              </Text>
            )}

          </Pressable>


          {/* LOGIN */}

          <View style={styles.loginContainer}>

            <Text style={styles.loginText}>
              Sudah punya akun?
            </Text>

            <Pressable
              onPress={() =>
                router.replace(
                  "/auth/login"
                )
              }
            >
              <Text style={styles.loginLink}>
                Login
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
    marginBottom: 26,
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


  /* LOGIN */

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#64748b",
    fontSize: 13,
  },

  loginLink: {
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
    marginTop: 40,
  },

});