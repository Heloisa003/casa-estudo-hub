import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Plus,
  LayoutGrid,
  TrendingUp,
  MessageCircle,
  FileText,
  Eye,
  DollarSign,
  Users,
  Calendar
} from "lucide-react";

const PropertyManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const managementOptions = [
    {
      id: "add",
      title: "Adicionar Novo Imóvel",
      description: "Cadastre uma nova propriedade para alugar",
      icon: Plus,
      color: "from-secondary/20 to-secondary/5",
      iconColor: "text-secondary",
      borderColor: "border-secondary/20",
      action: () => {
        navigate("/add-property");
      }
    },
    {
      id: "manage",
      title: "Gerenciar Meus Imóveis",
      description: "Visualize, edite ou remova suas propriedades",
      icon: LayoutGrid,
      color: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
      borderColor: "border-accent/20",
      action: () => {
        navigate("/dashboard");
      }
    },
    {
      id: "stats",
      title: "Estatísticas e Status",
      description: "Acompanhe o desempenho dos seus imóveis",
      icon: TrendingUp,
      color: "from-green-500/20 to-green-500/5",
      iconColor: "text-green-600",
      borderColor: "border-green-500/20",
      action: () => {
        navigate("/dashboard");
      }
    },
    {
      id: "messages",
      title: "Mensagens de Interessados",
      description: "Responda às dúvidas e agendamentos",
      icon: MessageCircle,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500/20",
      action: () => {
        navigate("/dashboard");
      }
    }
  ];

  const quickStats = [
    {
      label: "Imóveis Ativos",
      value: "6",
      icon: Home,
      color: "text-secondary"
    },
    {
      label: "Visualizações",
      value: "1,234",
      icon: Eye,
      color: "text-accent"
    },
    {
      label: "Receita Mensal",
      value: "R$ 9,6k",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      label: "Taxa de Ocupação",
      value: "87%",
      icon: Users,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Painel de Gerenciamento
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Gerencie seus imóveis, acompanhe estatísticas e interaja com potenciais inquilinos de forma simples e organizada.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {quickStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Management Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {managementOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer hover:shadow-medium transition-all duration-300 bg-gradient-to-br ${option.color} ${option.borderColor} hover:scale-105`}
                onClick={option.action}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-background/50`}>
                      <option.icon className={`w-8 h-8 ${option.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
                      <CardDescription className="text-base">
                        {option.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Additional Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                Outras Ações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                  <FileText className="w-5 h-5 mb-2 text-accent" />
                  <span className="font-semibold">Criar Contrato</span>
                  <span className="text-xs text-muted-foreground mt-1">Formalize um novo aluguel</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                  <TrendingUp className="w-5 h-5 mb-2 text-green-600" />
                  <span className="font-semibold">Relatórios Detalhados</span>
                  <span className="text-xs text-muted-foreground mt-1">Análise de desempenho completa</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                  <Users className="w-5 h-5 mb-2 text-blue-600" />
                  <span className="font-semibold">Gerenciar Inquilinos</span>
                  <span className="text-xs text-muted-foreground mt-1">Visualize seus contratos ativos</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PropertyManagement;
