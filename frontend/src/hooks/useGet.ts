import { useState, useEffect } from "react";
import axios from "axios";

type UseGetResult<T> = {
  data: T | null;
  isLoading: boolean;
  refresh: () => void;
};

/**
 * A custom hook which fetches data from the given URL.
 * Includes functionality to determine whether the data is still being loaded or not.
 */
export default function useGet<T = unknown>(
  url: string,
  initialState: T | null = null,
): UseGetResult<T> {
  const [data, setData] = useState<T | null>(initialState);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      console.log("useGet called with URL:", url);
      try {
        setLoading(true);
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url, refreshToggle]);

  function refresh() {
    setRefreshToggle((prev) => !prev);
  }

  return { data, isLoading, refresh };
}
