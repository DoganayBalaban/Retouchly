"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
  Loader,
  Sparkles,
  Image as ImageIcon,
  Scissors,
  Smile,
  Volume2,
  Heart,
  Clock,
  TrendingUp,
  Palette,
  ArrowRight,
  Wand2,
  ScanFace,
  Eraser,
  Layers,
  AudioLines,
  Calendar,
  Star,
  Zap,
  BarChart3,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

// ─── Activity helpers ────────────────────────────────────────────
const activityMeta: Record<
  string,
  { icon: React.ReactNode; label: string; gradient: string }
> = {
  image_generation: {
    icon: <ImageIcon className="w-4 h-4" />,
    label: "AI Generated",
    gradient: "from-blue-500 to-cyan-400",
  },
  face_restoration: {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Face Restored",
    gradient: "from-green-500 to-emerald-400",
  },
  background_removal: {
    icon: <Scissors className="w-4 h-4" />,
    label: "BG Removed",
    gradient: "from-purple-500 to-violet-400",
  },
  image_overlay: {
    icon: <Smile className="w-4 h-4" />,
    label: "Overlay",
    gradient: "from-orange-500 to-amber-400",
  },
  voice_generation: {
    icon: <Volume2 className="w-4 h-4" />,
    label: "Voice",
    gradient: "from-teal-500 to-cyan-400",
  },
};

// ─── Tool cards data ─────────────────────────────────────────────
const tools = [
  {
    name: "Image Generator",
    description: "Create stunning images from text prompts using AI",
    href: "/image-generation",
    icon: <Wand2 className="w-6 h-6" />,
    gradient: "from-blue-600 to-indigo-600",
    glow: "group-hover:shadow-blue-500/25",
  },
  {
    name: "Face Restoration",
    description: "Enhance & restore faces in your photos",
    href: "/face-restoration",
    icon: <ScanFace className="w-6 h-6" />,
    gradient: "from-emerald-600 to-green-600",
    glow: "group-hover:shadow-emerald-500/25",
  },
  {
    name: "Background Remover",
    description: "Remove backgrounds instantly with one click",
    href: "/background-remover",
    icon: <Eraser className="w-6 h-6" />,
    gradient: "from-purple-600 to-violet-600",
    glow: "group-hover:shadow-purple-500/25",
  },
  {
    name: "Image Editor",
    description: "Add overlays, stickers & effects to images",
    href: "/image-overlay",
    icon: <Layers className="w-6 h-6" />,
    gradient: "from-orange-600 to-amber-600",
    glow: "group-hover:shadow-orange-500/25",
  },
  {
    name: "Text to Speech",
    description: "Convert your text into natural AI voice",
    href: "/text-to-speech",
    icon: <AudioLines className="w-6 h-6" />,
    gradient: "from-teal-600 to-cyan-600",
    glow: "group-hover:shadow-teal-500/25",
  },
];

// ─── URL validation ──────────────────────────────────────────────
const isValidImageUrl = (url: any): boolean => {
  if (!url || typeof url !== "string" || url.trim() === "") return false;
  if (url === "{}" || url === "null" || url === "undefined") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith("/") || url.startsWith("./");
  }
};

