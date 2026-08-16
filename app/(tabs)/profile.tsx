import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import {
  useCallback,
  useState,
} from "react";
import {
  useFocusEffect,
  router,
} from "expo-router";

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);
    
    useFocusEffect(
        useCallback(() => {
            const loadUser = async () => {
            try {
                const storedUser =
                await SecureStore.getItemAsync("user");

                if (storedUser) {
                setUser(JSON.parse(storedUser));
                } else {
                setUser(null);
                }

            } catch (error) {
                console.error(
                "GAGAL MEMUAT USER:",
                error
                );

                setUser(null);
            }
            };

            loadUser();
        }, [])
        );


    const handleLogout = () => {
        Alert.alert(
            "Keluar",
            "Apakah kamu yakin ingin keluar dari akun?",
            [
            {
                text: "Batal",
                style: "cancel",
            },
            {
                text: "Keluar",
                style: "destructive",
                onPress: async () => {
                try {
                    await SecureStore.deleteItemAsync("token");
                    await SecureStore.deleteItemAsync("user");

                    setUser(null);
                    router.replace("/(tabs)");


                } catch (error) {
                    console.error(
                    "GAGAL LOGOUT:",
                    error
                    );
                }
                },
            },
            ]
        );
        };

    return (
        <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        >

        {/* HEADER */}
        <View style={styles.header}>

         {/* ORNAMEN */}
        <View style={styles.decorCircleLarge} />
        <View style={styles.decorCircleSmall} />
        <View style={styles.decorCircleTiny} />

        {/* HEADER CONTENT */}
        <View style={styles.headerContent}>

          <Text style={styles.eyebrow}>
            AKUN
          </Text>

          <Text style={styles.title}>
            Profil
          </Text>

          <Text style={styles.description}>
            Kelola akun dan preferensi perjalananmu.
          </Text>

        </View>

      </View>

            <View style={styles.content}>

            {user ? (
                <View style={styles.profileCard}>

                <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {user.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </Text>
                </View>

                <View style={styles.profileInfo}>

                <Text style={styles.name}>
                    {user.name}
                </Text>

                <Text style={styles.email}>
                    {user.email}
                </Text>

                </View>

            </View>
            ) : (
            <View style={styles.guestCard}>

                <View style={styles.guestAvatar}>
                <Text style={styles.guestAvatarText}>
                    👤
                </Text>
                </View>

                <Text style={styles.guestTitle}>
                Belum Login
                </Text>

                <Text style={styles.guestDescription}>
                Login untuk mengelola profil,
                preferensi, dan destinasi favoritmu.
                </Text>

                <Pressable
                style={styles.loginButton}
                onPress={() =>
                    router.push("/auth/login")
                }
                >
                <Text style={styles.loginButtonText}>
                    Masuk
                </Text>
                </Pressable>

                <Pressable
                style={styles.registerButton}
                onPress={() =>
                    router.push("/auth/register")
                }
                >
                <Text style={styles.registerButtonText}>
                    Daftar
                </Text>
                </Pressable>

            </View>
            )}
        

            {user && (
            <>
                {/* MENU */}
                <Text style={styles.sectionTitle}>
                AKUN SAYA
                </Text>

                <Pressable style={styles.menuItem}>
                <View style={styles.menuIcon}>
                    <Text style={styles.iconText}>
                    👤
                    </Text>
                </View>

                <View style={styles.menuInfo}>
                    <Text style={styles.menuTitle}>
                    Informasi Akun
                    </Text>

                    <Text style={styles.menuDescription}>
                    Kelola informasi profilmu
                    </Text>
                </View>

                <Text style={styles.arrow}>
                    ›
                </Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                <View style={styles.menuIcon}>
                    <Text style={styles.iconText}>
                    ⚙
                    </Text>
                </View>

                <View style={styles.menuInfo}>
                    <Text style={styles.menuTitle}>
                    Preferensi
                    </Text>

                    <Text style={styles.menuDescription}>
                    Atur preferensi perjalananmu
                    </Text>
                </View>

                <Text style={styles.arrow}>
                    ›
                </Text>
                </Pressable>

                {/* LOGOUT */}
                <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
                >
                <Text style={styles.logoutText}>
                    Keluar
                </Text>
                </Pressable>
            </>
            )}

            </View>

        </ScrollView>
        
    );
    
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#e8f4f6",
    paddingHorizontal: 22,
    height: 300,
  },

  headerContent: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 35,
    zIndex: 2,
  },

  decorCircleLarge: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1.5,
    borderColor: "rgba(21, 119, 145, 0.10)",
    left: -100,
    top: -100,
    zIndex: 0,
  },

  decorCircleSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(21, 119, 145, 0.06)",
    left: 25,
    bottom: -65,
    zIndex: 0,
  },

  decorCircleTiny: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(16, 43, 103, 0.08)",
    left: 105,
    top: 25,
    zIndex: 0,
  },

  eyebrow: {
    color: "#157791",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },

  title: {
    color: "#102b67",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 8,
  },

  description: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#157791",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },

  name: {
    color: "#102b67",
    fontSize: 18,
    fontWeight: "700",
  },

  email: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 5,
  },

  sectionTitle: {
    color: "#157791",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 30,
    marginBottom: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    marginBottom: 10,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#eaf5f6",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    fontSize: 19,
  },

  menuInfo: {
    flex: 1,
    marginLeft: 13,
  },

  menuTitle: {
    color: "#102b67",
    fontSize: 15,
    fontWeight: "700",
  },

  menuDescription: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },

  arrow: {
    color: "#94a3b8",
    fontSize: 25,
    marginLeft: 8,
  },

    guestCard: {
    alignItems: "center",
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    },

    guestAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eaf5f6",
    alignItems: "center",
    justifyContent: "center",
    },

    guestAvatarText: {
    fontSize: 28,
    },

    guestTitle: {
    color: "#102b67",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    },

    guestDescription: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    },

    loginButton: {
    width: "100%",
    backgroundColor: "#157791",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    },

    loginButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    },

    registerButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#157791",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    },

    registerButtonText: {
    color: "#157791",
    fontSize: 15,
    fontWeight: "700",
    },


  logoutButton: {
    borderWidth: 1,
    borderColor: "#157791",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 20,
  },

  logoutText: {
    color: "#157791",
    fontSize: 15,
    fontWeight: "700",
  },

});