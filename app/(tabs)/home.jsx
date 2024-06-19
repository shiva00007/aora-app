import { View, Text, SafeAreaView, FlatList, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { RefreshControl } from "react-native-gesture-handler";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import useAppWrite from "@/lib/useAppWrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/globalProvider";

const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const { data: posts, refetch } = useAppWrite(getAllPosts);
  const { data: LatestPosts } = useAppWrite(getLatestPosts);

  //to refetch the video
  const onRefresh = async () => {
    setRefreshing(true);
    //when new video contain
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={(item) => item.$id}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back ,
                </Text>
                <Text className="text-2xl font-semibold text-white">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="h-9 w-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 mb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={LatestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No vidoes Found"
            subtitle="Be the First one too upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
