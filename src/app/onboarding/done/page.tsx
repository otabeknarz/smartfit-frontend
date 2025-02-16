"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useState } from "react";

export default function DonePage() {
  const router = useRouter();
  const { submitData } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    try {
      setIsSubmitting(true);
      await submitData();
      router.push('/');
    } catch (error) {
      console.error('Failed to save data:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-full bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              All Set!
            </h1>
            <p className="text-gray-500">
              Your profile is ready. Let's start your fitness journey!
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        <div className="mt-auto">
          <Button 
            className="w-full h-14 text-lg"
            disabled={isSubmitting}
            onClick={handleStart}
          >
            {isSubmitting ? 'Saving...' : "Let's Start"}
          </Button>
        </div>
      </div>
    </div>
  );
} 