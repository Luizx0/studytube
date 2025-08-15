import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter } from "lucide-react";
import { useState } from "react";

interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface SubjectFilterProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

export function SubjectFilter({ selectedSubject, onSubjectChange }: SubjectFilterProps) {
  const subjects: Subject[] = [
    { id: "all", name: "Todas as Matérias", color: "bg-gradient-primary", icon: "📚" },
    { id: "math", name: "Matemática", color: "bg-info", icon: "🔢" },
    { id: "portuguese", name: "Português", color: "bg-success", icon: "📝" },
    { id: "history", name: "História", color: "bg-warning", icon: "🏛️" },
    { id: "geography", name: "Geografia", color: "bg-primary", icon: "🌍" },
    { id: "science", name: "Ciências", color: "bg-info", icon: "🔬" },
    { id: "physics", name: "Física", color: "bg-destructive", icon: "⚛️" },
    { id: "chemistry", name: "Química", color: "bg-success", icon: "🧪" },
    { id: "biology", name: "Biologia", color: "bg-accent", icon: "🌱" },
    { id: "english", name: "Inglês", color: "bg-warning", icon: "🇺🇸" },
    { id: "literature", name: "Literatura", color: "bg-primary", icon: "📖" },
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filtrar por Matéria
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              onClick={() => onSubjectChange(subject.id)}
              variant={selectedSubject === subject.id ? "default" : "outline"}
              className="justify-start h-auto p-3"
            >
              <span className="text-base mr-2">{subject.icon}</span>
              <span className="flex-1 text-left">{subject.name}</span>
              {selectedSubject === subject.id && (
                <Badge variant="secondary" className="ml-2">
                  Ativo
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            📌 Dica: Use os filtros para organizar seus estudos por disciplina
          </div>
        </div>
      </CardContent>
    </Card>
  );
}