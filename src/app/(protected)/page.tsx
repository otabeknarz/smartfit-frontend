import Navbar from "@/components/navbar";
import Courses from "@/components/sections/courses";
import Meal from "@/components/sections/meal";
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <>
        <Navbar title="SmartFit" />
        <Courses />
        <Meal />
      </>
    </ProtectedRoute>
  );
}
