import { useContext, useEffect, useState } from "react";
import { User } from "../types/types";
import { UsersContext } from "../context/UsersContext";

export default function useCurrentUser(): User | null {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { getCurrentUser } = useContext(UsersContext);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  return currentUser;
}
