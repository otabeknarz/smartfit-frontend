import Navbar from "@/components/navbar";
import Video from "@/components/sections/video";
import CoursesList from "@/components/sections/courses-list";
import { ProtectedRoute } from "@/components/ProtectedRoute";
export default function Course() {
  return (
    <ProtectedRoute>
      <Navbar title="Courses" />
      <Video />
      <CoursesList />
    </ProtectedRoute>
  );
}

