import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Video, ResizeMode } from "expo-av";

import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { icons } from "@/constants";
const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const [playing, setPlaying] = useState(false);

  const viewableItemChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  const zoomIn = {
    0: {
      scale: 0.9,
    },
    1: {
      scale: 1.1,
    },
  };
  const zoomOut = {
    0: {
      scale: 1,
    },
    1: {
      scale: 0.9,
    },
  };

  const TrendingItem = () => {
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {playing ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(stats) => {
            if (stats.didJustFinish) {
              setPlaying(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlaying(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>;
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => {
        <TrendingItem activeItem={activeItem} item={item} />;
      }}
      onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default Trending;
