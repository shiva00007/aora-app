import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useEffect } from "react";

import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";

import { searchPosts } from "@/lib/appwrite";
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
        data={posts}
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
