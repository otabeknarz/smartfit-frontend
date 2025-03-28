"use client";

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/apiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  DollarSign,
  Lock,
  Play,
  Unlock,
  User,
} from "lucide-react";
import React from "react";
import { useRouter, useParams } from "next/navigation";

// Interfaces based on the provided data
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Trainer {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  video_url: string;
  order: number;
  duration: string;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
  part: string;
}

interface Part {
  id: string;
  lessons: Lesson[];
  title: string;
  slug: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
  course: string;
}

interface Course {
  id: string;
  category: Category;
  trainers: Trainer[];
  parts: Part[];
  title: string;
  slug: string;
  description: string;
  price: string;
  is_published: boolean;
  is_enrolled: boolean;
  created_at: string;
  updated_at: string;
}

function notFound() {
  return (
    <>
      <Navbar title="No title" />
      <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
        <div className="px-4 py-6 sm:py-8 max-w-screen-sm mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              No title
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Course not found
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default function CoursePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    async function getCourse() {
      try {
        const response = await axiosInstance.get(
          `/courses/get-course/${slug}/`
        );
        const data = await response.data;
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    }

    getCourse();
  }, [slug]);

  console.log(course);

  const handleEnrollment = async () => {
    if (!course) return;

    setIsEnrolling(true);
    try {
      // Here you would implement the actual enrollment logic
      // This would likely be an API call to your backend
      const response = await axiosInstance.post(
        `/courses/enroll/${course.id}/`
      );

      // On successful enrollment, refresh the course data
      const updatedCourse = await axiosInstance.get(
        `/courses/get-course/${slug}/`
      );
      setCourse(updatedCourse.data);

      // Optional: Show some success message or redirect to course content
    } catch (error) {
      console.error("Error enrolling in course:", error);
      // Optional: Show error message to the user
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!course) {
    return notFound();
  }

  // Content that's available only for enrolled users or free preview
  const canAccessLesson = (lesson: Lesson) => {
    return course.is_enrolled || lesson.is_free_preview;
  };

  // Navigate to lesson view
  const navigateToLesson = (lessonSlug: string) => {
    router.push(`/courses/${slug}/lessons/${lessonSlug}`);
  };

  return (
    <>
      <Navbar title={course?.title || "No title"} />
      <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center">
                <div className="text-white px-8">
                  <Badge className="mb-4 bg-indigo-600 hover:bg-indigo-700">
                    {course.category.name}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {course.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>
                        {course.trainers
                          .map((trainer) => trainer.name)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>
                        {new Date(course.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>${parseFloat(course.price).toFixed(2)}</span>
                    </div>
                    {course.is_enrolled && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        <Unlock size={14} className="mr-1" /> Enrolled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="trainers">Trainers</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {course.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Curriculum</CardTitle>
                      <CardDescription>
                        {course.parts?.length} sections •{" "}
                        {course.parts?.reduce(
                          (acc, part) => acc + part.lessons.length,
                          0
                        )}{" "}
                        lessons
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {course?.parts?.length > 0 &&
                        course?.parts
                          .sort((a, b) => a.order - b.order)
                          .map((part) => (
                            <div
                              key={part.id}
                              className="border rounded-lg overflow-hidden"
                            >
                              <div className="bg-gray-50 p-4 font-medium border-b">
                                {part.title}
                              </div>
                              <div className="divide-y">
                                {part.lessons
                                  .sort((a, b) => a.order - b.order)
                                  .map((lesson) => (
                                    <div
                                      key={lesson.id}
                                      className={`p-4 flex items-center justify-between ${
                                        canAccessLesson(lesson)
                                          ? "cursor-pointer hover:bg-gray-50"
                                          : "opacity-70"
                                      }`}
                                      onClick={() =>
                                        canAccessLesson(lesson) &&
                                        navigateToLesson(lesson.slug)
                                      }
                                    >
                                      <div className="flex items-center gap-3">
                                        {canAccessLesson(lesson) ? (
                                          <Play
                                            size={18}
                                            className="text-blue-600"
                                          />
                                        ) : (
                                          <Lock
                                            size={18}
                                            className="text-gray-400"
                                          />
                                        )}
                                        <div>
                                          <h4 className="font-medium">
                                            {lesson.title}
                                          </h4>
                                          {lesson.is_free_preview && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs mt-1"
                                            >
                                              Free Preview
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock size={14} />
                                        <span>{lesson.duration}</span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trainers" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Trainers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {course.trainers.map((trainer) => (
                        <div
                          key={trainer.id}
                          className="flex items-start gap-4 p-4 rounded-lg border mb-4"
                        >
                          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                            <User size={32} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {trainer.name}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Certified Fitness Trainer
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>
                    {course.is_enrolled
                      ? "You're enrolled"
                      : "Enroll in this course"}
                  </CardTitle>
                  <CardDescription>
                    {course.is_enrolled
                      ? "You have full access to all lessons and materials"
                      : "Get access to all lessons and materials"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!course.is_enrolled && (
                    <div className="text-3xl font-bold">
                      ${parseFloat(course.price).toFixed(2)}
                    </div>
                  )}

                  {course.is_enrolled ? (
                    <Button className="w-full" variant="outline">
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleEnrollment}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? "Processing..." : "Enroll Now"}
                    </Button>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>
                        {course.parts?.reduce(
                          (acc, part) => acc + part.lessons.length,
                          0
                        )}{" "}
                        lessons
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span>
                        {course.trainers.length > 1
                          ? `${course.trainers.length} Trainers`
                          : "1 Trainer"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
