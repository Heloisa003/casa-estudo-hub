import { Shield, Search, MessageCircle, Star, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "Verificação de documentos e perfis para sua proteção total",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: Search,
      title: "Busca Inteligente",
      description: "Filtros avançados para encontrar exatamente o que você precisa",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: MessageCircle,
      title: "Comunicação Direta",
      description: "Chat integrado para conversar com proprietários em tempo real",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: Star,
      title: "Sistema de Avaliações",
      description: "Avaliações reais de estudantes para decisões mais informadas",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Conecte-se com outros estudantes e construa sua rede",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: MapPin,
      title: "Localização Precisa",
      description: "Mapa interativo com distâncias exatas até sua universidade",
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher a <span className="text-secondary">Fushub?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos uma plataforma completa e segura para 
            estudantes encontrarem sua moradia ideal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-2xl ${feature.bg} mb-4`}>
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-secondary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;