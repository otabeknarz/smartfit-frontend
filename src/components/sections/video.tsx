"use client";

import Image from "next/image";
import { Play, MessageCircle, Clock, Send, X, Star, StarHalf, ArrowLeft, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VideoDetails {
  title: string;
  thumbnail: string;
  duration: string;
  instructor: {
    name: string;
    avatar: string;
    initials: string;
    role: string;
  };
  description: string;
  commentCount: number;
  nextVideo: {
    title: string;
    duration: string;
    thumbnail: string;
  };
  rating: {
    average: number;
    count: number;
    userRating?: number;
  };
  navigation: {
    next?: {
      title: string;
    };
    previous?: {
      title: string;
    };
  };
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  text: string;
  timestamp: string;
}

const sampleVideo: VideoDetails = {
  title: "Full Body Workout for Weight Loss",
  thumbnail: "/fitness-1.png",
  duration: "32:15",
  instructor: {
    name: "Sarah Johnson",
    avatar: "/fitness-1.png", // You can change this to actual instructor avatar
    initials: "SJ",
    role: "Certified Fitness Trainer"
  },
  description: "Start your weight loss journey with this comprehensive full-body workout. Perfect for beginners, focusing on proper form and sustainable progress.",
  commentCount: 89,
  nextVideo: {
    title: "Proper Form and Technique",
    duration: "15:30",
    thumbnail: "/fitness-1.png",
  },
  rating: {
    average: 4.7,
    count: 128,
    userRating: undefined
  },
  navigation: {
    next: {
      title: "Proper Form and Technique",
    },
    previous: {
      title: "Introduction to Fitness",
    }
  },
};

const sampleComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "/fitness-1.png",
      initials: "JD",
    },
    text: "This workout was exactly what I needed! The instructions were clear and easy to follow.",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    user: {
      name: "Alice Smith",
      avatar: "/fitness-1.png",
      initials: "AS",
    },
    text: "Great session! Could you please explain more about the proper breathing technique during the core exercises?",
    timestamp: "5 hours ago"
  },
  // Add more sample comments as needed
];

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3 p-4 hover:bg-gray-50 transition-colors">
      <Avatar className="h-9 w-9">
        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {comment.user.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-800">
            {comment.user.name}
          </p>
          <span className="text-xs text-gray-500">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-gray-600">{comment.text}</p>
      </div>
    </div>
  );
}

function CommentsDrawer({ commentCount }: { commentCount: number }) {
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "/fitness-1.png",
        initials: "YO",
      },
      text: newComment,
      timestamp: "Just now"
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{commentCount}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[96vh] container mx-auto max-w-screen-sm">
        <DrawerHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between px-4">
            <DrawerTitle>Comments ({comments.length})</DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="flex flex-col h-[calc(100vh-10rem)]">
          {/* Comments List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </ScrollArea>

          {/* Comment Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RatingStars({ rating, onRate }: { rating: number; onRate?: (rating: number) => void }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <button
          key={i}
          onClick={() => onRate?.(i)}
          className="text-yellow-400 hover:scale-110 transition-transform"
        >
          <Star className="w-5 h-5 fill-current" />
        </button>
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <button
          key={i}
          onClick={() => onRate?.(i)}
          className="text-yellow-400 hover:scale-110 transition-transform"
        >
          <StarHalf className="w-5 h-5 fill-current" />
        </button>
      );
    } else {
      stars.push(
        <button
          key={i}
          onClick={() => onRate?.(i)}
          className="text-gray-300 hover:text-yellow-400 hover:scale-110 transition-all"
        >
          <Star className="w-5 h-5" />
        </button>
      );
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
}

function VideoNavigation({ navigation }: { navigation: VideoDetails['navigation'] }) {
  return (
    <div>
      {/* Navigation Labels */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex-1 min-w-0">
          {navigation.previous && (
            <p className="text-sm text-gray-500 truncate">
              {navigation.previous.title}
            </p>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {navigation.next && (
            <p className="text-sm text-gray-500 truncate text-right">
              {navigation.next.title}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">
        {navigation.previous && (
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2 flex-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>
        )}
        
        {navigation.next && (
          <Button
            className="flex items-center justify-center gap-2 flex-1"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Video() {
  const [userRating, setUserRating] = useState<number | undefined>(
    sampleVideo.rating.userRating
  );

  const handleRate = (rating: number) => {
    setUserRating(rating);
    // Here you would typically send the rating to your backend
    console.log(`Rated ${rating} stars`);
  };

  return (
    <section className="bg-background">
      <div className="container mx-auto max-w-screen-sm p-4">
        {/* Video Player */}
        <div className="relative aspect-video w-full bg-gray-900 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={sampleVideo.thumbnail}
            alt={sampleVideo.title}
            fill
            className="object-cover"
            priority
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] group hover:bg-black/50 transition-all cursor-pointer">
            <div className="p-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-all duration-300">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {sampleVideo.duration}
          </div>
        </div>

        {/* Video Info */}
        <div className="py-6 space-y-5">
          {/* Title and Instructor */}
          <div className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-800 leading-snug">
              {sampleVideo.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-white shadow-md">
                  <AvatarImage 
                    src={sampleVideo.instructor.avatar}
                    alt={sampleVideo.instructor.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {sampleVideo.instructor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {sampleVideo.instructor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sampleVideo.instructor.role}
                  </p>
                </div>
              </div>
              <CommentsDrawer commentCount={sampleVideo.commentCount} />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {sampleVideo.description}
          </p>

          {/* After the description and before Next Up section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-sm font-medium text-gray-800">
                {userRating ? 'Your Rating' : 'Rate this video'}
              </h3>
              <RatingStars 
                rating={userRating || sampleVideo.rating.average} 
                onRate={handleRate}
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-800">
                  {sampleVideo.rating.average.toFixed(1)}
                </span>
                <span>•</span>
                <span>{sampleVideo.rating.count} ratings</span>
                {userRating && (
                  <>
                    <span>•</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setUserRating(undefined)}
                      className="text-primary hover:text-primary/90 px-2 h-auto"
                    >
                      Remove rating
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <VideoNavigation navigation={sampleVideo.navigation} />
        </div>
      </div>
    </section>
  );
}