// ─── Dashboard Page ──────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/");
        return;
      }
      setUser(data.user);
      await loadData(data.user.id);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const loadData = async (userId: string) => {
    const [activitiesRes, favoritesRes] = await Promise.all([
      supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase.from("user_favorites").select("*").eq("user_id", userId),
    ]);
    setActivities(activitiesRes.data || []);
    setFavorites(favoritesRes.data || []);
  };

  // ─── Derived stats ──────────────────────────────────────────
  const totalCreations = activities.length;
  const totalFavorites = favorites.length;

  // Most used tool
  const typeCounts: Record<string, number> = {};
  activities.forEach((a) => {
    const t = a.activity_type || "image_generation";
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  const mostUsedTool =
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "image_generation";

  // This week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekCount = activities.filter(
    (a) => new Date(a.created_at) > oneWeekAgo,
  ).length;

  // Recent 6
  const recentCreations = activities
    .filter(
      (a) =>
        isValidImageUrl(a.image_url) && a.activity_type !== "voice_generation",
    )
    .slice(0, 6);

  // Activity breakdown percentages
  const activityBreakdown = Object.entries(typeCounts)
    .map(([type, count]) => ({
      type,
      count,
      percentage: totalCreations
        ? Math.round((count / totalCreations) * 100)
        : 0,
      ...activityMeta[type],
    }))
    .sort((a, b) => b.count - a.count);

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Creator";

  // ─── Stats cards data ──────────────────────────────────────
  const stats = [
    {
      label: "Total Creations",
      value: totalCreations,
      icon: <Palette className="w-5 h-5" />,
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Favorites",
      value: totalFavorites,
      icon: <Heart className="w-5 h-5" />,
      gradient: "from-pink-500/20 to-rose-500/20",
      border: "border-pink-500/20",
      iconColor: "text-pink-400",
    },
    {
      label: "This Week",
      value: thisWeekCount,
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Most Used",
      value: activityMeta[mostUsedTool]?.label || "—",
      icon: <Star className="w-5 h-5" />,
      gradient: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0a0f] to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ─── Welcome Header ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                {greeting()}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {userName}
                </span>
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Welcome to your creative workspace. Let&apos;s make something
                amazing.
              </p>
            </div>
            <Link href="/image-generation">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 transition-all">
                <Sparkles className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ─── Stats Cards ───────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <Card
                className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-xl border ${stat.border} hover:scale-[1.03] transition-all duration-300`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg bg-white/5 ${stat.iconColor}`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ─── Quick Access Tools ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Quick Access
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
              >
                <Link href={tool.href} className="group block">
                  <Card
                    className={`bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 shadow-lg ${tool.glow} hover:shadow-xl cursor-pointer overflow-hidden relative`}
                  >
                    {/* Gradient top bar */}
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${tool.gradient}`}
                    />
                    <CardContent className="p-4 pt-4">
                      <div
                        className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${tool.gradient} text-white mb-3 shadow-lg`}
                      >
                        {tool.icon}
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-blue-300 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 group-hover:text-blue-400 transition-colors">
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── Bottom Grid: Recent + Activity ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Creations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
              <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Recent Creations
                </h2>
                <Link href="/history">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/5 text-xs"
                  >
                    View All
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <CardContent className="p-5">
                {recentCreations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-800/20">
                      <ImageIcon className="w-8 h-8 text-blue-400/60" />
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      No creations yet
                    </p>
                    <Link href="/image-generation">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm"
                      >
                        Create Your First Image
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {recentCreations.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-gray-900 cursor-pointer"
                        onClick={() => router.push("/history")}
                      >
                        <Image
                          src={item.image_url}
                          alt={item.prompt || "Creation"}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.svg";
                          }}
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] w-fit bg-gradient-to-r ${
                              activityMeta[
                                item.activity_type || "image_generation"
                              ]?.gradient || "from-gray-500 to-gray-400"
                            } text-white border-0 mb-1`}
                          >
                            {activityMeta[
                              item.activity_type || "image_generation"
                            ]?.label || "AI"}
                          </Badge>
                          {item.prompt && (
                            <p className="text-[11px] text-gray-200 line-clamp-2 leading-tight">
                              {item.prompt}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <Card className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 overflow-hidden h-full">
              <div className="p-5 border-b border-gray-700/50">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Activity Breakdown
                </h2>
              </div>
              <CardContent className="p-5">
                {activityBreakdown.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-800/20">
                      <BarChart3 className="w-8 h-8 text-purple-400/60" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      Start creating to see your stats
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {activityBreakdown.map((item, i) => (
                      <motion.div
                        key={item.type}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 + i * 0.08 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded-md bg-gradient-to-r ${item.gradient} text-white`}
                            >
                              {item.icon}
                            </div>
                            <span className="text-sm text-gray-300">
                              {item.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {item.count}
                            </span>
                            <span className="text-sm font-semibold text-white">
                              {item.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{
                              duration: 0.8,
                              delay: 1.0 + i * 0.1,
                              ease: "easeOut",
                            }}
                            className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`}
                          />
                        </div>
                      </motion.div>
                    ))}

                    {/* Total summary */}
                    <div className="pt-4 mt-4 border-t border-gray-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Total Activities
                        </span>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {totalCreations}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
