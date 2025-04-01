"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { axiosInstance } from "@/lib/apiService";
import { API_URLS } from "@/constants/api";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

interface OnboardingUserData {
  gender: string;
  age: number;
  height: number;
}

interface OnboardingAnswersType {
  goal: string;
  timeline: string;
  experience_level: string;
  training_frequency: string;
  consultation: string;
}

interface OnboardingContextType {
  userData: Partial<OnboardingUserData>;
  onboardingAnswers: Partial<OnboardingAnswersType>;
  setGender: (gender: string) => void;
  setAge: (age: number) => void;
  setHeight: (height: number) => void;
  setGoal: (goal: string) => void;
  setTimeline: (timeline: string) => void;
  setExperienceLevel: (experience_level: string) => void;
  setTrainingFrequency: (training_frequency: string) => void;
  setConsultation: (consultation: string) => void;
  submitData: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<Partial<OnboardingUserData>>({});
  const [onboardingAnswers, setOnboardingAnswers] = useState<
    Partial<OnboardingAnswersType>
  >({});
  const router = useRouter();
  const { user } = useAuth();

  const setGender = (gender: string) => {
    setUserData((prev) => ({ ...prev, gender }));
  };

  const setAge = (age: number) => {
    setUserData((prev) => ({ ...prev, age }));
  };

  const setHeight = (height: number) => {
    setUserData((prev) => ({ ...prev, height }));
  };

  const setGoal = (goal: string) => {
    setOnboardingAnswers((prev) => ({ ...prev, goal }));
  };

  const setTimeline = (timeline: string) => {
    setOnboardingAnswers((prev) => ({ ...prev, timeline }));
  };

  const setExperienceLevel = (experience_level: string) => {
    setOnboardingAnswers((prev) => ({ ...prev, experience_level }));
  };

  const setTrainingFrequency = (training_frequency: string) => {
    setOnboardingAnswers((prev) => ({ ...prev, training_frequency }));
  };

  const setConsultation = (consultation: string) => {
    setOnboardingAnswers((prev) => ({ ...prev, consultation }));
  };

  const submitData = async () => {
    if (!user?.id) {
      throw new Error("User ID not found");
    }

    try {
      await axiosInstance.post(API_URLS.UPDATE_USER(user.id), userData);
      await onboardingCompleted();
      router.push("/");
    } catch (error) {
      console.error("Failed to update user data:", error);
      throw error;
    }
  };

  const onboardingCompleted = async () => {
    return await axiosInstance.post(
      API_URLS.CREATE_ONBOARDING_ANSWERS,
      onboardingAnswers
    );
  };

  return (
    <OnboardingContext.Provider
      value={{
        userData,
        onboardingAnswers,
        setGender,
        setAge,
        setHeight,
        setGoal,
        setTimeline,
        setExperienceLevel,
        setTrainingFrequency,
        setConsultation,
        submitData,
      }}
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
