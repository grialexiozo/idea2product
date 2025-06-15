import { UserContext } from "@/lib/types/auth/user-context.bean";
import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "@/app/actions/auth/get-user-info";

export function useUserContext() {
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserContext = async () => {
      try {
        const userInfo = await getCurrentUserProfile();
        if (userInfo) {
          setUserContext({
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            role: userInfo.role,
            subscription: userInfo.subscription
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch user context"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserContext();
  }, []);

  return { userContext, loading, error };
} 