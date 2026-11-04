import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, type AuthProvider as AuthProviderId } from "@/services/auth.service";
import type { AuthCredentials, CitizenProfile, RegisterInput } from "@/types";

const STORAGE_KEY = "mpm.session";

export type AuthTab = "login" | "register";

interface AuthContextValue {
  user: CitizenProfile | null;
  isAuthenticated: boolean;
  initializing: boolean;
  modalOpen: boolean;
  tab: AuthTab;
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
  setTab: (tab: AuthTab) => void;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  loginWithProvider: (provider: AuthProviderId) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const readStoredUser = (): CitizenProfile | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CitizenProfile) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CitizenProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("login");

  useEffect(() => {
    setUser(readStoredUser());
    setInitializing(false);
  }, []);

  const persist = useCallback((profile: CitizenProfile | null) => {
    setUser(profile);
    if (typeof window === "undefined") return;
    if (profile) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initializing,
      modalOpen,
      tab,
      openAuth: (nextTab) => {
        if (nextTab) setTab(nextTab);
        setModalOpen(true);
      },
      closeAuth: () => setModalOpen(false),
      setTab,
      login: async (credentials) => {
        const profile = await authService.login(credentials);
        persist(profile);
        setModalOpen(false);
      },
      register: async (input) => {
        const profile = await authService.register(input);
        persist(profile);
        setModalOpen(false);
      },
      loginWithProvider: async (provider) => {
        const profile = await authService.loginWithProvider(provider);
        persist(profile);
        setModalOpen(false);
      },
      logout: () => {
        void authService.logout();
        persist(null);
      },
    }),
    [initializing, modalOpen, persist, tab, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
