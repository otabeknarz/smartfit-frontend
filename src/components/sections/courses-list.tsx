"use client";

import { Play, Lock, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

interface Course {
  title: string;
  duration: number;
  progress: number;
  isLocked?: boolean;
  isCompleted?: boolean;
}

const courses: Course[] = [
  { title: "Introduction to Weight Loss", duration: 1200, progress: 100, isCompleted: true },
  { title: "Understanding Nutrition Basics", duration: 1870, progress: 75 },
  { title: "Cardio Fundamentals", duration: 2432, progress: 45 },
  { title: "Strength Training Basics", duration: 3000, progress: 30 },
  { title: "Meal Planning Essentials", duration: 1500, progress: 0, isLocked: true },
  { title: "HIIT Workouts", duration: 3600, progress: 0, isLocked: true },
  { title: "Recovery and Rest", duration: 2700, progress: 0, isLocked: true },
  { title: "Mind and Body Connection", duration: 2100, progress: 0, isLocked: true },
  // ... rest of your courses with added progress and lock status
];

function CourseItem({ course }: { course: Course }) {
  return (
    <div 
      className={cn(
        "group flex flex-col gap-3 p-4 rounded-xl transition-all",
        "hover:bg-gray-50",
        course.isLocked && "opacity-75"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            course.isCompleted ? "bg-green-100 text-green-600" :
            course.isLocked ? "bg-gray-100 text-gray-400" :
            "bg-primary/10 text-primary"
          )}>
            {course.isCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : course.isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </div>
          <div>
            <h3 className={cn(
              "font-medium text-sm",
              course.isLocked ? "text-gray-400" : "text-gray-800"
            )}>
              {course.title}
            </h3>
            <p className="text-xs text-gray-500">
              {formatTime(course.duration)}
            </p>
          </div>
        </div>
        {!course.isLocked && (
          <span className={cn(
            "text-xs font-medium",
            course.isCompleted ? "text-green-600" : "text-primary"
          )}>
            {course.progress}%
          </span>
        )}
      </div>

      {!course.isLocked && (
        <Progress 
          value={course.progress} 
          className={cn(
            "h-1.5",
            course.isCompleted ? "bg-green-100 [&>div]:bg-green-600" : "bg-primary/10 [&>div]:bg-primary"
          )}
        />
      )}
    </div>
  );
}

export default function CoursesList() {
  const completedCount = courses.filter(c => c.isCompleted).length;
  const totalCount = courses.length;
  const overallProgress = Math.round((completedCount / totalCount) * 100);

  return (
    <section className="bg-background">
      <div className="container mx-auto max-w-screen-sm p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    Weight Loss Program
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete all lessons to achieve your goals
                  </p>
                </div>
                <span className="text-lg font-semibold text-primary">
                  {overallProgress}%
                </span>
              </div>
              
              <Progress 
                value={overallProgress} 
                className="h-2 bg-primary/10 [&>div]:bg-primary"
              />
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{completedCount} of {totalCount} completed</span>
                <span>•</span>
                <span>{formatTime(courses.reduce((acc, course) => acc + course.duration, 0))} total</span>
              </div>
            </div>
          </div>

          {/* Course List */}
          <div className="divide-y divide-gray-100">
            {courses.map((course, index) => (
              <CourseItem key={index} course={course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

