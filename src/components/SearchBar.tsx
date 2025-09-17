import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Users, DollarSign } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up px-4">
      <div className="bg-card rounded-2xl shadow-strong p-4 sm:p-6 border border-border/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Localização */}
          <div className="relative">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Onde?
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cidade ou universidade"
                className="pl-10 h-12 border-border/50 focus:border-secondary"
              />
            </div>
          </div>

          {/* Tipo */}
          <div className="relative">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Tipo
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select className="w-full h-12 pl-10 pr-4 border border-border/50 rounded-md bg-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none">
                <option>Quarto individual</option>
                <option>Quarto compartilhado</option>
                <option>República</option>
                <option>Apartamento</option>
              </select>
            </div>
          </div>

          {/* Preço */}
          <div className="relative">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Preço máximo
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="R$ 1.000"
                className="pl-10 h-12 border-border/50 focus:border-secondary"
              />
            </div>
          </div>

          {/* Botão de Busca */}
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <Button variant="hero" size="lg" className="w-full h-12">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
          {["Próximo ao centro", "Pet-friendly", "Mobiliado", "Internet inclusa"].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1 text-sm bg-muted hover:bg-secondary/20 text-muted-foreground hover:text-secondary rounded-full transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;