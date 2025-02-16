"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useState } from "react";

export default function AgePage() {
  const router = useRouter();
  const { setAge } = useOnboarding();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const age = parseInt(value);
    if (age < 12 || age > 100) {
      setError('Please enter a valid age between 12 and 100');
      return;
    }
    setAge(age);
    router.push('/onboarding/height');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-3/4 bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              How old are you?
            </h1>
            <p className="text-gray-500">
              Your age helps us recommend appropriate exercises
            </p>
          </div>

          <div className="w-full space-y-4">
            <Input
              type="number"
              placeholder="Enter your age"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
              }}
              className="text-center text-lg h-14"
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            className="w-full h-14 text-lg"
            disabled={!value}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
} 