import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to validate JWT token asynchronously
 * @returns An object containing authentication state and loading state
 */
export const useJwtValidation = () => {
  const { isJwtValid, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext)!;
  const [validJwt, setValidJwt] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setValidJwt(true);
      setIsLoading(false);
      return;
    }

    const validateJwt = async () => {
      try {
        console.log("The hook is checking JWT");
        const valid = await isJwtValid();
        setValidJwt(valid);
        setIsAuthenticated(valid);
      } catch (error) {
        console.error("Error validating JWT:", error);
        setValidJwt(false);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateJwt();
  }, []);

  return { validJwt, isLoading };
};
