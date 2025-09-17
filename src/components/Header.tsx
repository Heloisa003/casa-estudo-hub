import { Button } from "@/components/ui/button";
import { Search, Menu, User } from "lucide-react";
import fushubLogo from "@/assets/fushub-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img 
              src={fushubLogo} 
              alt="Fushub Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Fushub
            </span>
          </a>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/search" className="text-foreground hover:text-secondary transition-colors">
              Buscar Vagas
            </a>
            <a href="/dashboard" className="text-foreground hover:text-secondary transition-colors">
              Cadastrar Imóvel
            </a>
            <a href="/how-it-works" className="text-foreground hover:text-secondary transition-colors">
              Como Funciona
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="nav" size="sm" className="hidden sm:inline-flex" asChild>
              <a href="/login">
                <User className="w-4 h-4" />
                Entrar
              </a>
            </Button>
            <Button variant="cta" size="sm" asChild>
              <a href="/login">Cadastrar</a>
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