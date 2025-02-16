import Image from "next/image";
import { Star, Clock, ChefHat } from "lucide-react";

export default function Meal() {
  return (
    <section className="bg-background min-h-screen">
      <div className="container mx-auto max-w-screen-sm p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Today's Meal</h1>
            <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              2/15/2025
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            Your personalized meal plan for a healthy lifestyle
          </p>
        </div>

        {/* Meal Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Meal Title and Meta */}
          <div className="space-y-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Osh</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>25 min prep time</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span>Traditional</span>
              </div>
            </div>
          </div>
          
          {/* Image and Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image 
                src="/meal.png" 
                alt="Osh - Traditional Central Asian Rice Pilaf" 
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Nutritional Info */}
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Nutritional Value</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Calories", value: "500 kcal", desc: "Daily value: 25%" },
                  { label: "Weight", value: "300g", desc: "Per serving" },
                  { label: "Protein", value: "30g", desc: "Essential for muscles" },
                  { label: "Fat", value: "20g", desc: "Healthy fats included" },
                ].map((item) => (
                  <div 
                    key={item.label}
                    className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <p className="text-sm font-medium text-gray-500">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium text-gray-800">Meal Rating</h3>
              <div className="flex items-center justify-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index}
                    className="w-6 h-6 text-yellow-400 fill-yellow-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">Based on 128 reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
