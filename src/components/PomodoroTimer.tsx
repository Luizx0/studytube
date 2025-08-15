import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [sessions, setSessions] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const { toast } = useToast();
  
  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const currentTime = minutes * 60 + seconds;
  const progress = ((totalTime - currentTime) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          setIsPaused(true);
          
          if (isBreak) {
            toast({
              title: "Pausa terminada!",
              description: "Hora de voltar aos estudos. Foco!",
            });
            setMinutes(25);
            setIsBreak(false);
          } else {
            setSessions(sessions + 1);
            toast({
              title: "Pomodoro concluído!",
              description: `Sessão ${sessions + 1} finalizada. Hora da pausa!`,
            });
            setMinutes(5);
            setIsBreak(true);
          }
          setSeconds(0);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, minutes, seconds, sessions, isBreak, toast]);

  const handleStartPause = () => {
    setIsActive(true);
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    if (isBreak) {
      setMinutes(5);
    } else {
      setMinutes(25);
    }
    setSeconds(0);
  };

  const handleSkip = () => {
    if (isBreak) {
      setMinutes(25);
      setIsBreak(false);
      toast({
        title: "Pausa pulada",
        description: "Voltando aos estudos!",
      });
    } else {
      setSessions(sessions + 1);
      setMinutes(5);
      setIsBreak(true);
      toast({
        title: "Sessão pulada",
        description: "Indo para a pausa!",
      });
    }
    setSeconds(0);
    setIsActive(false);
    setIsPaused(true);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Pomodoro Timer
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            Sessões: {sessions}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-sm font-medium mb-2 text-primary">
            {isBreak ? "Pausa" : "Foco nos Estudos"}
          </div>
          <div className="text-6xl font-bold font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <Progress value={progress} className="h-3" />

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleStartPause}
            variant={isPaused ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {isPaused ? "Iniciar" : "Pausar"}
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex items-center gap-2"
          >
            Pular
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {isBreak ? "Tempo de descanso - relaxe!" : "Mantenha o foco nos estudos!"}
        </div>
      </CardContent>
    </Card>
  );
}