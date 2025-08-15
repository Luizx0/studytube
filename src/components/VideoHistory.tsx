import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Play, Trash2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  url: string;
  subject: string;
  watchedAt: Date;
}

interface VideoHistoryProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  onVideoRemove: (videoId: string) => void;
  selectedSubject: string;
}

export function VideoHistory({ videos, onVideoSelect, onVideoRemove, selectedSubject }: VideoHistoryProps) {
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(videos);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedSubject === "all") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(video => video.subject === selectedSubject));
    }
  }, [videos, selectedSubject]);

  const handleVideoSelect = (video: Video) => {
    onVideoSelect(video);
    toast({
      title: "Vídeo carregado!",
      description: `Reproduzindo: ${video.title}`,
    });
  };

  const handleRemoveVideo = (videoId: string) => {
    onVideoRemove(videoId);
    toast({
      title: "Vídeo removido",
      description: "Vídeo removido do histórico.",
      variant: "destructive"
    });
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      math: "bg-info text-info-foreground",
      portuguese: "bg-success text-success-foreground",
      history: "bg-warning text-warning-foreground",
      geography: "bg-primary text-primary-foreground",
      science: "bg-info text-info-foreground",
      physics: "bg-destructive text-destructive-foreground",
      chemistry: "bg-success text-success-foreground",
      biology: "bg-accent text-accent-foreground",
      english: "bg-warning text-warning-foreground",
      literature: "bg-primary text-primary-foreground",
    };
    return colors[subject] || "bg-secondary text-secondary-foreground";
  };

  const getSubjectName = (subject: string) => {
    const names: { [key: string]: string } = {
      math: "Matemática",
      portuguese: "Português",
      history: "História",
      geography: "Geografia",
      science: "Ciências",
      physics: "Física",
      chemistry: "Química",
      biology: "Biologia",
      english: "Inglês",
      literature: "Literatura",
    };
    return names[subject] || "Geral";
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Histórico de Vídeos
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {filteredVideos.length} vídeo{filteredVideos.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {selectedSubject === "all" 
                  ? "Nenhum vídeo assistido ainda"
                  : "Nenhum vídeo desta matéria no histórico"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="font-medium text-sm leading-relaxed">
                        {video.title}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getSubjectColor(video.subject)}>
                          {getSubjectName(video.subject)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {video.watchedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVideoSelect(video)}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(video.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveVideo(video.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}