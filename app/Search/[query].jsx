import { View, Text, SafeAreaView, FlatList, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { RefreshControl } from "react-native-gesture-handler";
import { getAllPosts, getLatestPosts, searchPosts } from "@/lib/appwrite";
import useAppWrite from "@/lib/useAppWrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: posts, refetch } = useAppWrite(() => searchPosts(query));
  //to refetch the video
  useEffect(() => {
    refetch;
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={(item) => item.$id}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 ">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-semibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No vidoes Found"
            subtitle="No Video Search For this Query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
