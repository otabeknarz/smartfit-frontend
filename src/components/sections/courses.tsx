import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Clock, Users, ChevronRight } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  duration: string;
  students: number;
}

function CourseCard({ title, description, image, duration, students }: CourseCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="flex flex-col gap-3 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="space-y-3 px-1">
          {/* Title */}
          <h2 className="font-semibold text-gray-800 line-clamp-1">{title}</h2>
          
          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {description}
          </p>

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

export default function Courses() {
  const courses = [
    {
      title: "Fitness Fundamentals",
      description: "Master the basics of fitness and build a strong foundation for your workout journey",
      image: "/fitness-1.png",
      duration: "4 weeks",
      students: 234,
    },
    {
      title: "Advanced Training",
      description: "Take your fitness to the next level with advanced techniques and routines",
      image: "/fitness-1.png",
      duration: "6 weeks",
      students: 156,
    },
    {
      title: "Nutrition Essentials",
      description: "Learn the fundamentals of nutrition and healthy eating habits",
      image: "/fitness-1.png",
      duration: "3 weeks",
      students: 189,
    },
    {
      title: "Mindful Movement",
      description: "Combine physical exercise with mental wellness for complete health",
      image: "/fitness-1.png",
      duration: "5 weeks",
      students: 142,
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto max-w-screen-sm py-6">
        {/* Header */}
        <div className="space-y-2 px-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">My Courses</h1>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
              View All
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Continue your learning journey
          </p>
        </div>

        {/* Carousel */}
        <Carousel>
          <CarouselContent className="-ml-4 px-4">
            {courses.map((course, index) => (
              <CarouselItem key={index} className="pl-4 basis-[85%] sm:basis-[70%]">
                <CourseCard {...course} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
