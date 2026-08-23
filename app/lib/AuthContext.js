"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { isTrainerEmail } from "@/app/lib/trainerAccess";

const AuthContext = createContext(null);

function computeIsTrainer(email) {
  return isTrainerEmail(email);
}

function buildUser(session, profile) {
  if (!session?.user) return null;
  const email = session.user.email;
  const accountType = session.user.user_metadata?.accountType || "athlete";
  return {
    id: session.user.id,
    email,
    accountType,
    provider: session.user.app_metadata?.provider || "password",
    firstName:
      profile?.full_name ||
      session.user.user_metadata?.firstName ||
      email?.split("@")[0],
    createdAt: session.user.created_at,
    isTrainer: computeIsTrainer(email),
    isBusiness: accountType === "business",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(buildUser(session, profile));
      } else {
        setUser(null);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setUser(buildUser(session, profile));
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signUpAthlete = async (data) => {
    const { email, password, ...rest } = data;
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { accountType: "athlete", ...rest } },
    });
    if (error) throw error;
    return signUpData;
  };

  const signUpBusiness = async (data) => {
    const { email, password, ...rest } = data;
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { accountType: "business", ...rest } },
    });
    if (error) throw error;
    return signUpData;
  };

  const logIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logInWithProvider = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw error;
  };

  const logOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUpAthlete,
        signUpBusiness,
        logIn,
        logInWithProvider,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
