import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { 
  MapPin, Users, Star, Heart, Share2, Calendar, 
  Wifi, Car, PawPrint, Coffee, WashingMachine, Shield,
  MessageCircle, Phone, Mail, ChevronLeft, ChevronRight
} from "lucide-react";
import studentRoom1 from "@/assets/student-room-1.jpg";
import studentRoom2 from "@/assets/student-room-2.jpg";
import studentRoom3 from "@/assets/student-room-3.jpg";

const PropertyDetails = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const images = [studentRoom1, studentRoom2, studentRoom3, studentRoom1, studentRoom2];
  
  const amenities = [
    { icon: Wifi, label: "WiFi Gratuito", available: true },
    { icon: Car, label: "Estacionamento", available: true },
    { icon: PawPrint, label: "Pet-friendly", available: false },
    { icon: Coffee, label: "Cozinha Equipada", available: true },
    { icon: WashingMachine, label: "Lavanderia", available: true },
    { icon: Shield, label: "Segurança 24h", available: true },
  ];

  const roommates = [
    { name: "Ana Silva", course: "Medicina - USP", year: "3º ano", avatar: "/placeholder.svg" },
    { name: "Carlos Santos", course: "Engenharia - USP", year: "2º ano", avatar: "/placeholder.svg" },
    { name: "Mariana Costa", course: "Direito - USP", year: "4º ano", avatar: "/placeholder.svg" },
  ];

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
    {
      name: "Lucas Mendes",
      rating: 5,
      date: "Há 2 meses",
      comment: "Recomendo demais! O proprietário é super atencioso e a casa tem tudo que precisamos para focar nos estudos.",
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
      
      <main className="pt-20">
        {/* Image Gallery */}
        <section className="relative">
          <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt="Imóvel"
              className="w-full h-full object-cover"
            />
            
            {/* Navigation arrows */}
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
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            {/* Premium badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-accent text-accent-foreground shadow-yellow">
                Premium
              </Badge>
            </div>
            
            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
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
                      Quarto Moderno - Vila Universitária
                    </h1>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>2,5km da USP - Vila Madalena, São Paulo</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-accent text-accent mr-1" />
                        <span className="font-medium">4.8</span>
                        <span className="text-muted-foreground ml-1">(24 avaliações)</span>
                      </div>
                      <Badge variant="secondary">Quarto Individual</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        3 moradores
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-secondary">R$ 1.200</div>
                    <div className="text-sm text-muted-foreground">por mês</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Sobre esta moradia</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Quarto individual em casa estudantil localizada no coração da Vila Madalena, 
                    a apenas 2,5km da USP. Ambiente jovem e acolhedor, perfeito para estudantes 
                    que buscam comodidade e praticidade.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    A casa possui área comum ampla, cozinha totalmente equipada, internet de alta 
                    velocidade e ambiente de estudos. Todos os moradores são universitários, 
                    criando um ambiente colaborativo e focado nos estudos.
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Comodidades</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity, index) => {
                      const IconComponent = amenity.icon;
                      return (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-3 rounded-lg border ${
                            amenity.available 
                              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300' 
                              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="text-sm font-medium">{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Roommates */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Moradores atuais</h2>
                  <div className="space-y-4">
                    {roommates.map((roommate, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                        <Avatar>
                          <AvatarImage src={roommate.avatar} />
                          <AvatarFallback>{roommate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{roommate.name}</h3>
                          <p className="text-sm text-muted-foreground">{roommate.course}</p>
                          <p className="text-xs text-muted-foreground">{roommate.year}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4" />
                          Conversar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Avaliações (24)</h2>
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
              <Card className="sticky top-6 z-10 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Maria Santos</h3>
                      <p className="text-sm text-muted-foreground">Proprietária</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                        4.9 • 15 avaliações
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button variant="hero" className="w-full" size="lg">
                      <MessageCircle className="w-4 h-4" />
                      Enviar Mensagem
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4" />
                      Ligar
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Disponível a partir de Janeiro 2024</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Taxa de administração: R$ 50/mês
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
                      <p className="text-sm text-muted-foreground">Mapa interativo</p>
                      <p className="text-xs text-muted-foreground">2,5km da USP</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">USP - Cidade Universitária</span>
                      <span className="font-medium">8 min de carro</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estação Vila Madalena</span>
                      <span className="font-medium">12 min a pé</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shopping Eldorado</span>
                      <span className="font-medium">15 min de carro</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;