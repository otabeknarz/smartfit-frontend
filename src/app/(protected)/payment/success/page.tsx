"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent');
    if (payment_intent) {
      setPaymentIntentId(payment_intent);
    }
  }, [searchParams]);

  const handleBackToCourses = () => {
    router.push('/courses');
  };

  const handleBackToProfile = () => {
    router.push('/profile');
  };

  return (
    <>
      <Navbar title={t('payment_successful')} />
      <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                {t('payment_successful')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  {t('enrollment_completed_successfully')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('you_can_now_access_course_content')}
                </p>
                {paymentIntentId && (
                  <p className="text-xs text-gray-400 mt-4">
                    {t('payment_id')}: {paymentIntentId}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Button onClick={handleBackToCourses} className="w-full">
                  {t('view_my_courses')}
                </Button>
                <Button 
                  onClick={handleBackToProfile} 
                  variant="outline" 
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('back_to_profile')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
