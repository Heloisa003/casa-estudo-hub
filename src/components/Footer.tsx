import { Button } from "@/components/ui/button";
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-fushub-navy text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-fushub-navy" />
              </div>
              <span className="text-2xl font-bold">Fushub</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Conectando estudantes a moradias ideais em todo o Brasil. 
              Sua jornada universitária começa com a moradia perfeita.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              {[
                "Buscar Vagas",
                "Cadastrar Imóvel",
                "Como Funciona",
                "Planos Premium",
                "Comunidade",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Suporte</h3>
            <ul className="space-y-3">
              {[
                "Central de Ajuda",
                "FAQ",
                "Contato",
                "Termos de Uso",
                "Política de Privacidade",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/70">
                <Mail className="w-4 h-4" />
                <span>contato@fushub.com.br</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <Phone className="w-4 h-4" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="cta" size="sm">
                Fale Conosco
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/70">
            © 2024 Fushub. Todos os direitos reservados. 
            Facilitando a vida estudantil há mais de 5 anos.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;