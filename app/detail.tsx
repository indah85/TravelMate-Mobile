import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
} from "react-native";

import {
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";

import {
  useEffect,
  useState,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import api, {
  WEB_BASE_URL,
} from "@/services/api";





export default function DetailScreen() {
    const [isFavorite, setIsFavorite] =
        useState(false);

    const [loadingFavorite, setLoadingFavorite] =
        useState(false);

    const [isAuthenticated, setIsAuthenticated] =
        useState(false);

    const { id } = useLocalSearchParams();

    const [destination, setDestination] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);
       
    useFocusEffect(
      useCallback(() => {
        const checkAuthentication = async () => {
          const token =
            await SecureStore.getItemAsync("token");

          setIsAuthenticated(!!token);
        };

        checkAuthentication();
      }, [])
    );
    
    const toggleFavorite = async () => {
      try {
        const token =
          await SecureStore.getItemAsync("token");

        if (!token) {
          return;
        }

        setLoadingFavorite(true);

        if (isFavorite) {
          await api.delete(
            `/favorites/${destination._id}`
          );

          setIsFavorite(false);

          Alert.alert(
            "Favorite",
            "Destinasi dihapus dari favorite."
          );
        } else {
          await api.post(
            `/favorites/${destination._id}`
          );

          setIsFavorite(true);

          Alert.alert(
            "Favorite",
            "Destinasi berhasil disimpan."
          );
        }
      } catch (error: any) {
        console.error(
          "GAGAL FAVORITE MOBILE:",
          error
        );

        Alert.alert(
          "Gagal mengubah favorite",
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengubah favorite."
        );
      } finally {
        setLoadingFavorite(false);
      }
    };

  useEffect(() => {
    if (!id) return;

    const loadDestination = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/destinations/${id}`
        );

        console.log(
          "MOBILE DETAIL:",
          response.data
        );

        setDestination(response.data);

      } catch (error) {
        console.error(
          "GAGAL DETAIL:",
          error
        );

        setError(true);

      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [id]);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#157791"
        />

        <Text style={styles.loadingText}>
          Memuat destinasi...
        </Text>
      </View>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error || !destination) {
    return (
      <View style={styles.center}>

        <Text style={styles.errorIcon}>
          !
        </Text>

        <Text style={styles.errorTitle}>
          Destinasi tidak ditemukan
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ← Kembali
          </Text>
        </Pressable>

      </View>
    );
  }


  // =========================
  // DATA
  // =========================

  const category =
    destination.type ||
    destination.category ||
    "DESTINASI";

  const province =
    destination.province ||
    "Indonesia";

  const rating =
    destination.rating || "0.0";

  const description =
    destination.description ||
    "Nikmati pengalaman wisata dan keindahan lokal yang menjadi daya tarik destinasi ini.";


  const openMaps = () => {
  const latitude = destination.location?.latitude;
  const longitude = destination.location?.longitude;

      if (!latitude || !longitude) {
        Alert.alert(
          "Lokasi tidak tersedia",
          "Koordinat lokasi destinasi belum tersedia."
        );
        return;
      }

      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      Linking.openURL(url);
  };


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* =========================
          HERO
      ========================= */}

      <View style={styles.hero}>

        <Image
          source={{
            uri: `${WEB_BASE_URL}${destination.images?.[0]}`,
          }}
          style={styles.heroImage}
        />

        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>

          <Text style={styles.category}>
            {category}
          </Text>

          <Text style={styles.heroTitle}>
            {destination.name}
          </Text>

          <View style={styles.metaRow}>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color="#ebeff0"
              />

              <Text style={styles.location}>
                {destination.province}
              </Text>
            </View>

            <Text style={styles.rating}>
              ★ {rating}
            </Text>

          </View>

        </View>

      </View>


      {/* =========================
          CONTENT
      ========================= */}

      <View style={styles.content}>

        <View style={styles.storyHeader}>

        <Text style={styles.eyebrow}>
          CERITA DESTINASI
        </Text>

        {isAuthenticated && (
          <Pressable
            style={[
              styles.favoriteSmallButton,
              isFavorite &&
                styles.favoriteSmallButtonActive,
            ]}
            onPress={toggleFavorite}
            disabled={loadingFavorite}
          >
            <Text style={styles.favoriteSmallText}>
              {loadingFavorite
                ? "..."
                : isFavorite
                ? "♥"
                : "♡"}
            </Text>
          </Pressable>
        )}

      </View>

      <Text style={styles.title}>
        Mengenal {destination.name}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>


        <View style={styles.separator} />


        {/* =========================
            LOCATION
        ========================= */}

        <Text style={styles.eyebrow}>
          LOKASI
        </Text>

        <Text style={styles.locationTitle}>
          Temukan Lokasinya
        </Text>

        <Pressable
          style={styles.locationCard}
          onPress={openMaps}
        >
          <View style={styles.locationInfo}>

            <Ionicons
                name="location-outline"
                size={20}
                color="#157791"
              />

            <View style={styles.locationText}>
                <Text style={styles.mapText}>
                  {destination.name}
                </Text>

              <Text style={styles.mapLocation}>
                {province}
              </Text>
            </View>

          </View>

          <Text style={styles.mapButtonText}>
            Buka di Google Maps →
          </Text>

        </Pressable>


        

        {/* =========================
            BACK
        ========================= */}

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ← Kembali
          </Text>
        </Pressable>

      </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  center: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    color: "#64748b",
    marginTop: 12,
    fontSize: 14,
  },

  errorIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eaf5f6",
    color: "#157791",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 50,
    marginBottom: 15,
  },

  errorTitle: {
    color: "#102b67",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },

  hero: {
    height: 420,
    position: "relative",
    overflow: "hidden",
  },

  category: {
    color: "#dff3f5",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 10,
  },

    heroImage: {
      position: "absolute",
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },

    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.38)",
    },

    heroContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 70,
      paddingBottom: 40,
      justifyContent: "flex-end",
    },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  location: {
    color: "#e7eaee",
    fontSize: 13,
    marginLeft: 6,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rating: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 12,
  },

  content: {
    padding: 24,
  },

  eyebrow: {
    color: "#157791",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    color: "#102b67",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },

  description: {
    color: "#64748b",
    fontSize: 15,
    lineHeight: 24,
  },

  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 35,
  },

  locationTitle: {
    color: "#102b67",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 18,
  },

  locationCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#ffffff",
  },

  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  

  locationText: {
    marginLeft: 8,
    flex: 1,
  },

  
    mapButtonText: {
    color: "#157791",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
  },

  mapIcon: {
    fontSize: 42,
  },

  mapText: {
    color: "#102b67",
    fontSize: 17,
    fontWeight: "700",
  },

  mapLocation: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 4,
  },

  favoriteButton: {
    backgroundColor: "#157791",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 25,
  },

  favoriteButtonActive: {
    backgroundColor: "#0f5f72",
    },

  favoriteText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  backButton: {
    alignItems: "center",
    marginTop: 18,
    paddingVertical: 10,
  },

  backText: {
    color: "#157791",
    fontSize: 15,
    fontWeight: "600",
  },

  storyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  

  favoriteSmallText: {
    color: "#157791",
    fontSize: 20,
    lineHeight: 22,
  },

  favoriteSmallTextActive: {
    color: "#ffffff",
  },

  favoriteSmallButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteSmallButtonActive: {
    backgroundColor: "#eaf5f6",
    borderColor: "#157791",
  },


});