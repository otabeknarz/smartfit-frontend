import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";
import {
	Clock,
	Users,
	ChevronRight,
	BookOpen,
	Bookmark,
	Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CourseDrawer from "./course-drawer";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";
import type { Course } from "@/types/course";
import { useLanguage } from "@/contexts/LanguageContext";

interface CourseCardProps {
	title: string;
	description: string;
	image: string;
	duration: string;
	students: number;
	link: string;
}

function CourseCard({
	title,
	description,
	image,
	duration,
	students,
	link,
}: CourseCardProps) {
	const router = useRouter();

	return (
		<div className="group cursor-pointer" onClick={() => router.push(link)}>
			<div className="flex flex-col gap-3 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
				{/* Image Container */}
				<div className="relative aspect-video w-full overflow-hidden rounded-xl">
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
				</div>

				{/* Content */}
				<div className="space-y-3 px-1">
					{/* Title */}
					<h2 className="font-semibold text-gray-800 line-clamp-1">{title}</h2>

					{/* Description */}
					<p className="text-sm text-gray-500 line-clamp-2">{description}</p>

					{/* Meta Info */}
					<div className="flex items-center justify-between pt-2 border-t border-gray-100">
						<div className="flex items-center gap-3 text-sm text-gray-500">
							<div className="flex items-center gap-1">
								<Clock className="w-4 h-4" />
								<span>{duration}</span>
							</div>
							<div className="flex items-center gap-1">
								<Users className="w-4 h-4" />
								<span>{students}</span>
							</div>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
					</div>
				</div>
			</div>
		</div>
	);
}

interface CoursesProps {
	myCourses: Course[];
	allCourses: Course[];
	loading?: boolean;
	error?: string | null;
}

export default function Courses({
	myCourses = [],
	allCourses = [],
	loading = false,
	error = null,
}: CoursesProps) {
	const router = useRouter();
	const { toast } = useToast();
	const { t } = useLanguage();
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [displayCourses, setDisplayCourses] = useState<Course[]>([]);
	const [showingEnrolled, setShowingEnrolled] = useState(true);

	useEffect(() => {
		// Determine which courses to display
		if (myCourses.length > 0) {
			setDisplayCourses(myCourses);
			setShowingEnrolled(true);
		} else {
			// Limit to 10 courses if there are more
			const limitedCourses =
				allCourses.length > 10 ? allCourses.slice(0, 10) : allCourses;
			setDisplayCourses(limitedCourses);
			setShowingEnrolled(false);
		}
	}, [myCourses, allCourses]);

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
		const isAlreadyEnrolled = myCourses.some(
			(course) => course.id === courseId
		);

		if (isAlreadyEnrolled) {
			// Navigate to course learning page
			router.push(`/courses/${slug}`);
		} else {
			// Enroll in the course
			toast({
				title: t("enrollment_successful"),
				description: t("successfully_enrolled"),
			});

			// For demo purposes, add the course to myCourses
			if (selectedCourse) {
				// In a real app, you would call an API here to enroll
				router.push(`/courses/${slug}`);
			}
		}
	};

	const handleViewAllCourses = () => {
		router.push("/courses");
	};

	if (loading) {
		return (
			<section className="bg-gray-50">
				<div className="container mx-auto max-w-screen-sm py-6">
					<div className="flex items-center justify-center min-h-[300px]">
						<div className="flex flex-col items-center gap-4">
							<Loader2 className="h-10 w-10 text-primary animate-spin" />
							<p className="text-gray-500 font-medium">
								{t("loading_courses")}
							</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="bg-gray-50">
				<div className="container mx-auto max-w-screen-sm py-6">
					<div className="flex items-center justify-center min-h-[300px]">
						<div className="text-center">
							<p className="text-red-500 mb-4">{error}</p>
							<Button
								onClick={() => window.location.reload()}
								variant="outline"
							>
								{t("try_again")}
							</Button>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-gray-50">
			<div className="container mx-auto max-w-screen-sm py-6">
				{/* Header */}
				<div className="space-y-2 px-4 mb-6">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold text-gray-800">
							{showingEnrolled ? t("my_courses") : t("available_courses")}
						</h1>
						<button
							className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
							onClick={handleViewAllCourses}
						>
							{t("view_all")}
						</button>
					</div>
					<p className="text-sm text-gray-500">
						{showingEnrolled
							? t("continue_your_learning")
							: t("discover_new_courses")}
					</p>
				</div>

				{displayCourses.length > 0 ? (
					<div className="px-4">
						{showingEnrolled ? (
							// Carousel for enrolled courses
							<div className="space-y-4">
								<Carousel className="w-full">
									<div className="flex items-center justify-end mb-2">
										<div className="flex space-x-2">
											<CarouselPrevious className="static translate-y-0" />
											<CarouselNext className="static translate-y-0" />
										</div>
									</div>
									<CarouselContent className="-ml-4">
										{displayCourses.map((course) => (
											<CarouselItem
												key={course.id}
												className="pl-4 basis-full sm:basis-1/2 md:basis-1/3"
											>
												<div
													className="cursor-pointer group"
													onClick={() => handleCourseSelect(course)}
												>
													<div className="flex flex-col gap-3 bg-white rounded-2xl p-3 border border-primary/30 bg-primary/5 shadow-sm hover:shadow-md transition-all duration-200 h-full">
														{/* Image Container */}
														<div className="relative aspect-video w-full overflow-hidden rounded-xl">
															<Image
																src={course.thumbnail}
																alt={course.title}
																width={500}
																height={500}
																className="object-cover"
															/>
															<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
															<div className="absolute top-2 right-2">
																<Badge
																	variant="secondary"
																	className="bg-green-100 text-green-800 border-green-200"
																>
																	{t("enrolled")}
																</Badge>
															</div>
														</div>

														{/* Content */}
														<div className="space-y-3 px-1 flex-1 flex flex-col">
															{/* Title */}
															<h2 className="font-semibold text-gray-800 line-clamp-1">
																{course.title}
															</h2>

															{/* Description */}
															<p className="text-sm text-gray-500 line-clamp-2 flex-1">
																{course.description}
															</p>

															{/* Meta Info */}
															<div className="flex items-center justify-between pt-2 border-t border-gray-100">
																<div className="flex items-center gap-3 text-sm text-gray-500">
																	<div className="flex items-center gap-1">
																		<Users className="w-4 h-4" />
																		<span>{course.trainers?.length || 0}</span>
																	</div>
																</div>
																<Button
																	variant="ghost"
																	size="sm"
																	className="text-xs h-7 px-2"
																>
																	{t("continue_learning")}
																</Button>
															</div>
														</div>
													</div>
												</div>
											</CarouselItem>
										))}
									</CarouselContent>
								</Carousel>
							</div>
						) : (
							// Carousel for available courses
							<div className="space-y-4">
								<Carousel className="w-full">
									<div className="flex items-center justify-end mb-2">
										<div className="flex space-x-2">
											<CarouselPrevious className="static translate-y-0" />
											<CarouselNext className="static translate-y-0" />
										</div>
									</div>
									<CarouselContent className="-ml-4">
										{displayCourses.map((course) => (
											<CarouselItem
												key={course.id}
												className="pl-4 basis-full sm:basis-1/2 md:basis-1/3"
											>
												<div
													className="cursor-pointer group"
													onClick={() => handleCourseSelect(course)}
												>
													<div className="flex flex-col gap-3 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 h-full">
														{/* Image Container */}
														<div className="relative aspect-video w-full overflow-hidden rounded-xl">
															<Image
																src={course.thumbnail}
																alt={course.title}
																width={500}
																height={500}
																className="object-cover"
															/>
															<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
														</div>

														{/* Content */}
														<div className="space-y-3 px-1 flex-1 flex flex-col">
															{/* Title */}
															<h2 className="font-semibold text-gray-800 line-clamp-1">
																{course.title}
															</h2>

															{/* Description */}
															<p className="text-sm text-gray-500 line-clamp-2 flex-1">
																{course.description}
															</p>

															{/* Meta Info */}
															<div className="flex items-center justify-between pt-2 border-t border-gray-100">
																<div className="flex items-center gap-3 text-sm text-gray-500">
																	<div className="flex items-center gap-1">
																		<Users className="w-4 h-4" />
																		<span>{course.trainers?.length || 0}</span>
																	</div>
																</div>
																<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
															</div>
														</div>
													</div>
												</div>
											</CarouselItem>
										))}
									</CarouselContent>
								</Carousel>
								{allCourses.length > 10 && (
									<div className="flex justify-center mt-4">
										<Button
											variant="outline"
											size="sm"
											onClick={handleViewAllCourses}
											className="text-xs sm:text-sm"
										>
											{t("view_all_courses").replace(
												"{count}",
												allCourses.length.toString()
											)}
										</Button>
									</div>
								)}
							</div>
						)}
					</div>
				) : (
					<div className="px-4 text-center py-8">
						<div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
							<Bookmark className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
						</div>
						<h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
							{t("no_courses_found")}
						</h3>
						<p className="text-gray-500 text-center text-sm sm:text-base max-w-md mb-6 mx-auto">
							{showingEnrolled
								? t("no_enrolled_courses")
								: t("no_available_courses")}
						</p>
						{showingEnrolled && (
							<Button
								onClick={handleViewAllCourses}
								variant="default"
								size="sm"
								className="text-xs sm:text-sm"
							>
								{t("browse_courses")}
							</Button>
						)}
					</div>
				)}

				{/* Course Drawer */}
				{selectedCourse && (
					<CourseDrawer
						course={selectedCourse}
						slug={selectedCourse.slug}
						isOpen={isDrawerOpen}
						onOpenChange={setIsDrawerOpen}
						isEnrolled={myCourses.some((c) => c.id === selectedCourse.id)}
						onEnroll={handleEnrollCourse}
					/>
				)}
			</div>
		</section>
	);
}
