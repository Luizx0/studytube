import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Save, Download, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function NotesEditor() {
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const { toast } = useToast();

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("study-notes");
    if (saved) {
      setNotes(saved);
    }
    
    const savedList = localStorage.getItem("saved-notes");
    if (savedList) {
      setSavedNotes(JSON.parse(savedList));
    }
  }, []);

  // Auto-save notes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (notes.trim()) {
        localStorage.setItem("study-notes", notes);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [notes]);

  const handleSaveNote = () => {
    if (notes.trim()) {
      const newSavedNotes = [...savedNotes, notes];
      setSavedNotes(newSavedNotes);
      localStorage.setItem("saved-notes", JSON.stringify(newSavedNotes));
      localStorage.setItem("study-notes", notes);
      
      toast({
        title: "Anotação salva!",
        description: "Sua anotação foi salva com sucesso.",
      });
    }
  };

  const handleExportNotes = () => {
    if (notes.trim()) {
      const blob = new Blob([notes], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anotacoes-${new Date().toLocaleDateString()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Anotações exportadas!",
        description: "Arquivo de texto baixado com sucesso.",
      });
    }
  };

  const handleClearNotes = () => {
    setNotes("");
    localStorage.removeItem("study-notes");
    
    toast({
      title: "Anotações limpas",
      description: "Todas as anotações foram removidas.",
    });
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Bloco de Anotações
          <span className="ml-auto text-xs text-muted-foreground">
            Auto-save ativo
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Digite suas anotações aqui... 
          
• Use para resumir conceitos importantes
• Anote dúvidas para pesquisar depois
• Registre insights e conexões entre temas
• Faça listas e esquemas"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[300px] resize-none"
        />
        
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={handleSaveNote} variant="default" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          
          <Button onClick={handleExportNotes} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          
          <Button onClick={handleClearNotes} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          {notes.length} caracteres | Última modificação: agora
        </div>
      </CardContent>
    </Card>
  );
}