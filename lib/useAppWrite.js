import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppWrite = (fn) => {
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const respone = await fn();
      setData(respone);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  //to fetch the database posts
  useEffect(() => {
    fetchData();
  }, []);
  const refetch = () => fetchData();
  return { data, isLoading, refetch };
};

export default useAppWrite;
