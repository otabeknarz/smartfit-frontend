"use client";

import Navbar from "@/components/navbar";
import Courses from "@/components/sections/courses";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/apiService";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Course } from "@/types/course";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch enrolled courses
        const myCoursesResponse = await axiosInstance.get("/courses/get-my-courses/");
        setMyCourses(myCoursesResponse.data);
        
        // Fetch all available courses
        const allCoursesResponse = await axiosInstance.get("/courses/get-courses/");
        setAllCourses(allCoursesResponse.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(t("failed_to_load_courses"));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [t]);

  if (loading) return <LoadingScreen />;

  return (
    <ProtectedRoute>
      <Navbar title="SmartFit" isLogo={true} />
      <Courses 
        myCourses={myCourses} 
        allCourses={allCourses} 
        loading={loading} 
        error={error}
      />
    </ProtectedRoute>
  );
}
