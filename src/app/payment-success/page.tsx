"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { axiosInstance } from '@/lib/apiService';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [courseSlug, setCourseSlug] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent');
    const course_slug = searchParams.get('course-slug');
    
    if (payment_intent) {
      setPaymentIntentId(payment_intent);
    }
    
    if (course_slug) {
      setCourseSlug(course_slug);
      fetchCourse(course_slug);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchCourse = async (slug: string) => {
    try {
      const response = await axiosInstance.get(`/courses/get-course/${slug}/`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCourse = () => {
    if (courseSlug) {
      router.push(`/courses/${courseSlug}`);
    }
  };

  const handleBackToCourses = () => {
    router.push('/courses');
  };

  const handleBackToProfile = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return (
      <>
        <Navbar title={t('payment_successful')} />
        <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto px-4 py-8 max-w-md">
            <Card className="text-center">
              <CardContent className="py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">{t('loading')}</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

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
                {course && (
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <h3 className="font-semibold text-blue-900">{course.title}</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {t('you_can_now_access_course_content')}
                    </p>
                  </div>
                )}
                {!course && (
                  <p className="text-sm text-gray-500">
                    {t('you_can_now_access_course_content')}
                  </p>
                )}
                {paymentIntentId && (
                  <p className="text-xs text-gray-400 mt-4">
                    {t('payment_id')}: {paymentIntentId}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {course && (
                  <Button onClick={handleViewCourse} className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {t('start_learning')}
                  </Button>
                )}
                <Button onClick={handleBackToCourses} variant={course ? "outline" : "default"} className="w-full">
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
