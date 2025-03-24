"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/navbar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Hash,
  AtSign,
  Phone,
  User2,
  Ruler,
  Calendar,
  UserCircle2,
  Monitor,
  Globe,
  Clock,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/apiService";
import { API_URLS } from "@/constants/api";

interface Session {
  ip_address: string;
  device_info: string;
  last_online: string;
  created_at: string;
}

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: string;
  created_at: string;
}

function formatDeviceInfo(deviceInfo: string): {
  device: string;
  browser: string;
} {
  // Check if it's a mobile device
  const isMobile =
    deviceInfo.toLowerCase().includes("mobile") ||
    deviceInfo.includes("iPhone") ||
    deviceInfo.includes("Android");

  // Extract browser info
  let browser = "Unknown Browser";
  if (deviceInfo.includes("Safari")) browser = "Safari";
  if (deviceInfo.includes("Chrome")) browser = "Chrome";
  if (deviceInfo.includes("Firefox")) browser = "Firefox";
  if (deviceInfo.includes("Edge")) browser = "Edge";

  // Extract device info
  let device = "Desktop";
  if (deviceInfo.includes("iPhone")) device = "iPhone";
  if (deviceInfo.includes("iPad")) device = "iPad";
  if (deviceInfo.includes("Android")) device = "Android Device";
  if (deviceInfo.includes("Mac OS")) device = "Mac";
  if (deviceInfo.includes("Windows")) device = "Windows";

  return { device, browser };
}

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get(API_URLS.GET_MY_SESSIONS);
        setSessions(response.data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (!user) return null;

  const formattedDate = format(new Date(user.date_joined), "MMMM d, yyyy");

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Navbar title="Profile" />
      <div className="container mx-auto max-w-screen-sm px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b">
            <Avatar className="h-24 w-24 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {user.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h1>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Basic Information
            </h2>
            <div className="grid gap-4">
              <InfoRow
                icon={<Hash className="w-4 h-4" />}
                label="ID"
                value={user.id}
              />
              <InfoRow
                icon={<AtSign className="w-4 h-4" />}
                label="Username"
                value={`@${user.username}`}
              />
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone Number"
                value={user.phone_number}
              />
            </div>
          </div>

          {/* Physical Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Physical Information
            </h2>
            <div className="grid gap-4">
              <InfoRow
                icon={<UserCircle2 className="w-4 h-4" />}
                label="Gender"
                value={user.gender === "MALE" ? "Erkak" : "Ayol"}
              />
              <InfoRow
                icon={<User2 className="w-4 h-4" />}
                label="Age"
                value={`${user.age} years`}
              />
              <InfoRow
                icon={<Ruler className="w-4 h-4" />}
                label="Height"
                value={`${user.height} cm`}
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Account Information
            </h2>
            <div className="grid gap-4">
              <InfoRow
                icon={<Calendar className="w-4 h-4" />}
                label="Member Since"
                value={formattedDate}
              />
            </div>
          </div>

          {/* Payments */}
          {user.payments && user.payments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Payment History
                </h2>
                <span className="text-sm text-gray-500">
                  {user.payments.length}{" "}
                  {user.payments.length === 1 ? "payment" : "payments"}
                </span>
              </div>
              <div className="grid gap-4">
                {user.payments.map((payment: Payment, index: number) => (
                  <div
                    key={payment.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-2 border border-transparent"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-900">
                          {payment.amount} {payment.currency}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            payment.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 pt-1">
                      Paid on{" "}
                      {format(
                        new Date(payment.created_at),
                        "MMM d, yyyy, h:mm a"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Sessions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Active Sessions
              </h2>
              <span className="text-sm text-gray-500">
                {sessions.length} active{" "}
                {sessions.length === 1 ? "session" : "sessions"}
              </span>
            </div>
            <div className="grid gap-4">
              {isLoadingSessions ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  Loading sessions...
                </div>
              ) : sessions.length > 0 ? (
                sessions.map((session, index) => {
                  const { device, browser } = formatDeviceInfo(
                    session.device_info
                  );
                  const isCurrentSession = session.ip_address === "current_ip"; // You'll need to implement this check

                  return (
                    <div
                      key={index}
                      className={`bg-gray-50 rounded-lg p-4 space-y-2 border ${
                        isCurrentSession
                          ? "border-primary/20 bg-primary/5"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-gray-900">
                            {device}
                          </span>
                          {isCurrentSession && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Current Session
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{browser}</span>
                      </div>

                      <div className="grid gap-1.5 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Globe className="w-3.5 h-3.5" />
                          <span className="text-xs">{session.ip_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">
                            Active:{" "}
                            {format(
                              new Date(session.last_online),
                              "MMM d, h:mm a"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 pt-1">
                        Started{" "}
                        {format(
                          new Date(session.created_at),
                          "MMM d, yyyy"
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  No active sessions found
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-2 px-4 bg-gray-50 rounded-lg">
      <span className="flex items-center gap-2 text-sm font-medium text-gray-500 sm:w-1/3">
        {icon}
        {label}
      </span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}
