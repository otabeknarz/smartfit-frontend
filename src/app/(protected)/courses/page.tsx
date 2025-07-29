"use client";

import Navbar from "@/components/navbar";
import CoursesList from "@/components/sections/courses-list";
import CourseDrawer from "@/components/sections/course-drawer";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/apiService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BookOpen, Bookmark, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Course } from "@/types/course";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Course() {
	const { user } = useAuth();
	const { toast } = useToast();
	const [myCourses, setMyCourses] = useState<Course[]>([]);
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<string>("all");
	const router = useRouter();
	const { t } = useLanguage();

	useEffect(() => {
		const fetchMyCourses = async () => {
			try {
				const response = await axiosInstance.get("/courses/get-my-courses/");
				const data = await response.data;
				setMyCourses(data);
			} catch (err) {
				console.error("Error fetching courses:", err);
				setError(t("failed_to_load_courses"));
			} finally {
				setLoading(false);
			}
		};

		const fetchCourses = async () => {
			try {
				const response = await axiosInstance.get("/courses/get-courses/");
				const data = await response.data;
				setCourses(data);
			} catch (err) {
				console.error("Error fetching courses:", err);
				setError(t("failed_to_load_courses"));
			} finally {
				setLoading(false);
			}
		};

		fetchMyCourses();
		fetchCourses();
	}, [t]);

	const handleCourseSelect = (course: Course) => {
		// Check if the course is enrolled
		const isEnrolled = myCourses.some((c) => c.id === course.id);

		if (isEnrolled) {
			// If enrolled, redirect directly to the course page
			router.push(`/courses/${course.slug}`);
		} else {
			// If not enrolled, show the drawer
			setSelectedCourse(course);
			setIsDrawerOpen(true);
		}
	};

	const handleEnrollCourse = (courseId: string, slug: string) => {
		// Here you would implement the actual enrollment logic
		// For now, we'll just show a toast notification
		const isAlreadyEnrolled = myCourses.some(
			(course) => course.id === courseId
		);

		if (isAlreadyEnrolled) {
			// Navigate to course learning page
			console.log("Navigate to course learning page:", courseId);
			router.push(`/courses/${slug}`);
		} else {
			// Enroll in the course
			console.log("Enroll in course:", courseId);
			toast({
				title: t("enrollment_successful"),
				description: t("successfully_enrolled"),
			});

			// For demo purposes, add the course to myCourses
			if (selectedCourse) {
				setMyCourses((prev) => [...prev, selectedCourse]);
			}
		}
	};

	if (loading) {
		return (
			<>
				<Navbar title={t("courses")} />
				<div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
					<div className="flex flex-col items-center gap-4">
						<Loader2 className="h-10 w-10 text-primary animate-spin" />
						<p className="text-gray-500 font-medium">{t("loading_courses")}</p>
					</div>
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<Navbar title={t("courses")} />
				<div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
					<Card className="max-w-md w-full">
						<CardHeader className="flex flex-col items-center space-y-2">
							<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
								<span className="text-red-500 text-xl">!</span>
							</div>
							<CardTitle className="text-red-500">{t("error")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-center text-gray-500">{error}</p>
						</CardContent>
						<CardFooter className="flex justify-center">
							<Button
								onClick={() => window.location.reload()}
								variant="default"
							>
								{t("try_again")}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</>
		);
	}

	return (
		<>
			<Navbar title={t("courses")} />
			<main className="bg-gray-50 min-h-[calc(100vh-80px)]">
				<div className="px-4 py-6 sm:py-8 max-w-screen-sm mx-auto">
					<div className="mb-6 sm:mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
							{t("courses")}
						</h1>
						<p className="text-gray-500 text-sm sm:text-base">
							{t("discover_new_courses")}
						</p>
					</div>

					<Tabs
						defaultValue="all"
						className="w-full"
						onValueChange={setActiveTab}
					>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
							<TabsList className="bg-white border border-gray-100 shadow-sm self-start">
								<TabsTrigger
									value="all"
									className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm"
								>
									<BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
									{t("all_courses")}
								</TabsTrigger>
								<TabsTrigger
									value="my"
									className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm"
								>
									<Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
									{t("my_courses")}
								</TabsTrigger>
							</TabsList>

							<div className="text-xs sm:text-sm text-gray-500">
								{activeTab === "all"
									? `${courses.length} ${t("available_courses")}`
									: `${myCourses.length} ${t("enrolled_courses")}`}
							</div>
						</div>

						<TabsContent value="all" className="mt-0">
							<Card>
								<CardContent className="p-3 sm:p-6">
									<CoursesList
										courses={courses}
										loading={loading}
										error={error}
										onCourseSelect={handleCourseSelect}
										enrolledCourseIds={myCourses.map((course) => course.id)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="my" className="mt-0">
							<Card>
								<CardContent className="p-3 sm:p-6">
									{myCourses.length > 0 ? (
										<CoursesList
											courses={myCourses}
											loading={loading}
											error={error}
											onCourseSelect={handleCourseSelect}
											enrolledCourseIds={myCourses.map((course) => course.id)}
										/>
									) : (
										<div className="py-8 sm:py-12 flex flex-col items-center justify-center">
											<div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
												<Bookmark className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
											</div>
											<h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
												{t("no_enrolled_courses").split(".")[0]}
											</h3>
											<p className="text-gray-500 text-center text-sm sm:text-base max-w-md mb-6">
												{t("no_enrolled_courses")}
											</p>
											<Button
												onClick={() => setActiveTab("all")}
												variant="default"
												size="sm"
												className="text-xs sm:text-sm"
											>
												{t("browse_courses")}
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>

					{/* Course Drawer */}
					<CourseDrawer
						course={selectedCourse}
						slug={selectedCourse?.slug}
						isOpen={isDrawerOpen}
						onOpenChange={setIsDrawerOpen}
						isEnrolled={myCourses.some((c) => c.id === selectedCourse?.id)}
						onEnroll={(courseId, slug) => handleEnrollCourse(courseId, slug)}
					/>
				</div>
			</main>
		</>
	);
}
