/** @format */

import React, { useState, useCallback, useEffect } from "react";
import { FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";

import PalettePreview from "../components/PalettePreview";

const Home = ({ navigation, route }) => {
  const newColorPalette = route.params ? route.params.newColorPalette : undefined;
  const [colorPalettes, setColorPalettes] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleFetchPalettes = useCallback(async () => {
    const result = await fetch("https://color-palette-api.kadikraman.now.sh/palettes");
    if (result.ok) {
      const palettes = await result.json();
      //updating the state with those objects
      setColorPalettes(palettes);
    }
  }, []);

  useEffect(() => {
    handleFetchPalettes();
  }, []);

  //This get trigger whenever a new color is been added to the ColorPalettes array
  useEffect(() => {
    if (newColorPalette) {
      setColorPalettes((palettes) => [newColorPalette, ...palettes]);
    }
  }, [newColorPalette]);

  const handleRefreshing = useCallback(async () => {
    setIsRefreshing(false);
    await handleFetchPalettes();
    setTimeout(() => {
      handleFetchPalettes(false);
    }, 3000);
  }, []);

  return (
    <FlatList
      style={styles.list}
      data={colorPalettes}
      keyExtractor={(item) => item.paletteName}
      renderItem={({ item }) => (
        <PalettePreview
          handlePress={() => {
            navigation.navigate("ColorPalette", item);
          }}
          colorPalette={item}
        />
      )}
      refreshing={isRefreshing}
      onRefresh={handleRefreshing}
      ListHeaderComponent={
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ColorPaletteModal");
          }}>
          <Text style={styles.bottomText}>Add a color schme</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
    backgroundColor: "white",
  },
  bottomText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "teal",
    marginBottom: 10,
  },
});

export default Home;
