import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";

import {
  router,
  useFocusEffect,
} from "expo-router";

import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import api, {
  WEB_BASE_URL,
} from "@/services/api";


export default function FavoriteScreen() {

  const [favorites, setFavorites] =
    useState<any[]>([]);

  const [recommendations, setRecommendations] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);


  /* =========================
     LOAD DATA
  ========================= */

  useFocusEffect(
    useCallback(() => {

      const loadFavorites = async () => {

        try {

          setLoading(true);
          setError(false);


          // FAVORITES

          const response =
            await api.get("/favorites");

          console.log(
            "MOBILE FAVORITES:",
            response.data
          );


          setFavorites(
            response.data
          );


          // DESTINATIONS FOR
          // RECOMMENDATIONS

          const destinationsResponse =
            await api.get(
              "/destinations"
            );


          const recommendationData =
            destinationsResponse.data
              .filter(
                (destination: any) =>
                  !response.data.some(
                    (favorite: any) =>
                      favorite._id ===
                      destination._id
                  )
              )
              .slice(0, 5);


          setRecommendations(
            recommendationData
          );


        } catch (error) {

          console.error(
            "GAGAL FAVORITES MOBILE:",
            error
          );

          setError(true);

        } finally {

          setLoading(false);

        }

      };


      loadFavorites();

    }, [])
  );


  /* =========================
     REMOVE FAVORITE
  ========================= */

  const removeFavorite = async (
    destinationId: string
  ) => {

    try {

      await api.delete(
        `/favorites/${destinationId}`
      );


      setFavorites(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              destinationId
          )
      );


      Alert.alert(
        "Favorite",
        "Destinasi dihapus dari favorite."
      );


    } catch (error: any) {

      console.error(
        "GAGAL HAPUS FAVORITE:",
        error
      );


      Alert.alert(
        "Gagal",
        error.response?.data?.message ||
          "Gagal menghapus favorite."
      );

    }

  };


  /* =========================
     CONFIRM REMOVE
  ========================= */

  const confirmRemove = (
    destination: any
  ) => {

    Alert.alert(
      "Hapus Favorite",
      `Hapus ${destination.name} dari favorite?`,
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () =>
            removeFavorite(
              destination._id
            ),
        },
      ]
    );

  };


  /* =========================
     RETURN
  ========================= */

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>

        <View style={styles.decorCircleLarge} />
        <View style={styles.decorCircleSmall} />
        <View style={styles.decorCircleTiny} />

        <Text style={styles.eyebrow}>
          KOLEKSI
        </Text>

        <Text style={styles.title}>
          Favorit
        </Text>     

        <Text style={styles.description}>
          Simpan destinasi yang ingin kamu
          kunjungi.
        </Text>

      </View>



      {/* =========================
          CONTENT
      ========================= */}

      <View style={styles.content}>

        {/* LOADING */}

        {loading && (

          <View style={styles.center}>

            <ActivityIndicator
              size="large"
              color="#157791"
            />

            <Text style={styles.loadingText}>
              Memuat favorit...
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
              Gagal memuat favorit
            </Text>

            <Text style={styles.emptyText}>
              Coba buka kembali halaman ini.
            </Text>

          </View>

        )}


        {/* DATA */}

        {!loading &&
          !error && (

            <>

              {/* =========================
                  FAVORITE
              ========================= */}

              {favorites.length > 0 ? (
                <>
                  <View style={styles.favoriteCountContainer}>
                    <Text style={styles.favoriteCount}>
                      {favorites.length} Favorit
                    </Text>
                  </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={
                    styles.favoriteRow
                  }
                >

                  {favorites.map(
                    (destination) => (

                      <Pressable
                        key={destination._id}
                        style={
                          styles.favoriteCard
                        }
                        onPress={() =>
                          router.push({
                            pathname:
                              "/detail",
                            params: {
                              id:
                                destination._id,
                            },
                          })
                        }
                      >

                        {/* IMAGE */}

                        <View
                          style={
                            styles.favoriteImageContainer
                          }
                        >

                          {destination.images?.[0] ? (

                            <Image
                              source={{
                                uri:
                                  `${WEB_BASE_URL}` +
                                  `${destination.images[0]}`,
                              }}
                              style={
                                styles.favoriteImage
                              }
                            />

                          ) : (

                            <Text
                              style={
                                styles.favoritePlaceholder
                              }
                            >
                              📍
                            </Text>

                          )}

                        </View>


                        {/* INFO */}

                        <View
                          style={
                            styles.favoriteInfo
                          }
                        >

                          <View
                            style={
                              styles.favoriteTitleRow
                            }
                          >

                            <Text
                              style={
                                styles.favoriteCategory
                              }
                            >
                              {
                                destination.category
                              }
                            </Text>


                            <Pressable
                              style={
                                styles.heartButton
                              }
                              onPress={(event) => {

                                event.stopPropagation();

                                confirmRemove(
                                  destination
                                );

                              }}
                            >

                              <Text
                                style={
                                  styles.heart
                                }
                              >
                                ♥
                              </Text>

                            </Pressable>

                          </View>


                          <Text
                            style={
                              styles.favoriteName
                            }
                            numberOfLines={1}
                          >
                            {
                              destination.name
                            }
                          </Text>


                          <View style={styles.locationRow}>
                            <Ionicons
                              name="location-outline"
                              size={14}
                              color="#157791"
                            />

                            <Text
                              style={styles.favoriteLocation}
                              numberOfLines={1}
                            >
                              {destination.province}
                            </Text>
                          </View>

                        </View>

                      </Pressable>

                    )
                  )}

                </ScrollView>
                 </>

              ) : (

                /* EMPTY FAVORITE */

                <View
                  style={styles.empty}
                >

                  <Text
                    style={styles.emptyIcon}
                  >
                    ♡
                  </Text>

                  <Text
                    style={styles.emptyTitle}
                  >
                    Belum ada favorit
                  </Text>

                  <Text
                    style={styles.emptyText}
                  >
                    Simpan destinasi yang ingin
                    kamu kunjungi.
                  </Text>

                </View>

              )}


              {/* =========================
                  REKOMENDASI
              ========================= */}

              {recommendations.length >
                0 && (

                <View
                  style={
                    styles.recommendationSection
                  }
                >

                  <Text
                    style={styles.sectionTitle}
                  >
                    Mungkin kamu juga suka
                  </Text>


                  <Text
                    style={
                      styles.sectionDescription
                    }
                  >
                    Destinasi lain yang mungkin
                    kamu suka.
                  </Text>


                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                      false
                    }
                    contentContainerStyle={
                      styles.recommendationRow
                    }
                  >

                    {recommendations.map(
                      (destination) => (

                        <Pressable
                          key={destination._id}
                          style={
                            styles.recommendationCard
                          }
                          onPress={() =>
                            router.push({
                              pathname:
                                "/detail",
                              params: {
                                id:
                                  destination._id,
                              },
                            })
                          }
                        >

                          <Image
                            source={{
                              uri:
                                `${WEB_BASE_URL}` +
                                `${destination.images?.[0]}`,
                            }}
                            style={
                              styles.recommendationImage
                            }
                          />


                          <View
                            style={
                              styles.recommendationInfo
                            }
                          >

                            <Text
                              style={
                                styles.recommendationCategory
                              }
                            >
                              {
                                destination.category
                              }
                            </Text>


                            <Text
                              style={
                                styles.recommendationName
                              }
                              numberOfLines={1}
                            >
                              {
                                destination.name
                              }
                            </Text>


                            <View style={styles.locationRow}>
                              <Ionicons
                                name="location-outline"
                                size={14}
                                color="#157791"
                              />

                              <Text
                                style={styles.recommendationLocation}
                                numberOfLines={1}
                              >
                                {destination.province}
                              </Text>
                            </View>

                          </View>

                        </Pressable>

                      )
                    )}

                  </ScrollView>

                </View>

              )}

            </>

          )}

      </View>

    </ScrollView>

  );

}


