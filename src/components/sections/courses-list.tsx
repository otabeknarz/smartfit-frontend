import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Clock, DollarSign, Tag } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Types based on the backend API response
interface Trainer {
  id: string;
  name: string;
  username: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  is_published: boolean;
  category: Category;
  trainers: Trainer[];
  created_at: string;
}

interface CoursesListProps {
  courses: any[];
  loading?: boolean;
  error?: string | null;
  onCourseSelect?: (course: any) => void;
  enrolledCourseIds?: string[];
}

const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  loading = false,
  error = null,
  onCourseSelect,
  enrolledCourseIds = [],
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative">
              <Skeleton className="w-full h-32 rounded-t-lg" />
            </div>
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Error: {error}</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">No courses found</p>
      </div>
    );
  }

  // Function to get a placeholder image for courses
  const getCoursePlaceholderImage = (course: any) => {
    // You can implement logic to select different images based on course categories
    if (course.category && course.category.name) {
      const categoryName = course.category.name.toLowerCase();
      if (categoryName.includes("yoga")) return "/yoga-1.jpg";
      if (categoryName.includes("cardio")) return "/cardio-1.jpg";
      if (categoryName.includes("strength")) return "/strength-1.jpg";
      if (categoryName.includes("nutrition")) return "/nutrition-1.jpg";
    }

    // Default fallback
    return "/fitness-1.png";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {courses.map((course) => {
        const isEnrolled = enrolledCourseIds.includes(course.id);

        return (
          <Card
            key={course.id}
            className={`overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group ${
              isEnrolled ? "border-primary/30 bg-primary/5" : ""
            }`}
            onClick={() => onCourseSelect?.(course)}
          >
            <div className="relative">
              <div className="w-full h-32 sm:h-40 bg-gray-200 overflow-hidden">
                <img
                  src={getCoursePlaceholderImage(course)}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {course.is_published === false && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                  >
                    Draft
                  </Badge>
                </div>
              )}
              {isEnrolled && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Enrolled
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg font-bold line-clamp-1">
                {course.title}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm line-clamp-2 mt-1">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-1">
              <div className="flex flex-wrap gap-2 mb-3">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="w-3 h-3 mr-1" />
                  {course.trainers?.length || 0} trainer
                  {course.trainers?.length !== 1 ? "s" : ""}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 sm:h-8 sm:px-3"
                >
                  {isEnrolled ? "Continue Learning" : "View Details"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CoursesList;
