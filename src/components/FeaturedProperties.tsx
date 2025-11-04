import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mockProperties } from "@/data/mockProperties";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (!error && data) {
      // Transformar dados do Supabase para o formato esperado pelo PropertyCard
      const transformedData = data.map(prop => ({
        id: prop.id,
        title: prop.title,
        location: `${prop.neighborhood}, ${prop.city}`,
        price: Number(prop.price),
        rating: 4.8,
        reviews: 0,
        image: prop.images?.[0] || "/placeholder.svg",
        images: prop.images,
        type: prop.property_type,
        roommates: prop.max_occupants - 1,
        amenities: prop.amenities || [],
        premium: prop.is_premium,
        address: prop.address,
        ...prop
      }));
      setProperties(transformedData);
    }
    setLoading(false);
  };

  // Se não houver propriedades do banco, usar as mockadas
  const featuredProperties = properties.length > 0 
    ? properties.slice(0, 3) 
    : mockProperties.slice(0, 3);

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

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