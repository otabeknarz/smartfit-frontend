"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  Bookmark,
  Users,
  Calendar,
  DollarSign,
  Tag,
  ArrowRight,
  X,
  Play,
  Lock,
} from "lucide-react";

// Types based on the backend API response
interface Trainer {
  id: string;
  name: string;
  username: string;
  phone_number?: string;
  gender?: string;
  age?: number;
  height?: number;
  date_joined?: string;
}

interface Lesson {
  id: string;
  title: string;
  slug: string; // Adding slug field for navigation
  description: string;
  video_url: string;
  duration: string;
  is_free_preview: boolean;
  order: number;
}

interface Part {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Course {
  id: string;
  title: string;
  slug: string; // Adding slug field for consistency
  description: string;
  price: string;
  is_published: boolean;
  category: Category;
  trainers: Trainer[];
  parts: Part[];
}

interface CourseDrawerProps {
  course: Course | null;
  slug: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEnrolled: boolean;
  onEnroll: (courseId: string, slug: string) => void;
}

const CourseDrawer: React.FC<CourseDrawerProps> = ({
  course,
  slug,
  isOpen,
  onOpenChange,
  isEnrolled,
  onEnroll,
}) => {
  const router = useRouter();

  // Function to get trainer profile image URL or a default placeholder
  const getTrainerAvatarUrl = (trainer: Trainer) => {
    if (trainer.gender === "FEMALE") {
      return "/female-trainer.png";
    } else if (trainer.gender === "MALE") {
      return "/male-trainer.png";
    }
    // Default fallback
    return "/fitness-1.png";
  };

  // Function to get trainer role based on their information
  const getTrainerRole = (trainer: Trainer) => {
    if (!trainer) return "Fitness Trainer";

    let role = "Fitness Trainer";

    // You can customize this based on your backend data
    if (trainer.gender === "FEMALE") {
      role = "Women's Fitness Specialist";
    } else if (trainer.gender === "MALE") {
      role = "Personal Trainer";
    }

    // You could add experience level based on age or other factors
    if (trainer.age && trainer.age > 35) {
      role = "Senior " + role;
    }

    return role;
  };

  // Function to navigate to lesson
  const navigateToLesson = (courseSlug: string, lessonSlug: string, isFreePreview: boolean) => {
    // Only navigate if the user is enrolled or the lesson is a free preview
    if (isEnrolled || isFreePreview) {
      router.push(`/courses/${courseSlug}/lessons/${lessonSlug}`);
      // Close the drawer
      onOpenChange(false);
    }
  };

  if (!course) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        <DrawerHeader className="relative px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {course.category && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-100 text-xs"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {course.category.name}
                </Badge>
              )}
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-100 text-xs"
              >
                <DollarSign className="w-3 h-3 mr-1" />$
                {parseFloat(course.price).toFixed(2)}
              </Badge>
            </div>
            <DrawerClose className="rounded-full p-1.5 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </DrawerClose>
          </div>
          <DrawerTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            {course.title}
          </DrawerTitle>
          <DrawerDescription className="mt-1 text-sm">
            {course.description}
          </DrawerDescription>
        </DrawerHeader>

        <Separator />

        <div className="px-4 py-4 sm:px-6">
          {/* Course Action Button */}
          <div className="mb-6">
            {isEnrolled ? (
              // If enrolled, show "Continue Learning" button that triggers onEnroll function
              <Button
                onClick={() => onEnroll(course.id, slug)}
                className="w-full flex items-center justify-center gap-2"
              >
                Continue Learning <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              // If not enrolled, show "See Course" button that navigates to course page
              <Link href={`/courses/${slug}`} passHref>
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => onOpenChange(false)}
                >
                  See Course <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Trainers Section */}
          {course.trainers && course.trainers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                Trainers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {trainer.name
                            ? trainer.name
                                .split(" ")
                                .map((name) => name[0])
                                .join("")
                            : ""}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        {trainer.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getTrainerRole(trainer)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Content Section */}
          {course.parts && course.parts.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                Course Content
              </h3>
              <div className="space-y-3">
                {course.parts.map((part, index) => (
                  <div
                    key={part.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="py-2 px-3 sm:py-3 sm:px-4 bg-gray-50">
                      <h4 className="text-sm sm:text-base font-medium">
                        Part {index + 1}: {part.title}
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {part.lessons &&
                        part.lessons.map((lesson, lessonIndex) => {
                          // Determine if this lesson is accessible
                          const isAccessible = isEnrolled || lesson.is_free_preview;
                          
                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between p-3 sm:p-4 transition-colors ${
                                isAccessible ? "hover:bg-gray-50 cursor-pointer" : "cursor-not-allowed"
                              }`}
                              onClick={() => 
                                lesson.slug && 
                                navigateToLesson(slug, lesson.slug, lesson.is_free_preview)
                              }
                            >
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                                  {lessonIndex + 1}
                                </div>
                                <div>
                                  <p className={`font-medium text-xs sm:text-sm ${
                                    isAccessible ? "text-gray-800" : "text-gray-500"
                                  }`}>
                                    {lesson.title}
                                  </p>
                                  {lesson.duration && (
                                    <p className="text-xs text-gray-500">
                                      Duration: {lesson.duration}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {lesson.is_free_preview ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1.5 text-xs"
                                >
                                  <Play className="w-3 h-3" />
                                  Free Preview
                                </Button>
                              ) : (
                                <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                  {isEnrolled ? (
                                    <Play className="w-3 h-3" />
                                  ) : (
                                    <Lock className="w-3 h-3" />
                                  )}
                                  {isEnrolled ? "Available" : "Locked"}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="px-4 sm:px-6">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CourseDrawer;
