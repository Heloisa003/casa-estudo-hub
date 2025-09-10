import { Button } from "@/components/ui/button";
import { Search, Menu, User, Home } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Fushub
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-secondary transition-colors">
              Buscar Vagas
            </a>
            <a href="#" className="text-foreground hover:text-secondary transition-colors">
              Cadastrar Imóvel
            </a>
            <a href="#" className="text-foreground hover:text-secondary transition-colors">
              Como Funciona
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="nav" size="sm" className="hidden sm:inline-flex">
              <User className="w-4 h-4" />
              Entrar
            </Button>
            <Button variant="cta" size="sm">
              Cadastrar
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;