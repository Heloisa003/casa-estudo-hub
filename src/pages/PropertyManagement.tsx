import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { ConversationsList } from "@/components/ConversationsList";
import { ChatMessages } from "@/components/ChatMessages";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  Calendar,
  Edit,
  Trash2,
  Star,
  MapPin,
  Settings,
  Zap,
  BarChart3,
  PauseCircle,
  PlayCircle
} from "lucide-react";

const PropertyManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("properties");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadProfile();
    loadProperties();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    setProfile(data);
  };

  const loadProperties = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProperties(data);
    }
    setLoading(false);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Imóvel excluído",
        description: "O imóvel foi removido com sucesso",
      });
      loadProperties();
    }
  };

  const handleToggleAvailability = async (propertyId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('properties')
      .update({ is_available: !currentStatus })
      .eq('id', propertyId);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status atualizado",
        description: `Imóvel ${!currentStatus ? 'ativado' : 'pausado'} com sucesso`,
      });
      loadProperties();
    }
  };

  const activeProperties = properties.filter(p => p.is_available);
  const totalRevenue = properties.reduce((sum, p) => sum + (p.is_available ? Number(p.price) : 0), 0);
  const occupancyRate = properties.length > 0 
    ? Math.round((activeProperties.length / properties.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="w-16 h-16">
                <AvatarFallback>
                  {(profile?.full_name || user?.email || 'P')
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Painel do Proprietário
                </h1>
                <p className="text-muted-foreground">
                  {profile?.full_name || user?.email}
                </p>
              </div>
            </div>
            
            <Button variant="cta" onClick={() => navigate("/add-property")}>
              <Plus className="w-4 h-4" />
              Cadastrar Imóvel
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Imóveis</p>
                    <p className="text-3xl font-bold text-secondary">{properties.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeProperties.length} ativos
                    </p>
                  </div>
                  <Home className="w-10 h-10 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visualizações</p>
                    <p className="text-3xl font-bold text-accent">1,234</p>
                    <p className="text-xs text-green-600 mt-1">↑ 12% este mês</p>
                  </div>
                  <Eye className="w-10 h-10 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Potencial</p>
                    <p className="text-3xl font-bold text-green-600">
                      R$ {totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">por mês</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Ocupação</p>
                    <p className="text-3xl font-bold text-blue-600">{occupancyRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeProperties.length} de {properties.length}
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="properties">
                <Home className="w-4 h-4 mr-2" />
                Meus Imóveis
              </TabsTrigger>
              <TabsTrigger value="promotions">
                <Zap className="w-4 h-4 mr-2" />
                Promoções
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageCircle className="w-4 h-4 mr-2" />
                Mensagens
              </TabsTrigger>
              <TabsTrigger value="statistics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Estatísticas
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Meus Imóveis Tab */}
            <TabsContent value="properties" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Minhas Propriedades</h2>
                <Button variant="cta" onClick={() => navigate("/add-property")}>
                  <Plus className="w-4 h-4" />
                  Adicionar Propriedade
                </Button>
              </div>

              {loading ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Carregando imóveis...</p>
                </Card>
              ) : properties.length === 0 ? (
                <Card className="text-center p-12">
                  <div className="flex flex-col items-center space-y-4">
                    <Home className="w-16 h-16 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Nenhum imóvel cadastrado</h3>
                      <p className="text-muted-foreground mb-4">
                        Comece cadastrando seu primeiro imóvel!
                      </p>
                      <Button variant="cta" onClick={() => navigate("/add-property")}>
                        <Plus className="w-4 h-4" />
                        Cadastrar Primeiro Imóvel
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <Card key={property.id} className="hover:shadow-medium transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <img
                            src={property.images?.[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{property.title}</h3>
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {property.address}, {property.neighborhood} - {property.city}/{property.state}
                                </div>
                              </div>
                              <Badge variant={property.is_available ? 'default' : 'secondary'}>
                                {property.is_available ? 'Ativo' : 'Pausado'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-xl font-bold text-secondary">
                                R$ {Number(property.price).toLocaleString()}
                                <span className="text-sm text-muted-foreground font-normal">/mês</span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div>{property.bedrooms} quartos</div>
                                <div>{property.bathrooms} banheiros</div>
                                <div>{property.max_occupants} pessoas</div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/property/${property.id}`}>
                                  <Eye className="w-4 h-4" />
                                  Ver
                                </a>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleToggleAvailability(property.id, property.is_available)}
                              >
                                {property.is_available ? (
                                  <>
                                    <PauseCircle className="w-4 h-4" />
                                    Pausar
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="w-4 h-4" />
                                    Ativar
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteProperty(property.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Promoções Tab */}
            <TabsContent value="promotions" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Promoções e Destaques</h2>
                <p className="text-muted-foreground mb-6">
                  Destaque seus imóveis e aumente a visibilidade
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2 border-accent/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Zap className="w-8 h-8 text-accent" />
                      <Badge variant="secondary">Popular</Badge>
                    </div>
                    <CardTitle className="mt-4">Destaque Básico</CardTitle>
                    <CardDescription>
                      Seu imóvel aparece em destaque por 7 dias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">
                      R$ 49<span className="text-sm font-normal text-muted-foreground">/7 dias</span>
                    </div>
                    <ul className="space-y-2 text-sm mb-6">
                      <li>✓ Posição de destaque na busca</li>
                      <li>✓ Badge "Em Destaque"</li>
                      <li>✓ +50% de visualizações</li>
                    </ul>
                    <Button variant="outline" className="w-full">
                      Contratar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-secondary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Star className="w-8 h-8 text-secondary" />
                      <Badge>Premium</Badge>
                    </div>
                    <CardTitle className="mt-4">Destaque Premium</CardTitle>
                    <CardDescription>
                      Máxima visibilidade por 30 dias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">
                      R$ 149<span className="text-sm font-normal text-muted-foreground">/30 dias</span>
                    </div>
                    <ul className="space-y-2 text-sm mb-6">
                      <li>✓ Topo da página inicial</li>
                      <li>✓ Badge "Premium"</li>
                      <li>✓ +150% de visualizações</li>
                      <li>✓ Suporte prioritário</li>
                    </ul>
                    <Button variant="default" className="w-full">
                      Contratar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="mt-4">Impulsionar</CardTitle>
                    <CardDescription>
                      Aumente o alcance temporariamente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">
                      R$ 19<span className="text-sm font-normal text-muted-foreground">/dia</span>
                    </div>
                    <ul className="space-y-2 text-sm mb-6">
                      <li>✓ Posição elevada por 24h</li>
                      <li>✓ Notificação para usuários</li>
                      <li>✓ +30% de alcance</li>
                    </ul>
                    <Button variant="outline" className="w-full">
                      Impulsionar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Mensagens Tab */}
            <TabsContent value="messages" className="space-y-4">
              <Card className="h-[600px]">
                <CardContent className="p-0 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    <div className="border-r overflow-y-auto">
                      <ConversationsList
                        onSelectConversation={setSelectedConversationId}
                        selectedConversationId={selectedConversationId}
                      />
                    </div>
                    <div className="col-span-2">
                      {selectedConversationId ? (
                        <ChatMessages conversationId={selectedConversationId} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Selecione uma conversa para começar
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Estatísticas Tab */}
            <TabsContent value="statistics" className="space-y-6">
              <h2 className="text-xl font-semibold">Estatísticas e Desempenho</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Visualizações por Período</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Gráfico de visualizações (em desenvolvimento)
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Taxa de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Métricas de conversão (em desenvolvimento)
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Imóveis Mais Visualizados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {properties.slice(0, 3).map((property, index) => (
                        <div key={property.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="font-bold text-2xl text-muted-foreground">
                              #{index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{property.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {Math.floor(Math.random() * 500 + 100)} visualizações
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {properties.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          Cadastre imóveis para ver estatísticas
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Taxa de Resposta</span>
                        <span className="text-sm font-bold">87%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Satisfação</span>
                        <span className="text-sm font-bold">4.8/5.0</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Taxa de Ocupação</span>
                        <span className="text-sm font-bold">{occupancyRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: `${occupancyRate}%` }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Configurações Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Configurações da Conta</h2>
              <ProfileEditForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default PropertyManagement;
