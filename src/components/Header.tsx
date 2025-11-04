import { Button } from "@/components/ui/button";
import { Search, Menu, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import fushubLogo from "@/assets/fushub-logo.png";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img 
              src={fushubLogo} 
              alt="Fushub Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Fushub
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-foreground hover:text-secondary transition-colors">
              Buscar Vagas
            </Link>
            <Link to="/add-property" className="text-foreground hover:text-secondary transition-colors">
              Cadastrar Imóvel
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-secondary transition-colors">
              Como Funciona
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button variant="nav" size="sm" className="hidden sm:inline-flex" asChild>
                  <Link to="/dashboard">
                    <User className="w-4 h-4" />
                    Meu Perfil
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="nav" size="sm" className="hidden sm:inline-flex" asChild>
                  <Link to="/login?tab=login">
                    <User className="w-4 h-4" />
                    Entrar
                  </Link>
                </Button>
                <Button variant="cta" size="sm" asChild>
                  <Link to="/login?tab=register">Cadastrar</Link>
                </Button>
              </>
            )}
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