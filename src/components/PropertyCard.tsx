import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Star, Heart, Wifi, Car, PawPrint, Coffee } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  type: string;
  roommates: number;
  amenities: string[];
  premium?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorited = isFavorite(property.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    const success = await toggleFavorite(property.id);
    
    if (success) {
      // Animação de sucesso
      setTimeout(() => setIsAnimating(false), 600);
    } else {
      // Se falhar, remover animação imediatamente
      setIsAnimating(false);
    }
  };

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    pets: PawPrint,
    kitchen: Coffee,
  };

  return (
    <Card className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden">
      {property.premium && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-accent text-accent-foreground shadow-yellow">
            Premium
          </Badge>
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background hover:shadow-lg transition-all duration-300 z-10",
            isAnimating && "animate-scale-in"
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
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{property.rating}</span>
            <span className="text-sm text-muted-foreground">({property.reviews})</span>
          </div>
        </div>

        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {property.type}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            {property.roommates} moradores
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          {property.amenities.slice(0, 4).map((amenity) => {
            const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
            return IconComponent ? (
              <div key={amenity} className="p-1.5 bg-muted rounded-md">
                <IconComponent className="w-3 h-3 text-muted-foreground" />
              </div>
            ) : null;
          })}
          {property.amenities.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{property.amenities.length - 4} mais
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-2xl font-bold text-secondary">
              R$ {property.price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">por mês</div>
          </div>
          <Button variant="cta" asChild>
            <a href={`/property/${property.id}`}>Ver Detalhes</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;