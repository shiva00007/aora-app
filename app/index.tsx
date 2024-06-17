import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-600">
      <Text className="font-pextralight">
        Edit app/index.tsx to edit this screen.
      </Text>
      <StatusBar style="auto" />
      <Link href={"/home"} className="bg-black-100">
        Go To home
      </Link>
    </View>
  );
}
