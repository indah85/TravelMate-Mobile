import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import api, {
  WEB_BASE_URL,
} from "@/services/api";

export default function ExploreScreen() {
  const params = useLocalSearchParams();

  const categoryParam =
    typeof params.category === "string"
      ? params.category
      : "";

  const [search, setSearch] = useState("");
  const [destinations, setDestinations] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoading(true);
        setError(false);

        const response =
          await api.get("/destinations");

        console.log(
          "MOBILE EXPLORE:",
          response.data
        );

        setDestinations(response.data);
      } catch (error) {
        console.error(
          "GAGAL EXPLORE:",
          error
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  const filtered = useMemo(() => {
    return destinations.filter(
      (destination) => {
        const keyword =
          search.toLowerCase().trim();

        const matchesSearch =
          !keyword ||
          destination.name
            ?.toLowerCase()
            .includes(keyword) ||
          destination.category
            ?.toLowerCase()
            .includes(keyword) ||
          destination.city
            ?.toLowerCase()
            .includes(keyword) ||
          destination.province
            ?.toLowerCase()
            .includes(keyword);

        const matchesCategory =
          !categoryParam ||
          destination.category
            ?.toLowerCase() ===
            categoryParam.toLowerCase();

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    destinations,
    search,
    categoryParam,
  ]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <View style={styles.decorCircleLarge} />
        <View style={styles.decorCircleSmall} />
        <View style={styles.decorCircleTiny} />

        <Text style={styles.eyebrow}>
          JELAJAH
        </Text>

        <Text style={styles.title}>
          Temukan Tempatmu
        </Text>

        <Text style={styles.description}>
          Jelajahi berbagai pengalaman terbaik
          di Indonesia.
        </Text>


        {/* SEARCH */}

        <TextInput
          style={styles.search}
          placeholder="Cari destinasi, kuliner, hotel..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />

      </View>


      {/* CONTENT */}

      <View style={styles.content}>

        <Text style={styles.resultTitle}>
          {search
            ? `Hasil pencarian "${search}"`
            : categoryParam
            ? `Kategori ${categoryParam}`
            : "Semua Destinasi"}
        </Text>


        {/* LOADING */}

        {loading && (
          <View style={styles.center}>

            <ActivityIndicator
              size="large"
              color="#157791"
            />

            <Text style={styles.loadingText}>
              Memuat destinasi...
            </Text>

          </View>
        )}


        {/* ERROR */}

        {!loading && error && (
          <View style={styles.empty}>

            <Text style={styles.emptyIcon}>
              !
            </Text>

            <Text style={styles.emptyTitle}>
              Gagal memuat destinasi
            </Text>

            <Text style={styles.emptyText}>
              Periksa koneksi dan coba lagi.
            </Text>

          </View>
        )}


        {/* RESULTS */}

        {!loading &&
          !error &&
          filtered.map(
            (destination) => (

              <Pressable
                key={destination._id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/detail",
                    params: {
                      id: destination._id,
                    },
                  })
                }
              >

                {/* IMAGE */}

                <View
                  style={
                    styles.imagePlaceholder
                  }
                >

                  {destination.images?.[0] ? (

                    <Image
                      source={{
                        uri:
                          `${WEB_BASE_URL}` +
                          `${destination.images[0]}`,
                      }}
                      style={styles.exploreImage}
                    />

                  ) : (

                    <Text
                      style={{
                        fontSize: 28,
                      }}
                    >
                      📍
                    </Text>

                  )}

                </View>


                {/* INFO */}

                <View style={styles.cardContent}>

                  <Text
                    style={styles.category}
                  >
                    {destination.category}
                  </Text>

                  <Text
                    style={styles.name}
                    numberOfLines={1}
                  >
                    {destination.name}
                  </Text>

                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#157791"
                    />

                    <Text
                      style={styles.destinationLocation}
                      numberOfLines={1}
                    >
                      {destination.province}
                    </Text>
                  </View>

                  {destination.rating !==
                    undefined && (
                    <Text
                      style={styles.rating}
                    >
                      ★{" "}
                      {destination.rating}
                    </Text>
                  )}

                </View>

                <Text style={styles.arrow}>
                  →
                </Text>

              </Pressable>
            )
          )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          filtered.length === 0 && (

            <View style={styles.empty}>

              <Text style={styles.emptyIcon}>
                🔍
              </Text>

              <Text
                style={styles.emptyTitle}
              >
                Destinasi tidak ditemukan
              </Text>

              <Text
                style={styles.emptyText}
              >
                Coba gunakan kata pencarian
                lain.
              </Text>

            </View>
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
    backgroundColor: "#f4f8f9",
    paddingHorizontal: 22,
    paddingTop: 65,
    paddingBottom: 28,
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
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  search: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe4e7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#102b67",
  },

  content: {
    padding: 20,
  },

  resultTitle: {
    color: "#102b67",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },

  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#eaf5f6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  exploreImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  cardContent: {
    flex: 1,
    marginLeft: 14,
  },

  category: {
    color: "#157791",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  name: {
    color: "#102b67",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 3,
  },

  location: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  
  destinationLocation: {
    color: "#64748b",
    fontSize: 12,
    marginLeft: 5,
  },

  rating: {
    color: "#d97706",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },

  arrow: {
    color: "#157791",
    fontSize: 22,
    fontWeight: "700",
  },

  center: {
    alignItems: "center",
    paddingVertical: 50,
  },

  loadingText: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 10,
  },

  empty: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 15,
  },

  emptyTitle: {
    color: "#102b67",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyText: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
  },

  decorCircleLarge: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1.5,
    borderColor: "rgba(21, 119, 145, 0.10)",
    right: -100,
    top: -100,
    zIndex: 0,
  },

  decorCircleSmall: {
    position: "absolute",
    width: 150,
    height: 100,
    borderRadius: 60,
    backgroundColor: "rgba(22, 88, 106, 0.06)",
    right: 15,
    bottom: -50,
    zIndex: 0,
  },

  decorCircleTiny: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(16, 43, 103, 0.08)",
    right: 105,
    top: 25,
    zIndex: 0,
  },

});