import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/PropertyCard";
import Header from "@/components/Header";
import { MapPin, Search, SlidersHorizontal, Grid, List, Map } from "lucide-react";
import studentRoom1 from "@/assets/student-room-1.jpg";
import studentRoom2 from "@/assets/student-room-2.jpg";
import studentRoom3 from "@/assets/student-room-3.jpg";

const SearchPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const properties = [
    {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
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
      id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
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
      id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
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
    {
      id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
      title: "Casa Estudantil Completa",
      location: "1,2km da UFMG - Belo Horizonte",
      price: 980,
      rating: 4.7,
      reviews: 15,
      image: studentRoom1,
      type: "Casa Estudantil",
      roommates: 6,
      amenities: ["wifi", "pets", "kitchen"],
    },
    {
      id: "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
      title: "Studio Individual Premium",
      location: "800m da PUC - Porto Alegre",
      price: 1680,
      rating: 4.9,
      reviews: 42,
      image: studentRoom2,
      type: "Studio",
      roommates: 0,
      amenities: ["wifi", "parking", "kitchen"],
      premium: true,
    },
    {
      id: "f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66",
      title: "Quarto em República Feminina",
      location: "1,5km da UFSC - Florianópolis",
      price: 750,
      rating: 4.5,
      reviews: 12,
      image: studentRoom3,
      type: "República",
      roommates: 4,
      amenities: ["wifi", "kitchen"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Search Header */}
        <section className="bg-gradient-hero py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
                Encontre sua moradia ideal
              </h1>
              
              {/* Enhanced Search Bar */}
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-strong">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Cidade ou universidade"
                        className="pl-10 h-12"
                        defaultValue="São Paulo"
                      />
                    </div>
                    <select className="h-12 px-4 border border-border rounded-md bg-background">
                      <option>Todos os tipos</option>
                      <option>Quarto individual</option>
                      <option>Quarto compartilhado</option>
                      <option>República</option>
                      <option>Apartamento</option>
                    </select>
                    <Input
                      placeholder="Preço máximo"
                      className="h-12"
                      defaultValue="R$ 1.500"
                    />
                    <Button variant="hero" size="lg" className="h-12">
                      <Search className="w-4 h-4" />
                      Buscar
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {["Próximo ao centro", "Pet-friendly", "Mobiliado", "Internet inclusa", "Estacionamento"].map((filter) => (
                        <Badge key={filter} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                          {filter}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  156 moradias encontradas
                </h2>
                <p className="text-muted-foreground">
                  Resultados para "São Paulo" • Ordenado por relevância
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters Sidebar */}
            {showFilters && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                <Card className="lg:col-span-1">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Filtros Avançados</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Faixa de Preço</label>
                        <div className="space-y-2">
                          <Input placeholder="Mínimo" />
                          <Input placeholder="Máximo" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Tipo de Moradia</label>
                        <div className="space-y-2">
                          {["Quarto Individual", "Quarto Compartilhado", "República", "Apartamento", "Casa"].map((type) => (
                            <label key={type} className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Comodidades</label>
                        <div className="space-y-2">
                          {["WiFi", "Estacionamento", "Pet-friendly", "Cozinha", "Lavanderia"].map((amenity) => (
                            <label key={amenity} className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="lg:col-span-3">
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!showFilters && (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Carregar mais resultados
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SearchPage;