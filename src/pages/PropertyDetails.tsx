import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Users, Star, Heart, Share2, Calendar, 
  Wifi, Car, PawPrint, Coffee, Shield,
  MessageCircle, Phone, Mail, ChevronLeft, ChevronRight,
  Home, Bed, Bath, Loader2
} from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPropertyDetails();
    }
  }, [id]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      
      // Carregar dados da propriedade
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;
      setProperty(propertyData);

      // Carregar dados do proprietário
      if (propertyData.owner_id) {
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', propertyData.owner_id)
          .single();
        setOwner(ownerData);
      }

      // Verificar se está favoritado
      if (user) {
        const { data: favoriteData } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('property_id', id)
          .maybeSingle();
        setIsFavorited(!!favoriteData);
      }
    } catch (error: any) {
      console.error('Erro ao carregar propriedade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da propriedade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar propriedades",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', id);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, property_id: id });
      }
      setIsFavorited(!isFavorited);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const images = property?.images || [];
  
  const amenityMap: Record<string, { icon: any; label: string }> = {
    wifi: { icon: Wifi, label: "Wi-Fi" },
    parking: { icon: Car, label: "Garagem" },
    pets_allowed: { icon: PawPrint, label: "Pet-friendly" },
    furnished: { icon: Coffee, label: "Mobiliado" },
    security: { icon: Shield, label: "Segurança 24h" },
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      casa: "Casa",
      apartamento: "Apartamento",
      kitnet: "Kitnet",
      quarto_individual: "Quarto Individual",
      quarto_compartilhado: "Quarto Compartilhado",
      comercial: "Comercial"
    };
    return types[type] || type;
  };

  const reviews = [
    {
      name: "Pedro Oliveira",
      rating: 5,
      date: "Há 2 semanas",
      comment: "Lugar incrível! Ambiente super acolhedor e os moradores são muito receptivos. A localização é perfeita para quem estuda na USP.",
      avatar: "/placeholder.svg"
    },
    {
      name: "Julia Ferreira",
      rating: 4,
      date: "Há 1 mês",
      comment: "Moradia bem estruturada e limpa. A única observação é que às vezes fica um pouco barulhento nos fins de semana.",
      avatar: "/placeholder.svg"
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !property ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Home className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Propriedade não encontrada</h2>
          <p className="text-muted-foreground">Esta propriedade não existe ou foi removida.</p>
        </div>
      ) : (
        <main className="pt-20">
        {/* Image Gallery */}
        <section className="relative">
          {images.length > 0 && (
            <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt="Imóvel"
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background/90 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background/90 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {property.is_premium && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-accent-foreground shadow-yellow">
                    Premium
                  </Badge>
                </div>
              )}
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isFavorited ? 'bg-red-500 text-white' : 'bg-background/80 text-foreground hover:bg-background/90'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background/90 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.neighborhood}, {property.city}/{property.state}</span>
                    </div>
                    <div className="flex items-center space-x-4 flex-wrap gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-accent text-accent mr-1" />
                        <span className="font-medium">4.8</span>
                        <span className="text-muted-foreground ml-1">(2 avaliações)</span>
                      </div>
                      <Badge variant="secondary">{getPropertyTypeLabel(property.property_type)}</Badge>
                      <div className="flex items-center text-sm gap-3">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {property.bedrooms} quartos
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          {property.bathrooms} banheiros
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {property.max_occupants} pessoas
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-secondary">
                      R$ {Number(property.price).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-muted-foreground">por mês</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Sobre esta moradia</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Vagas disponíveis</p>
                      <p className="text-lg font-semibold">{property.available_spots}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={property.is_available ? "default" : "secondary"}>
                        {property.is_available ? "Disponível" : "Ocupado"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Comodidades</h2>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenityKey: string, index: number) => {
                        const amenity = amenityMap[amenityKey];
                        if (!amenity) return null;
                        const IconComponent = amenity.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 rounded-lg border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
                          >
                            <IconComponent className="w-5 h-5" />
                            <span className="text-sm font-medium">{amenity.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma comodidade informada</p>
                  )}
                </CardContent>
              </Card>

              {/* Roommates - Removido temporariamente */}

              {/* Reviews */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Avaliações (2)</h2>
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{review.name}</h3>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button variant="outline">Ver todas as avaliações</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="shadow-xl border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={owner?.avatar_url} />
                      <AvatarFallback>
                        {owner?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'PR'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{owner?.full_name || 'Proprietário'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {owner?.user_type === 'owner' ? 'Proprietário' : 'Anunciante'}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                        4.9
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button variant="hero" className="w-full" size="lg">
                      <MessageCircle className="w-4 h-4" />
                      Enviar Mensagem
                    </Button>
                    {owner?.phone && (
                      <Button variant="outline" className="w-full">
                        <Phone className="w-4 h-4" />
                        Ligar
                      </Button>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{property.is_available ? 'Disponível agora' : 'Indisponível'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Localização</h3>
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">{property.address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {property.neighborhood}, {property.city}/{property.state}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      )}
    </div>
  );
};

export default PropertyDetails;