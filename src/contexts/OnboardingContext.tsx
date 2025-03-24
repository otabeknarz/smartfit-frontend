"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { axiosInstance } from "@/lib/apiService";
import { API_URLS } from "@/constants/api";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

interface OnboardingData {
  gender: string;
  age: number;
  height: number;
}

interface OnboardingContextType {
  data: Partial<OnboardingData>;
  setGender: (gender: string) => void;
  setAge: (age: number) => void;
  setHeight: (height: number) => void;
  submitData: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const router = useRouter();
  const { user } = useAuth();

  const setGender = (gender: string) => {
    setData((prev) => ({ ...prev, gender }));
  };

  const setAge = (age: number) => {
    setData((prev) => ({ ...prev, age }));
  };

  const setHeight = (height: number) => {
    setData((prev) => ({ ...prev, height }));
  };

  const submitData = async () => {
    if (!user?.id) {
      throw new Error("User ID not found");
    }

    try {
      await axiosInstance.post(API_URLS.UPDATE_USER(user.id), data);
      router.push("/");
    } catch (error) {
      console.error("Failed to update user data:", error);
      throw error;
    }
  };

  return (
    <OnboardingContext.Provider
      value={{ data, setGender, setAge, setHeight, submitData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};
