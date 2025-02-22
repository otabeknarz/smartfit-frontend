'use client';

import Navbar from "@/components/navbar";
import Video from "@/components/sections/video";
import CoursesList from "@/components/sections/courses-list";
import { useAuth } from "@/contexts/AuthContext";

export default function Course() {
  const { user } = useAuth();
  console.log("user", user);
  return (
    <>
      <Navbar title="Courses" />
      <Video />
      <CoursesList />
    </>
  );
}

