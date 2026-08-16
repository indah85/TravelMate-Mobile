import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import api, {
  WEB_BASE_URL,
} from "@/services/api";

export default function HomeScreen() {
  
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const response = await api.get("/destinations");

        console.log(
          "MOBILE DESTINATIONS:",
          response.data
        );

        setDestinations(response.data);
      } catch (error) {
        console.error(
          "GAGAL API MOBILE:",
          error
        );
      }
    };

    loadDestinations();
  }, []);

  const categories = [
    {
      name: "Wisata",
      icon: "compass-outline",
    },
    {
      name: "Kuliner",
      icon: "restaurant-outline",
    },
    {
      name: "Penginapan",
      icon: "bed-outline",
    },
    {
      name: "Budaya",
      icon: "business-outline",
    },
  ];

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
            uri: `${WEB_BASE_URL}/images/hero-indonesia.png`,
          }}
          style={styles.heroImage}
        />

        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>

          {/* BRAND */}

          <View style={styles.brandRow}>

            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logoIcon}
            />

            <Text style={styles.logo}>
              TravelMate
            </Text>

          </View>


          {/* TITLE */}

          <Text style={styles.heroTitle}>
            Jelajahi Keanekaragaman{"\n"}
            Indonesia
          </Text>


          {/* DESCRIPTION */}

          <Text style={styles.heroDescription}>
            Temukan wisata, kuliner,
            penginapan, dan budaya terbaik
            di seluruh Indonesia.
          </Text>


          {/* SEARCH */}

          <Pressable
            style={styles.search}
            onPress={() =>
              router.push("/(tabs)/explore")
            }
          >
            <Text style={styles.searchText}>
              🔍  Cari destinasi...
            </Text>
          </Pressable>

        </View>

      </View>


      {/* =========================
          CATEGORY
      ========================= */}

      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Mau cari apa?
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.categoryRow
          }
        >

          {categories.map((category) => (

            <Pressable
              key={category.name}
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/explore",
                  params: {
                    category: category.name,
                  },
                })
              }
            >

              <View style={styles.categoryIcon}>
                <Ionicons
                  name={category.icon as any}
                  size={25}
                  color="#157791"
                />
              </View>

              <Text style={styles.categoryName}>
                {category.name}
              </Text>

            </Pressable>

          ))}

        </ScrollView>

      </View>


      {/* =========================
          DESTINASI PILIHAN
      ========================= */}

      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Yang Lagi Hits
        </Text>

        <Text style={styles.sectionDescription}>
          Temukan tempat menarik untuk
          perjalananmu.
        </Text>


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.destinationRow
          }
        >

          {destinations.map((destination) => (

            <Pressable
              key={destination._id}
              style={styles.destinationCard}
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

              <Image
                source={{
                  uri: `${WEB_BASE_URL}${destination.images?.[0]}`,
                }}
                style={styles.destinationImage}
              />


              {/* INFORMATION */}

              <View style={styles.destinationInfo}>

                <Text
                  style={
                    styles.destinationCategory
                  }
                >
                  {destination.category}
                </Text>


                <Text
                  style={styles.destinationName}
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

              </View>

            </Pressable>

          ))}

        </ScrollView>

      </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },


  /* =========================
     HERO
  ========================= */

  hero: {
    height: 500,
    position: "relative",
    overflow: "hidden",
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
    backgroundColor:
      "rgba(0, 0, 0, 0.38)",
  },

  heroContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 35,
    justifyContent: "flex-end",
  },


  /* =========================
     BRAND
  ========================= */

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 45,
  },

  logoIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginRight: 8,
  },

  logo: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },


  /* =========================
     HERO TEXT
  ========================= */

  heroTitle: {
    color: "#ffffff",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700",
    marginBottom: 15,
  },

  heroDescription: {
    color: "#e8f4f6",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },


  /* =========================
     SEARCH
  ========================= */

  search: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  searchText: {
    color: "#64748b",
    fontSize: 14,
  },


  /* =========================
     SECTION
  ========================= */

  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  sectionTitle: {
    color: "#102b67",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  sectionDescription: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 18,
  },


  /* =========================
     CATEGORY
  ========================= */

  categoryRow: {
    gap: 12,
    paddingVertical: 10,
    paddingRight: 20,
  },

  categoryCard: {
    width: 105,
    height: 112,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#eaf5f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  categoryName: {
    color: "#157791",
    fontSize: 13,
    fontWeight: "700",
  },


  /* =========================
     DESTINASI PILIHAN
  ========================= */

  destinationRow: {
    gap: 14,
    paddingRight: 20,
    paddingBottom: 20,
  },

  destinationCard: {
    width: 170,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  destinationImage: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },

  destinationInfo: {
    padding: 14,
  },

  destinationCategory: {
    color: "#157791",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 5,
  },

  destinationName: {
    color: "#102b67",
    fontSize: 17,
    fontWeight: "700",
  },

  

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  destinationLocation: {
    color: "#64748b",
    fontSize: 12,
    marginLeft: 5,
  },

});