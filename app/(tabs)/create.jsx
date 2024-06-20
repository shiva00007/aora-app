import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/globalProvider";
import { crateVideo } from "@/lib/appwrite";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUpLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
      // } else {
      //   setTimeout(() => {
      //     Alert.alert("Document Picked", JSON.stringify(result, null, 2));
      //   }, 100);
    }
  };
  const submit = async () => {
    if (!form.title || form.thumbnail || form.prompt || form.video) {
      Alert.alert("Please Fill the All Fields");
    }
    setUpLoading(true);
    try {
      await crateVideo({
        ...form,
        userId: user.$id,
      });
      Alert.alert("Succcess", "Succcess Fully Upload");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUpLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-white text-2xl font-psemibold">
          Upload a Vidoe
        </Text>
        <FormField
          title="video title"
          value={form.title}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          placeholder="Give Your video a catch title"
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload a Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl "
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="h-14 w-14 border border-dashed border-secondary-100  justify-center items-center ">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2 "
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload a Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="h-16 w-full border-2 border-black-200 flex-row space-x-2 justify-center items-center ">
                <Image
                  source={icons.upload}
                  className="w-5 h-5 "
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  choose a File
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          placeholder="The AI Prompt of your Video"
          otherStyles="mt-10"
        />
        <CustomButton
          title="Submit and Publish"
          handlePress={submit}
          otherStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
