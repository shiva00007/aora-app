import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

import EmptyState from "@/components/EmptyState";

import { getUserPosts, signIn, signOut } from "@/lib/appwrite";
import useAppWrite from "@/lib/useAppWrite";
import VideoCard from "@/components/VideoCard";

import { useGlobalContext } from "@/context/globalProvider";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const { data: posts } = useAppWrite(() => getUserPosts(user.$id));
  //to refetch the video
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center ">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg "
                resizeMode="cover"
              />
            </View>
            {/* <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg "
            /> */}
            <View className="mt-5 flex-row">
              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg "
              />
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mt-5"
                titleStyles="text-xl "
              />
              <InfoBox
                title="1.5k"
                subtitle="Follwers"
                titleStyles="text-xl "
              />
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

export default Profile;
