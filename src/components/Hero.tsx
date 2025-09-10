import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Encontre sua
              <span className="block bg-gradient-accent bg-clip-text text-transparent">
                moradia ideal
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Conectamos estudantes a proprietários de imóveis, repúblicas 
              e vagas próximas à sua universidade
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-white/90">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">50k+</div>
              <div className="text-sm">Estudantes ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">5k+</div>
              <div className="text-sm">Imóveis disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">200+</div>
              <div className="text-sm">Cidades atendidas</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-12">
            <SearchBar />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button variant="cta" size="xl">
              Sou Estudante
            </Button>
            <Button variant="nav" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              Sou Proprietário
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 bg-accent/20 rounded-full" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: "1s" }}>
        <div className="w-16 h-16 bg-white/10 rounded-full" />
      </div>
      <div className="absolute top-1/2 right-20 animate-float" style={{ animationDelay: "2s" }}>
        <div className="w-12 h-12 bg-accent/30 rounded-full" />
      </div>
    </section>
  );
};

export default Hero;