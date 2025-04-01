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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import { useLanguage } from "@/contexts/LanguageContext";

import { Tag, ArrowRight, X, Play, Lock, Coins } from "lucide-react";

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
  picture?: string;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
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

interface CourseDrawerProps {
  course: Course | null;
  slug?: string;
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
  const { t } = useLanguage();

  // Function to get trainer profile image URL or a default placeholder
  const getTrainerAvatarUrl = (trainer: Trainer) => {
    if (trainer.picture) {
      return `https://api.smart-fit.uz${trainer.picture}`;
    } else if (trainer.gender === "FEMALE") {
      return "/female-trainer.png";
    } else if (trainer.gender === "MALE") {
      return "/male-trainer.png";
    }
    // Default fallback
    return "/fitness-1.png";
  };

  // Function to get trainer role based on their information
  const getTrainerRole = (trainer: Trainer) => {
    if (!trainer) return t("fitness_trainer");

    let role = t("fitness_trainer");

    // You can customize this based on your backend data
    if (trainer.gender === "FEMALE") {
      role = t("womens_fitness_specialist");
    } else if (trainer.gender === "MALE") {
      role = t("personal_trainer");
    }

    // You could add experience level based on age or other factors
    if (trainer.age && trainer.age > 35) {
      role = t("senior") + " " + role;
    }

    return role;
  };

  // Function to navigate to lesson
  const navigateToLesson = (
    courseSlug: string,
    lessonSlug: string,
    isFreePreview: boolean
  ) => {
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
        <DrawerHeader className="relative px-4 py-3 sm:px-6 container max-w-screen-sm mx-auto">
          {/* Course Thumbnail */}
          {course.thumbnail && (
            <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
              <img
                src={`https://api.smart-fit.uz${course.thumbnail}`}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
                <Coins className="w-3 h-3 mr-1" />
                {new Intl.NumberFormat("uz-UZ").format(
                  parseFloat(course.price)
                )}{" "}
                UZS
              </Badge>
            </div>
            <DrawerClose className="rounded-full p-1.5 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </DrawerClose>
          </div>
          <DrawerTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            {course.title}
          </DrawerTitle>
        </DrawerHeader>

        <Separator />

        <div className="px-4 py-4 sm:px-6 container max-w-screen-sm mx-auto">
          {/* Trainers Section */}
          {course.trainers && course.trainers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                {t("trainers")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {trainer.picture ? (
                        <img
                          src={`https://api.smart-fit.uz${trainer.picture}`}
                          alt={trainer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Avatar>
                          <AvatarFallback>
                            {trainer.name
                              ? trainer.name.substring(0, 2).toUpperCase()
                              : "TR"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {trainer.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {getTrainerRole(trainer)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Preview Section */}
          {course.parts && course.parts.length > 0 && (
            <div className="container max-w-screen-sm mx-auto">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                {t("lessons_preview")}
              </h3>
              <div className="space-y-4">
                {course.parts.slice(0, 2).map((part) => (
                  <div key={part.id} className="space-y-2">
                    <h4 className="font-medium text-gray-700 text-sm">
                      {part.title}
                    </h4>
                    <div className="space-y-2">
                      {part.lessons.slice(0, 3).map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-2 rounded-lg border ${
                            isEnrolled || lesson.is_free_preview
                              ? "cursor-pointer hover:bg-gray-50 border-gray-200"
                              : "border-gray-100 bg-gray-50 opacity-75"
                          }`}
                          onClick={() =>
                            navigateToLesson(
                              slug!,
                              lesson.slug,
                              lesson.is_free_preview
                            )
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isEnrolled || lesson.is_free_preview
                                  ? "bg-primary/10 text-primary"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {isEnrolled || lesson.is_free_preview ? (
                                <Play className="w-4 h-4" />
                              ) : (
                                <Lock className="w-3 h-3" />
                              )}
                            </div>
                            <div>
                              <h5
                                className={`text-sm ${
                                  isEnrolled || lesson.is_free_preview
                                    ? "text-gray-800"
                                    : "text-gray-500"
                                }`}
                              >
                                {lesson.title}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {lesson.duration}
                              </p>
                            </div>
                          </div>
                          {lesson.is_free_preview && !isEnrolled && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-100"
                            >
                              {t("free_preview")}
                            </Badge>
                          )}
                        </div>
                      ))}
                      {part.lessons.length > 3 && (
                        <p className="text-xs text-center text-gray-500 mt-2">
                          {t("and_more_lessons", {
                            count: part.lessons.length - 3,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {course.parts.length > 2 && (
                  <p className="text-xs text-center text-gray-500">
                    {t("and_more_parts", {
                      count: course.parts.length - 2,
                    })}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="px-4 py-3 sm:px-6 container max-w-screen-sm mx-auto">
          {isEnrolled ? (
            // If enrolled, show "Continue Learning" button that triggers onEnroll function
            <Button
              onClick={() => onEnroll(course.id, slug!)}
              className="w-full flex items-center justify-center gap-2"
            >
              {t("continue_learning")} <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            // If not enrolled, show "See Course" button that navigates to course page
            <Link href={`/courses/${slug}`} passHref>
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={() => onOpenChange(false)}
              >
                {t("see_course")} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              {t("close")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CourseDrawer;
