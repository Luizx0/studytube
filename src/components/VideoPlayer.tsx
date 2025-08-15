import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Save } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps {
  onVideoSave: (video: { id: string; title: string; url: string; subject: string }) => void;
}

export function VideoPlayer({ onVideoSave }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlSubmit = () => {
    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoId(id);
      setIsPlaying(true);
    }
  };

  const handleSaveVideo = () => {
    if (videoId) {
      onVideoSave({
        id: videoId,
        title: `Vídeo ${Date.now()}`,
        url: videoUrl,
        subject: "Geral"
      });
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Player de Vídeo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Cole o link do YouTube aqui..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
          />
          <Button onClick={handleUrlSubmit} variant="default">
            Carregar
          </Button>
        </div>
        
        {videoId && (
          <>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1"
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pausar" : "Reproduzir"}
              </Button>
              <Button variant="outline" onClick={handleSaveVideo}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setVideoId("");
                  setVideoUrl("");
                  setIsPlaying(false);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}