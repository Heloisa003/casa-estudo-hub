import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/PropertyCard";
import Header from "@/components/Header";
import { MapPin, Search, SlidersHorizontal, Grid, List, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mockProperties } from "@/data/mockProperties";

const SearchPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados dos filtros
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchLocation, selectedType, maxPrice, minPrice, selectedTypes, selectedAmenities, quickFilters, allProperties]);

  const loadProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const transformedData = data.map(prop => ({
        id: prop.id,
        title: prop.title,
        location: `${prop.neighborhood}, ${prop.city}`,
        city: prop.city,
        neighborhood: prop.neighborhood,
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
      setAllProperties(transformedData);
      setProperties(transformedData);
    } else {
      setAllProperties(mockProperties);
      setProperties(mockProperties);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...allProperties];

    // Filtro de localização
    if (searchLocation.trim()) {
      const searchLower = searchLocation.toLowerCase();
      filtered = filtered.filter(prop => 
        prop.city?.toLowerCase().includes(searchLower) ||
        prop.neighborhood?.toLowerCase().includes(searchLower) ||
        prop.location?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de tipo (select principal)
    if (selectedType !== "all") {
      filtered = filtered.filter(prop => prop.type === selectedType);
    }

    // Filtro de tipos (checkboxes)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(prop => selectedTypes.includes(prop.type));
    }

    // Filtro de preço máximo
    if (maxPrice) {
      const max = parseFloat(maxPrice.replace(/[^\d]/g, ''));
      if (!isNaN(max)) {
        filtered = filtered.filter(prop => prop.price <= max);
      }
    }

    // Filtro de preço mínimo
    if (minPrice) {
      const min = parseFloat(minPrice.replace(/[^\d]/g, ''));
      if (!isNaN(min)) {
        filtered = filtered.filter(prop => prop.price >= min);
      }
    }

    // Filtro de amenidades
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(prop => 
        selectedAmenities.every(amenity => 
          prop.amenities?.some((a: string) => a.toLowerCase().includes(amenity.toLowerCase()))
        )
      );
    }

    // Filtros rápidos
    if (quickFilters.length > 0) {
      filtered = filtered.filter(prop => {
        return quickFilters.every(filter => {
          if (filter === "Mobiliado") return prop.amenities?.includes("mobiliado");
          if (filter === "Internet inclusa") return prop.amenities?.includes("wifi");
          if (filter === "Pet-friendly") return prop.amenities?.includes("pets");
          if (filter === "Estacionamento") return prop.amenities?.includes("estacionamento");
          return true;
        });
      });
    }

    setProperties(filtered);
  };

  const handleSearch = () => {
    applyFilters();
  };

  const toggleQuickFilter = (filter: string) => {
    setQuickFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

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
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                    </div>
                    <select 
                      className="h-12 px-4 border border-border rounded-md bg-background"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="quarto_individual">Quarto individual</option>
                      <option value="quarto_compartilhado">Quarto compartilhado</option>
                      <option value="casa">Casa</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="kitnet">Kitnet</option>
                    </select>
                    <Input
                      placeholder="Preço máximo"
                      className="h-12"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <Button variant="hero" size="lg" className="h-12" onClick={handleSearch}>
                      <Search className="w-4 h-4" />
                      Buscar
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {["Pet-friendly", "Mobiliado", "Internet inclusa", "Estacionamento"].map((filter) => (
                        <Badge 
                          key={filter} 
                          variant={quickFilters.includes(filter) ? "default" : "secondary"}
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => toggleQuickFilter(filter)}
                        >
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
                {loading ? "Carregando..." : `${properties.length} moradias encontradas`}
              </h2>
              <p className="text-muted-foreground">
                {loading ? "Buscando imóveis disponíveis..." : "Ordenado por mais recentes"}
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
                          <Input 
                            placeholder="Mínimo" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                          <Input 
                            placeholder="Máximo" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Tipo de Moradia</label>
                        <div className="space-y-2">
                          {[
                            { label: "Quarto Individual", value: "quarto_individual" },
                            { label: "Quarto Compartilhado", value: "quarto_compartilhado" },
                            { label: "Casa", value: "casa" },
                            { label: "Apartamento", value: "apartamento" },
                            { label: "Kitnet", value: "kitnet" }
                          ].map((type) => (
                            <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedTypes.includes(type.value)}
                                onChange={() => toggleType(type.value)}
                              />
                              <span className="text-sm">{type.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Comodidades</label>
                        <div className="space-y-2">
                          {["WiFi", "Estacionamento", "Pet-friendly", "Cozinha", "Lavanderia"].map((amenity) => (
                            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedAmenities.includes(amenity)}
                                onChange={() => toggleAmenity(amenity)}
                              />
                              <span className="text-sm">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setSearchLocation("");
                          setSelectedType("all");
                          setMaxPrice("");
                          setMinPrice("");
                          setSelectedTypes([]);
                          setSelectedAmenities([]);
                          setQuickFilters([]);
                        }}
                      >
                        Limpar Filtros
                      </Button>
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
              loading ? (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-96 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <Card className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">Nenhum imóvel encontrado</h3>
                  <p className="text-muted-foreground">
                    Não há imóveis disponíveis no momento. Tente novamente mais tarde.
                  </p>
                </Card>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )
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