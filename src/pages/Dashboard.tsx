import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { 
  Home, Heart, MessageCircle, FileText, Star, 
  Plus, Eye, Edit, Trash2, Users, Calendar,
  TrendingUp, DollarSign, MapPin, Bell
} from "lucide-react";
import studentRoom1 from "@/assets/student-room-1.jpg";
import studentRoom2 from "@/assets/student-room-2.jpg";

const Dashboard = () => {
  const [userType] = useState<'student' | 'owner'>('student'); // Simulating user type

  const favoriteProperties = [
    {
      id: "1",
      title: "Quarto Moderno - Vila Universitária",
      location: "2,5km da USP - São Paulo",
      price: 1200,
      image: studentRoom1,
      status: "Disponível"
    },
    {
      id: "2",
      title: "República Aconchegante",
      location: "1,8km da UNICAMP - Campinas",
      price: 850,
      image: studentRoom2,
      status: "Ocupado"
    },
  ];

  const myProperties = [
    {
      id: "1",
      title: "Quarto Moderno - Vila Universitária",
      location: "Vila Madalena, São Paulo",
      price: 1200,
      image: studentRoom1,
      status: "Ativo",
      views: 145,
      inquiries: 8,
      rating: 4.8
    },
    {
      id: "2",
      title: "Casa Estudantil Completa",
      location: "Butantã, São Paulo",
      price: 980,
      image: studentRoom2,
      status: "Pausado",
      views: 89,
      inquiries: 3,
      rating: 4.6
    },
  ];

  const messages = [
    {
      id: "1",
      name: "Maria Santos",
      message: "Olá! Gostaria de agendar uma visita para o quarto...",
      time: "2 min",
      unread: true,
      avatar: "/placeholder.svg"
    },
    {
      id: "2",
      name: "João Silva",
      message: "Obrigado pela resposta! Quando posso ir ver?",
      time: "1h",
      unread: true,
      avatar: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Ana Costa",
      message: "Perfeito! Nos vemos amanhã então.",
      time: "1 dia",
      unread: false,
      avatar: "/placeholder.svg"
    },
  ];

  const contracts = [
    {
      id: "1",
      property: "Quarto Moderno - Vila Universitária",
      tenant: "Carlos Santos",
      startDate: "01/01/2024",
      endDate: "31/12/2024",
      status: "Ativo",
      value: 1200
    },
    {
      id: "2",
      property: "Casa Estudantil Completa",
      tenant: "Ana Silva",
      startDate: "15/02/2024",
      endDate: "15/02/2025",
      status: "Pendente",
      value: 980
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="w-16 h-16">
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Olá, João Silva!
                </h1>
                <p className="text-muted-foreground">
                  {userType === 'student' ? 'Estudante de Engenharia - USP' : 'Proprietário'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-muted-foreground">(12 avaliações)</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline">
                <Bell className="w-4 h-4" />
                Notificações
              </Button>
              <Button variant="cta">
                <Plus className="w-4 h-4" />
                {userType === 'student' ? 'Criar Alerta' : 'Novo Anúncio'}
              </Button>
            </div>
          </div>

          {/* Stats Cards for Owner */}
          {userType === 'owner' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Propriedades</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Home className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Visualizações</p>
                      <p className="text-2xl font-bold">1,234</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Receita Mensal</p>
                      <p className="text-2xl font-bold">R$ 9,6k</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa Ocupação</p>
                      <p className="text-2xl font-bold">87%</p>
                    </div>
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue={userType === 'student' ? "favorites" : "properties"} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value={userType === 'student' ? "favorites" : "properties"}>
                    {userType === 'student' ? 'Favoritos' : 'Propriedades'}
                  </TabsTrigger>
                  <TabsTrigger value="messages">Mensagens</TabsTrigger>
                  <TabsTrigger value="contracts">Contratos</TabsTrigger>
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                </TabsList>

                {/* Student Favorites / Owner Properties */}
                <TabsContent value={userType === 'student' ? "favorites" : "properties"} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {userType === 'student' ? 'Imóveis Favoritos' : 'Minhas Propriedades'}
                    </h2>
                    {userType === 'owner' && (
                      <Button variant="cta">
                        <Plus className="w-4 h-4" />
                        Adicionar Propriedade
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {(userType === 'student' ? favoriteProperties : myProperties).map((property) => (
                      <Card key={property.id} className="hover:shadow-medium transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex space-x-4">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{property.title}</h3>
                                  <div className="flex items-center text-muted-foreground text-sm">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {property.location}
                                  </div>
                                </div>
                                <Badge 
                                  variant={property.status === 'Ativo' || property.status === 'Disponível' ? 'default' : 'secondary'}
                                >
                                  {property.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-xl font-bold text-secondary">
                                  R$ {property.price.toLocaleString()}
                                  <span className="text-sm text-muted-foreground font-normal">/mês</span>
                                </div>
                                
                                {userType === 'owner' && (
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                      <Eye className="w-4 h-4 mr-1" />
                                      {(property as any).views} views
                                    </div>
                                    <div className="flex items-center">
                                      <MessageCircle className="w-4 h-4 mr-1" />
                                      {(property as any).inquiries} consultas
                                    </div>
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 mr-1 fill-accent text-accent" />
                                      {(property as any).rating}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex space-x-2 mt-4">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                  Ver
                                </Button>
                                {userType === 'owner' && (
                                  <>
                                    <Button variant="outline" size="sm">
                                      <Edit className="w-4 h-4" />
                                      Editar
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="w-4 h-4" />
                                      Excluir
                                    </Button>
                                  </>
                                )}
                                {userType === 'student' && (
                                  <Button variant="cta" size="sm">
                                    <MessageCircle className="w-4 h-4" />
                                    Contatar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Messages */}
                <TabsContent value="messages" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Mensagens</h2>
                    <Badge variant="secondary">3 não lidas</Badge>
                  </div>

                  <div className="space-y-4">
                    {messages.map((message) => (
                      <Card key={message.id} className={`cursor-pointer hover:shadow-medium transition-shadow ${message.unread ? 'border-secondary' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={message.avatar} />
                              <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-medium ${message.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {message.name}
                                </h3>
                                <span className="text-sm text-muted-foreground">{message.time}</span>
                              </div>
                              <p className={`text-sm ${message.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {message.message}
                              </p>
                            </div>
                            {message.unread && (
                              <div className="w-3 h-3 bg-secondary rounded-full" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Contracts */}
                <TabsContent value="contracts" className="space-y-6">
                  <h2 className="text-xl font-semibold">Contratos</h2>

                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <Card key={contract.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{contract.property}</h3>
                              <p className="text-muted-foreground">
                                {userType === 'student' ? 'Proprietário:' : 'Inquilino:'} {contract.tenant}
                              </p>
                            </div>
                            <Badge variant={contract.status === 'Ativo' ? 'default' : 'secondary'}>
                              {contract.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Início</p>
                              <p className="font-medium">{contract.startDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Fim</p>
                              <p className="font-medium">{contract.endDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Valor</p>
                              <p className="font-medium text-secondary">R$ {contract.value.toLocaleString()}/mês</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4" />
                              Ver Contrato
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="w-4 h-4" />
                              Mensagem
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Profile */}
                <TabsContent value="profile" className="space-y-6">
                  <h2 className="text-xl font-semibold">Meu Perfil</h2>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-20 h-20">
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-semibold">João Silva</h3>
                            <p className="text-muted-foreground">
                              {userType === 'student' ? 'Estudante de Engenharia' : 'Proprietário'}
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Alterar foto
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <p className="text-muted-foreground">joao.silva@email.com</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Telefone</label>
                            <p className="text-muted-foreground">(11) 99999-9999</p>
                          </div>
                          {userType === 'student' && (
                            <div>
                              <label className="text-sm font-medium">Universidade</label>
                              <p className="text-muted-foreground">Universidade de São Paulo</p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium">Membro desde</label>
                            <p className="text-muted-foreground">Janeiro 2024</p>
                          </div>
                        </div>
                        
                        <Button variant="cta">
                          Editar Perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    {userType === 'student' ? 'Criar Alerta de Busca' : 'Adicionar Propriedade'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ver Todas as Mensagens
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Avaliar Experiências
                  </Button>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <div className="text-sm">
                      <p className="font-medium">Nova mensagem de Maria Santos</p>
                      <p className="text-muted-foreground">2 minutos atrás</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <div className="text-sm">
                      <p className="font-medium">Propriedade favoritada</p>
                      <p className="text-muted-foreground">1 hora atrás</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <div className="text-sm">
                      <p className="font-medium">Perfil visualizado 5 vezes</p>
                      <p className="text-muted-foreground">Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;