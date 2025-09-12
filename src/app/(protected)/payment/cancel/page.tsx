"use client";

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleTryAgain = () => {
    router.back();
  };

  const handleBackToCourses = () => {
    router.push('/courses');
  };

  return (
    <>
      <Navbar title={t('payment_cancelled')} />
      <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-700">
                {t('payment_cancelled')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  {t('payment_was_cancelled')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('no_charges_were_made')}
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={handleTryAgain} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('try_again')}
                </Button>
                <Button 
                  onClick={handleBackToCourses} 
                  variant="outline" 
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('back_to_courses')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
