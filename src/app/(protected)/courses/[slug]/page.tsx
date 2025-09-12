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
import { Calendar, Clock, Coins, Lock, Play, Unlock, User } from "lucide-react";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

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
	const { t } = useLanguage();

	return (
		<>
			<Navbar title={t("no_title")} />
			<main className="bg-gray-50 min-h-[calc(100vh-80px)]">
				<div className="px-4 py-6 sm:py-8 max-w-screen-sm mx-auto">
					<div className="mb-6 sm:mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
							{t("no_title")}
						</h1>
						<p className="text-gray-500 text-sm sm:text-base">
							{t("course_not_found")}
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
	const { t } = useLanguage();

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

	// TODO: have to make payments here
	const handleEnrollment = async () => {
		await router.push("https://t.me/gureevaolesya");
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
			<Navbar title={course?.title || t("no_title")} />
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
											<Coins size={16} />
											<span>
												{new Intl.NumberFormat("uz-UZ").format(
													parseFloat(course.price)
												)}{" "}
												UZS
											</span>
										</div>
										{course.is_enrolled && (
											<Badge
												variant="outline"
												className="bg-green-50 text-green-700 border-green-200"
											>
												<Unlock size={14} className="mr-1" /> {t("enrolled")}
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
							<Tabs defaultValue="curriculum" className="w-full">
								<TabsList className="mb-6 w-full justify-start">
									<TabsTrigger value="curriculum">
										{t("curriculum")}
									</TabsTrigger>
									<TabsTrigger value="overview">{t("overview")}</TabsTrigger>
									<TabsTrigger value="trainers">{t("trainers")}</TabsTrigger>
								</TabsList>

								<TabsContent value="curriculum" className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>{t("course_curriculum")}</CardTitle>
											<CardDescription>
												{course.parts?.length} {t("parts")} •{" "}
												{course.parts?.reduce(
													(acc, part) => acc + part.lessons.length,
													0
												)}{" "}
												{t("lessons")}
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
																							{t("free_preview")}
																						</Badge>
																					)}
																				</div>
																			</div>
																			<div className="flex items-center gap-2 text-sm text-gray-500">
																				<Clock size={14} />
																				<span>{lesson.duration.slice(3)}</span>
																			</div>
																		</div>
																	))}
															</div>
														</div>
													))}
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="overview" className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>{t("about_this_course")}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-gray-700 leading-relaxed">
												{course.description}
											</p>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="trainers" className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>{t("course_trainers")}</CardTitle>
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
															{t("fitness_trainer")}
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
											? t("youre_enrolled")
											: t("enroll_in_this_course")}
									</CardTitle>
									<CardDescription>
										{course.is_enrolled
											? t("full_access_to_lessons")
											: t("get_access_to_lessons")}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{!course.is_enrolled && (
										<div className="text-3xl font-bold flex items-center gap-2">
											<Coins />
											<span>
												{new Intl.NumberFormat("uz-UZ").format(
													parseFloat(course.price)
												)}{" "}
												UZS
											</span>
										</div>
									)}

									{course.is_enrolled ? (
										<Button className="w-full" variant="outline">
											{t("continue_learning")}
										</Button>
									) : (
										<Button
											className="w-full"
											onClick={handleEnrollment}
											disabled={isEnrolling}
										>
											{isEnrolling ? t("processing") : t("enroll_now")}
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
												{t("lessons")}
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
