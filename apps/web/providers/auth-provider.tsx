"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "~/trpc/client";
import type { RouterOutputs } from "@repo/trpc/client";

type UserType = NonNullable<RouterOutputs["auth"]["me"]>;

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string | undefined,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: user, isLoading: isUserLoading, refetch: refetchMe } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const refreshMutation = trpc.auth.refresh.useMutation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
      setLoading(false);
    }
  }, [isUserLoading]);

  // Periodic refresh of the session
  useEffect(() => {
    if (!user) return;

    // Refresh token every 10 minutes (expires in 15 minutes)
    const interval = setInterval(() => {
      refreshMutation.mutate({}, {
        onSuccess: () => {
          console.log("Session token refreshed successfully");
        },
        onError: (err) => {
          console.error("Session refresh failed", err);
          utils.auth.me.setData(undefined, null);
          toast.error("Your session has expired. Please log in again.");
          router.push("/login");
        },
      });
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, router, utils, refreshMutation]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      utils.auth.me.setData(undefined, result.user);
      toast.success(`Welcome back, ${result.user.firstName}!`);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Invalid email or password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    firstName: string,
    lastName: string | undefined,
    password: string
  ) => {
    setLoading(true);
    try {
      await registerMutation.mutateAsync({
        email,
        firstName,
        lastName: lastName || undefined,
        password,
      });
      // Register does not log in directly in backend, so we log in immediately
      const result = await loginMutation.mutateAsync({ email, password });
      utils.auth.me.setData(undefined, result.user);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create account");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutMutation.mutateAsync({});
      utils.auth.me.setData(undefined, null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err: any) {
      console.error("Logout failed", err);
      // Fallback: force clear user anyway
      utils.auth.me.setData(undefined, null);
      toast.success("Logged out");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      await refreshMutation.mutateAsync({});
      await refetchMe();
    } catch (err) {
      console.error("Manual session refresh failed", err);
      utils.auth.me.setData(undefined, null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