/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },


  /* HEADER */

  header: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f4f8f9",
    paddingHorizontal: 22,
    paddingTop: 65,
    paddingBottom: 30,
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
    borderRadius: 45,
    backgroundColor: "rgba(21, 119, 145, 0.06)",
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


  /* CONTENT */

  content: {
    paddingTop: 20,
    paddingLeft: 20,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingRight: 20,
  },

  loadingText: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 10,
  },


  /* EMPTY */

  empty: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
    paddingRight: 40,
  },

  emptyIcon: {
    color: "#157791",
    fontSize: 42,
    marginBottom: 15,
  },

  emptyTitle: {
    color: "#102b67",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },


  /* FAVORITE */

  favoriteRow: {
    gap: 14,
    paddingRight: 20,
    paddingBottom: 20,
  },

  favoriteCard: {
    width: 170,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  favoriteImageContainer: {
    width: "100%",
    height: 110,
    backgroundColor: "#eaf5f6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  favoriteImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  favoritePlaceholder: {
    fontSize: 30,
  },

  favoriteInfo: {
    padding: 13,
  },

  favoriteTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  favoriteCategory: {
    flex: 1,
    color: "#157791",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  favoriteName: {
    color: "#102b67",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 5,
  },

  favoriteLocation: {
    color: "#64748b",
    fontSize: 11,
    marginLeft: 5,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  heartButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  heart: {
    color: "#157791",
    fontSize: 20,
  },


  /* RECOMMENDATION */

  recommendationSection: {
    marginTop: 10,
    paddingTop: 25,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#eef2f3",
  },

  sectionTitle: {
    color: "#102b67",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  sectionDescription: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 14,
    
  },

  recommendationRow: {
    gap: 14,
    paddingRight: 20,
  },

  recommendationCard: {
    width: 170,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  recommendationImage: {
    width: "100%",
    height: 105,
    resizeMode: "cover",
  },

  recommendationInfo: {
    padding: 11,
  },

  recommendationCategory: {
    color: "#157791",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  recommendationName: {
    color: "#102b67",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  recommendationLocation: {
    color: "#64748b",
    fontSize: 11,
    marginLeft: 5,
  },

  favoriteSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  favoriteCountContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
  },

  favoriteCount: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },

});