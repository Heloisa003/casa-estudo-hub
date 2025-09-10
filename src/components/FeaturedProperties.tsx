import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import studentRoom1 from "@/assets/student-room-1.jpg";
import studentRoom2 from "@/assets/student-room-2.jpg";
import studentRoom3 from "@/assets/student-room-3.jpg";

const FeaturedProperties = () => {
  const featuredProperties = [
    {
      id: "1",
      title: "Quarto Moderno - Vila Universitária",
      location: "2,5km da USP - São Paulo",
      price: 1200,
      rating: 4.8,
      reviews: 24,
      image: studentRoom1,
      type: "Quarto Individual",
      roommates: 3,
      amenities: ["wifi", "parking", "kitchen"],
      premium: true,
    },
    {
      id: "2",
      title: "República Aconchegante",
      location: "1,8km da UNICAMP - Campinas",
      price: 850,
      rating: 4.6,
      reviews: 18,
      image: studentRoom2,
      type: "República",
      roommates: 5,
      amenities: ["wifi", "pets", "kitchen"],
    },
    {
      id: "3",
      title: "Apartamento Compartilhado",
      location: "3km da UFRJ - Rio de Janeiro",
      price: 1450,
      rating: 4.9,
      reviews: 31,
      image: studentRoom3,
      type: "Quarto Compartilhado",
      roommates: 2,
      amenities: ["wifi", "parking", "kitchen", "pets"],
      premium: true,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Imóveis em <span className="text-secondary">Destaque</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descobra as melhores opções de moradia estudantil, 
            verificadas e avaliadas pela nossa comunidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg" asChild>
            <a href="/search" className="group">
              Ver Todas as Vagas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;