import heroImage from "@/assets/hero-study-image.jpg";
import { useState, useEffect } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { NotesEditor } from "@/components/NotesEditor";
import { SubjectFilter } from "@/components/SubjectFilter";
import { VideoHistory } from "@/components/VideoHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Clock, FileText, History as HistoryIcon, LogOut } from "lucide-react";

interface Video {
  id: string;
  title: string;
  url: string;
  subject: string;
  watchedAt: Date;
}

export default function StudyDashboard() {
  const { user, signOut } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [videoHistory, setVideoHistory] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // Load video history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("video-history");
    if (saved) {
      const parsed = JSON.parse(saved);
      const videos = parsed.map((video: any) => ({
        ...video,
        watchedAt: new Date(video.watchedAt)
      }));
      setVideoHistory(videos);
    }
  }, []);

  // Save video history to localStorage whenever it changes
  useEffect(() => {
    if (videoHistory.length > 0) {
      localStorage.setItem("video-history", JSON.stringify(videoHistory));
    }
  }, [videoHistory]);

  const handleVideoSave = (video: Omit<Video, "watchedAt">) => {
    const newVideo: Video = {
      ...video,
      watchedAt: new Date()
    };
    
    // Avoid duplicates
    const exists = videoHistory.find(v => v.id === video.id);
    if (!exists) {
      setVideoHistory(prev => [newVideo, ...prev]);
    }
    
    setCurrentVideo(newVideo);
  };

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
  };

  const handleVideoRemove = (videoId: string) => {
    setVideoHistory(prev => prev.filter(v => v.id !== videoId));
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">StudyTube</h1>
                <p className="text-sm text-muted-foreground">
                  Sua plataforma de estudos com YouTube
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{videoHistory.length} vídeos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Pomodoro ativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Olá, {user?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters and Timer */}
          <div className="lg:col-span-1 space-y-6">
            <SubjectFilter
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
            />
            <PomodoroTimer />
          </div>

          {/* Center Content - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer onVideoSave={handleVideoSave} />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {videoHistory.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Vídeos Assistidos
                </div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-success">
                  {videoHistory.filter(v => v.watchedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Esta Semana
                </div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-info">
                  {new Set(videoHistory.map(v => v.subject)).size}
                </div>
                <div className="text-sm text-muted-foreground">
                  Matérias Diferentes
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Notes and History */}
          <div className="lg:col-span-1 space-y-6">
            <NotesEditor />
            <VideoHistory
              videos={videoHistory}
              onVideoSelect={handleVideoSelect}
              onVideoRemove={handleVideoRemove}
              selectedSubject={selectedSubject}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>StudyTube - Transforme vídeos em conhecimento</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>✨ Interface otimizada para estudos</span>
              <span>🎯 Técnica Pomodoro integrada</span>
              <span>📝 Anotações automáticas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}