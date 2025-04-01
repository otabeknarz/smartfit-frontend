"use client";

import Image from "next/image";
import {
  Play,
  MessageCircle,
  Clock,
  Send,
  X,
  Star,
  StarHalf,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { axiosInstance } from "@/lib/apiService";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  is_free_preview: boolean;
  order: number;
}

interface VideoProps {
  lesson: Lesson;
  instructor?: {
    name: string;
    avatar: string;
    initials: string;
    role: string;
  };
  navigation: {
    previous?: {
      title: string;
    };
    next?: {
      title: string;
    };
  };
  onNavigation: (direction: "previous" | "next") => void;
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

const sampleComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "/fitness-1.png",
      initials: "JD",
    },
    text: "This workout was exactly what I needed! The instructions were clear and easy to follow.",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "Alice Smith",
      avatar: "/fitness-1.png",
      initials: "AS",
    },
    text: "Great session! Could you please explain more about the proper breathing technique during the core exercises?",
    timestamp: "5 hours ago",
  },
  // Add more sample comments as needed
];

function CommentItem({ comment }: { comment: Comment }) {
  const { t } = useLanguage();

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
            {comment.user.name === "You" ? t("you") : comment.user.name}
          </p>
          <span className="text-xs text-gray-500">
            {comment.timestamp === "Just now"
              ? t("just_now")
              : comment.timestamp}
          </span>
        </div>
        <p className="text-sm text-gray-600">{comment.text}</p>
      </div>
    </div>
  );
}

function CommentsDrawer({ commentCount }: { commentCount?: number }) {
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [newComment, setNewComment] = useState("");
  const { t } = useLanguage();

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
      timestamp: "Just now",
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          <span>{commentCount}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[96vh] container mx-auto max-w-screen-sm">
        <DrawerHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between px-4">
            <DrawerTitle>
              {t("comments")} {/* ({comments.length}) */}
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex flex-col h-[calc(100vh-10rem)]">
          {/* Comments List */}

          <div className="flex flex-1 items-center justify-center">
            <h1 className="font-semibold text-xl">
              {t("comments_will_be_soon")} ⏳
            </h1>
          </div>

          {/* <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </ScrollArea> */}

          {/* Comment Input */}
          {/* <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("add_a_comment")}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
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
          </div> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RatingStars({
  rating,
  onRate,
}: {
  rating: number;
  onRate?: (rating: number) => void;
}) {
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

function VideoNavigation({
  navigation,
  onNavigation,
}: {
  navigation: VideoProps["navigation"];
  onNavigation: VideoProps["onNavigation"];
}) {
  const { t } = useLanguage();

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
            onClick={() => onNavigation("previous")}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("previous_lesson")}</span>
            <span className="sm:hidden">{t("previous_lesson")}</span>
          </Button>
        )}

        {navigation.next && (
          <Button
            className="flex items-center justify-center gap-2 flex-1"
            onClick={() => onNavigation("next")}
          >
            <span>{t("next_lesson")}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Video({
  lesson,
  navigation,
  instructor,
  onNavigation,
}: VideoProps) {
  const [userRating, setUserRating] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleRate = (rating: number) => {
    setUserRating(rating);
    // Here you would typically send the rating to your backend
    console.log(`Rated ${rating} stars`);
  };

  // Default instructor if none provided
  const displayInstructor = instructor || {
    name: "Sarah Johnson",
    avatar: "/fitness-1.png",
    initials: "SJ",
    role: t("certified_fitness_trainer"),
  };

  const handlePlayVideo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/courses/get-one-time-video-token/${lesson.id}/`
      );

      if (response.data.status === "success" && response.data.data.video_url) {
        // Open in external browser
        if (window.Telegram?.WebApp?.openLink) {
          window.Telegram.WebApp.openLink(response.data.data.video_url);
        } else {
          // Fallback behavior, maybe open in same window
          window.open(response.data.data.video_url, "_blank");
        }
      } else {
        setError(t("video_not_available"));
      }
    } catch (error) {
      console.error("Error fetching video token:", error);
      setError(t("error_loading_video"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-background">
      <div className="container mx-auto max-w-screen-sm p-4">
        {/* Video Player */}
        <div className="relative aspect-video w-full bg-gray-900 rounded-xl overflow-hidden shadow-lg">
          <div className="flex flex-col items-center justify-center h-full">
            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            <Button
              size="lg"
              className="flex items-center gap-2 mb-2"
              onClick={handlePlayVideo}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span>{t("play_video")}</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
            <p className="text-white text-sm opacity-70">
              {t("opens_in_external_browser")}
            </p>
          </div>
        </div>

        {/* Video Info */}
        <div className="py-6 space-y-5">
          {/* Title and Instructor */}
          <div className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-800 leading-snug">
              {lesson.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-white shadow-md">
                  <AvatarImage
                    src={displayInstructor.avatar}
                    alt={displayInstructor.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {displayInstructor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {displayInstructor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {displayInstructor.role}
                  </p>
                </div>
              </div>
              <CommentsDrawer />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {lesson.description || t("default_video_description")}
          </p>

          {/* Rating section - commented out for now */}
          {/* <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-sm font-medium text-gray-800">
                {userRating ? t("your_rating") : t("rate_this_video")}
              </h3>
              <RatingStars
                rating={userRating || 4.7}
                onRate={handleRate}
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-800">
                  {4.7.toFixed(1)}
                </span>
                <span>•</span>
                <span>{128} {t("ratings")}</span>
                {userRating && (
                  <>
                    <span>•</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-auto py-1 px-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setUserRating(undefined)}
                    >
                      {t("clear")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div> */}

          {/* Navigation */}
          <VideoNavigation
            navigation={navigation}
            onNavigation={onNavigation}
          />
        </div>
      </div>
    </section>
  );
}
