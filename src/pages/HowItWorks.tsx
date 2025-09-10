import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Search, UserCheck, MessageCircle, FileText, 
  Shield, Star, Home, Users, Clock, CheckCircle,
  ArrowRight, Play
} from "lucide-react";

const HowItWorks = () => {
  const studentSteps = [
    {
      icon: Search,
      title: "1. Busque e Filtre",
      description: "Use nossos filtros avançados para encontrar exatamente o que procura: localização, preço, tipo de moradia e comodidades.",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      icon: UserCheck,
      title: "2. Crie seu Perfil",
      description: "Monte um perfil completo e verificado para ganhar a confiança dos proprietários e ter mais chances de ser aceito.",
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      icon: MessageCircle,
      title: "3. Entre em Contato",
      description: "Converse diretamente com proprietários e outros estudantes através do nosso chat seguro e integrado.",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      icon: FileText,
      title: "4. Feche o Negócio",
      description: "Assine contratos digitais seguros e comece sua nova jornada estudantil com tranquilidade total.",
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ];

  const ownerSteps = [
    {
      icon: Home,
      title: "1. Cadastre seu Imóvel",
      description: "Adicione fotos, descrições detalhadas e defina as regras da sua propriedade de forma simples e rápida.",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      icon: Users,
      title: "2. Encontre Inquilinos Ideais",
      description: "Receba propostas de estudantes verificados que se encaixam no perfil que você está procurando.",
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      icon: Shield,
      title: "3. Processo Seguro",
      description: "Todos os estudantes passam por verificação de identidade e você pode ver avaliações de outros proprietários.",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      icon: CheckCircle,
      title: "4. Gerencie com Facilidade",
      description: "Acompanhe contratos, receba pagamentos e comunique-se com inquilinos tudo pela nossa plataforma.",
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Verificação de identidade e documentos para todos os usuários"
    },
    {
      icon: Clock,
      title: "Rápido e Prático",
      description: "Encontre ou anuncie moradias em minutos, não em semanas"
    },
    {
      icon: Star,
      title: "Avaliações Reais",
      description: "Sistema de reviews transparente para decisões informadas"
    },
    {
      icon: MessageCircle,
      title: "Suporte 24/7",
      description: "Nossa equipe está sempre pronta para ajudar você"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Como Funciona a <span className="text-accent">Fushub</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 animate-slide-up">
              Conectamos estudantes e proprietários de forma simples, 
              segura e eficiente em todo o Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="xl">
                <Play className="w-5 h-5 mr-2" />
                Assistir Vídeo Demo
              </Button>
              <Button variant="nav" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Começar Agora
              </Button>
            </div>
          </div>
        </section>

        {/* Student Process */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Para <span className="text-secondary">Estudantes</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Encontre sua moradia ideal em 4 passos simples
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {studentSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <Card key={index} className="relative hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-2xl ${step.bg} mb-4`}>
                        <IconComponent className={`w-8 h-8 ${step.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                    {index < studentSteps.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button variant="hero" size="lg">
                Sou Estudante - Começar Busca
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Owner Process */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Para <span className="text-accent">Proprietários</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Monetize seu imóvel e encontre inquilinos ideais facilmente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {ownerSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <Card key={index} className="relative hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-2xl ${step.bg} mb-4`}>
                        <IconComponent className={`w-8 h-8 ${step.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                    {index < ownerSteps.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button variant="cta" size="lg">
                Sou Proprietário - Anunciar Imóvel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Por que Escolher a <span className="text-secondary">Fushub?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Mais de 50.000 estudantes e 5.000 proprietários já confiam na nossa plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="inline-flex p-4 rounded-2xl bg-secondary/10 mb-4">
                      <IconComponent className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-in">
                <div className="text-4xl font-bold text-secondary mb-2">50k+</div>
                <div className="text-muted-foreground">Estudantes Ativos</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="text-4xl font-bold text-accent mb-2">5k+</div>
                <div className="text-muted-foreground">Imóveis Disponíveis</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-4xl font-bold text-secondary mb-2">200+</div>
                <div className="text-muted-foreground">Cidades Atendidas</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="text-4xl font-bold text-accent mb-2">98%</div>
                <div className="text-muted-foreground">Satisfação</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Junte-se a milhares de estudantes e proprietários que já 
              encontraram a solução perfeita para moradia estudantil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="xl">
                Cadastrar Grátis
              </Button>
              <Button variant="nav" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Fazer Tour Virtual
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;