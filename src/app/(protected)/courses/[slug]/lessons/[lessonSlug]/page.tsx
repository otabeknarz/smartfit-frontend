"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/apiService";
import Navbar from "@/components/navbar";
import Video from "@/components/sections/video";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Lock,
  Play,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

// Interfaces based on the data structure
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

export default function LessonPage() {
  const { slug, lessonSlug } = useParams<{
    slug: string;
    lessonSlug: string;
  }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentPartTitle, setCurrentPartTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams<{ slug: string; lessonSlug: string }>();
  const { t } = useLanguage();

  // Get previous and next lesson for navigation
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    async function fetchCourseAndLesson() {
      setLoading(true);
      try {
        // First, fetch the course data
        const courseResponse = await axiosInstance.get(
          `/courses/get-course/${params.slug}/`
        );
        const courseData = courseResponse.data;
        setCourse(courseData);

        // Find the current lesson and its part
        let foundLesson: Lesson | null = null;
        let foundPart: Part | null = null;

        // Flatten all lessons with their part information for easy navigation
        const allLessons: { lesson: Lesson; part: Part }[] = [];

        courseData.parts.forEach((part: Part) => {
          part.lessons.forEach((lesson: Lesson) => {
            allLessons.push({ lesson, part });

            if (lesson.slug === params.lessonSlug) {
              foundLesson = lesson;
              foundPart = part;
              setCurrentLesson(lesson);
              setCurrentPartTitle(part.title);
            }
          });
        });

        // Sort all lessons by part order and then by lesson order
        allLessons.sort((a, b) => {
          if (a.part.order !== b.part.order) {
            return a.part.order - b.part.order;
          }
          return a.lesson.order - b.lesson.order;
        });

        // Find previous and next lessons
        const currentIndex = allLessons.findIndex(
          (item) => item.lesson.slug === params.lessonSlug
        );

        if (currentIndex > 0) {
          setPrevLesson(allLessons[currentIndex - 1].lesson);
        }

        if (currentIndex < allLessons.length - 1) {
          setNextLesson(allLessons[currentIndex + 1].lesson);
        }

        // Handle not found lesson
        if (!foundLesson) {
          setError("Lesson not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load course or lesson");
      } finally {
        setLoading(false);
      }
    }

    fetchCourseAndLesson();
  }, [params.slug, params.lessonSlug]);

  // Check if the user can access this lesson
  const canAccessLesson = (lesson?: Lesson) => {
    if (!course || (!lesson && !currentLesson)) return false;
    const targetLesson = lesson || currentLesson;
    return course.is_enrolled || targetLesson!.is_free_preview;
  };

  // Handle navigation between lessons
  const handleNavigation = (direction: "previous" | "next") => {
    const targetLesson = direction === "previous" ? prevLesson : nextLesson;
    if (targetLesson) {
      router.push(`/courses/${params.slug}/lessons/${targetLesson.slug}`);
    }
  };

  // Navigate to a specific lesson
  const navigateToLesson = (lessonSlug: string) => {
    router.push(`/courses/${params.slug}/lessons/${lessonSlug}`);
  };

  if (loading) {
    return (
      <>
        <Navbar title={t("loading")} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("loading_courses")}</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <>
        <Navbar title={t("error")} />
        <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{t("error_loading_lesson")}</CardTitle>
                  <CardDescription>
                    {error || t("lesson_not_found")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/courses/${params.slug}`}>
                    <Button>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t("back_to_course")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Access denied view
  if (!canAccessLesson()) {
    return (
      <>
        <Navbar title={course.title} />
        <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
              <Card className="mb-8">
                <CardHeader>
                  <Badge className="w-fit mb-2">{currentPartTitle}</Badge>
                  <CardTitle>{currentLesson.title}</CardTitle>
                  <CardDescription>
                    {t("premium_lesson_description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {t("content_locked")}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {t("enroll_to_access")}
                      </p>
                      <Link href={`/courses/${params.slug}`}>
                        <Button>
                          {t("enroll_now")} (
                          {new Intl.NumberFormat("uz-UZ").format(
                            parseFloat(course.price)
                          )}{" "}
                          UZS)
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href={`/courses/${params.slug}`}>
                      <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("back_to_course")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Format the trainer data for the Video component
  const instructorData =
    course.trainers.length > 0
      ? {
          name: course.trainers[0].name,
          avatar: "", // You would add avatar URL here if available
          initials: course.trainers[0].name.substring(0, 2),
          role: t("instructor"),
        }
      : undefined;

  // Navigation data
  const navigationData = {
    previous: prevLesson ? { title: prevLesson.title } : undefined,
    next: nextLesson ? { title: nextLesson.title } : undefined,
  };

  // Sort parts by order
  const sortedParts = [...course.parts].sort((a, b) => a.order - b.order);

  // Authenticated and authorized view
  return (
    <>
      <Navbar title={course.title} />
      <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link
                  href={`/courses/${params.slug}`}
                  className="hover:text-blue-600"
                >
                  {course.title}
                </Link>
                <span>/</span>
                <span>{currentPartTitle}</span>
              </div>
            </div>

            <Card className="mb-8 overflow-hidden">
              <Video
                lesson={currentLesson}
                instructor={instructorData}
                navigation={navigationData}
                onNavigation={handleNavigation}
              />
            </Card>

            {/* Course Parts and Lessons List */}
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                  <CardTitle>{t("course_content")}</CardTitle>
                </div>
                <CardDescription>
                  {course.parts.length} {t("parts")} •{" "}
                  {course.parts.reduce(
                    (acc, part) => acc + part.lessons.length,
                    0
                  )}{" "}
                  {t("lessons")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-96">
                  <Accordion
                    type="multiple"
                    defaultValue={[currentPartTitle]}
                    className="w-full"
                  >
                    {sortedParts.map((part) => {
                      // Check if current lesson is in this part
                      const isActivePart = part.lessons.some(
                        (lesson) => lesson.slug === params.lessonSlug
                      );
                      const sortedLessons = [...part.lessons].sort(
                        (a, b) => a.order - b.order
                      );

                      return (
                        <AccordionItem
                          key={part.id}
                          value={part.title}
                          className={
                            isActivePart
                              ? "border-l-2 border-l-blue-500 pl-2"
                              : ""
                          }
                        >
                          <AccordionTrigger className="hover:no-underline hover:bg-gray-50 px-2 rounded-md">
                            <div className="flex items-start text-left">
                              <span className="font-medium">{part.title}</span>
                              <span className="text-xs text-gray-500 ml-2 mt-1">
                                ({sortedLessons.length} {t("lessons")})
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-1 pl-2">
                              {sortedLessons.map((lesson) => {
                                const isCurrentLesson =
                                  lesson.slug === params.lessonSlug;
                                const canAccess = canAccessLesson(lesson);

                                return (
                                  <div
                                    key={lesson.id}
                                    className={`
                                      flex items-center gap-2 py-2 px-2 rounded-md
                                      ${
                                        isCurrentLesson
                                          ? "bg-blue-50 text-blue-700"
                                          : ""
                                      }
                                      ${
                                        canAccess
                                          ? "cursor-pointer hover:bg-gray-50"
                                          : "opacity-70"
                                      }
                                    `}
                                    onClick={() =>
                                      canAccess && navigateToLesson(lesson.slug)
                                    }
                                  >
                                    <div className="flex-shrink-0 w-5">
                                      {isCurrentLesson ? (
                                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                      ) : canAccess ? (
                                        <Play className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <Lock className="h-4 w-4 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-grow">
                                      <div className="text-sm font-medium">
                                        {lesson.title}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{lesson.duration.slice(3)}</span>
                                        {lesson.is_free_preview && (
                                          <Badge
                                            variant="outline"
                                            className="h-5 text-xs"
                                          >
                                            {t("free_preview")}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>

            {currentLesson.description && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{t("lesson_description")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{currentLesson.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-6">
              <Link href={`/courses/${params.slug}`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("back_to_course")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
