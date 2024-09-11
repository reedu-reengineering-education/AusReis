import { useState, useEffect } from "react";
import axios from "axios";

export function useUser(userId: string) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/login/${userId}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error requesting the survey data", error);
        });
    }
  }, [userId]);

  return user;
}

export default useUser;
