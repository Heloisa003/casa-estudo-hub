import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  propertyId: string;
  variant?: "card" | "page";
  className?: string;
}

export const FavoriteButton = ({ 
  propertyId, 
  variant = "card",
  className 
}: FavoriteButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorited = isFavorite(propertyId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar propriedades",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    setIsAnimating(true);
    const success = await toggleFavorite(propertyId);
    
    if (success) {
      setTimeout(() => setIsAnimating(false), 600);
    } else {
      setIsAnimating(false);
    }
  };

  if (variant === "card") {
    return (
      <button 
        onClick={handleClick}
        className={cn(
          "absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background hover:shadow-lg transition-all duration-300 z-10",
          isAnimating && "animate-scale-in",
          className
        )}
        aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-all duration-300",
            favorited 
              ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
              : "text-muted-foreground hover:text-red-500",
            isAnimating && (favorited ? "animate-[scale-in_0.3s_ease-out]" : "animate-fade-in")
          )} 
        />
      </button>
    );
  }

  // Variant "page" - botão maior para páginas de detalhes
  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300",
        favorited
          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          : "bg-background border-border hover:border-red-300 hover:text-red-500",
        isAnimating && "animate-scale-in",
        className
      )}
      aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-all duration-300",
          favorited && "fill-red-500",
          isAnimating && "animate-[scale-in_0.3s_ease-out]"
        )} 
      />
      <span className="font-medium">
        {favorited ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
      </span>
    </button>
  );
};
