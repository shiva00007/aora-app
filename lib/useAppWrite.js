import { useEffect, useState } from "react";

const useAppWrite = (fn) => {
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const respone = await getAllPosts();
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
