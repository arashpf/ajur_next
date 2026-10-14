import { useAuth } from "../components/auth/AuthProvider";

export default function useAuthGate() {
  const { requireAuth, openAuth } = useAuth();
  return { requireAuth, openAuth };
}