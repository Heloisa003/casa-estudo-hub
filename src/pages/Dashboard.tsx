import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import { 
  Home, Heart, MessageCircle, FileText, Star, 
  Plus, Eye, Edit, Trash2, Users, Calendar,
  TrendingUp, DollarSign, MapPin, Bell
} from "lucide-react";
import studentRoom1 from "@/assets/student-room-1.jpg";
import studentRoom2 from "@/assets/student-room-2.jpg";
import { mockProperties } from "@/data/mockProperties";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [profile, setProfile] = useState<any | null>(null);
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userType: 'student' | 'owner' = profile?.user_type === 'owner' ? 'owner' : 'student';

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data || null);
    };
    load();
  }, [user]);

  // Carregar conversas e mensagens
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;

      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select(`
          id,
          property_id,
          tenant_id,
          owner_id,
          updated_at,
          properties(title, images),
          tenant:profiles!conversations_tenant_id_fkey(full_name, avatar_url),
          owner:profiles!conversations_owner_id_fkey(full_name, avatar_url)
        `)
        .or(`tenant_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        return;
      }

      if (!conversationsData) {
        setConversations([]);
        return;
      }

      // Para cada conversa, buscar a última mensagem e contar não lidas
      const conversationsWithMessages = await Promise.all(
        conversationsData.map(async (conv) => {
          // Buscar última mensagem
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Contar mensagens não lidas (enviadas pelo outro usuário)
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          // Determinar qual é o outro usuário
          const isUserTenant = conv.tenant_id === user.id;
          const otherUser = isUserTenant ? conv.owner : conv.tenant;

          return {
            id: conv.id,
            propertyTitle: (conv.properties as any)?.title || 'Propriedade',
            propertyImage: (conv.properties as any)?.images?.[0],
            otherUserName: (otherUser as any)?.full_name || 'Usuário',
            otherUserAvatar: (otherUser as any)?.avatar_url,
            lastMessage: lastMessage?.content || 'Sem mensagens',
            lastMessageTime: lastMessage?.created_at,
            unreadCount: unreadCount || 0,
            isUnread: (unreadCount || 0) > 0,
          };
        })
      );

      setConversations(conversationsWithMessages);

      // Calcular total de mensagens não lidas
      const totalUnread = conversationsWithMessages.reduce(
        (sum, conv) => sum + conv.unreadCount,
        0
      );
      setUnreadCount(totalUnread);
    };

    loadConversations();

    // Configurar realtime para atualizar quando houver novas mensagens
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Carregar atividades recentes
  useEffect(() => {
    const loadRecentActivities = async () => {
      if (!user) return;

      const activities: any[] = [];

      // Buscar últimas mensagens recebidas
      const { data: recentMessages } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          profiles!messages_sender_id_fkey(full_name)
        `)
        .neq('sender_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentMessages) {
        recentMessages.forEach(msg => {
          activities.push({
            type: 'message',
            icon: MessageCircle,
            color: 'bg-secondary',
            title: `Nova mensagem de ${(msg.profiles as any)?.full_name || 'Usuário'}`,
            time: msg.created_at,
          });
        });
      }

      // Buscar últimos favoritos adicionados
      const { data: recentFavorites } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          properties(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentFavorites) {
        recentFavorites.forEach(fav => {
          activities.push({
            type: 'favorite',
            icon: Heart,
            color: 'bg-accent',
            title: `Favoritou: ${(fav.properties as any)?.title || 'Propriedade'}`,
            time: fav.created_at,
          });
        });
      }

      // Buscar últimas visualizações de propriedades (se for proprietário)
      if (userType === 'owner') {
        const { data: recentViews } = await supabase
          .from('property_views')
          .select(`
            id,
            created_at,
            properties!inner(owner_id, title)
          `)
          .eq('properties.owner_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentViews) {
          recentViews.forEach(view => {
            activities.push({
              type: 'view',
              icon: Eye,
              color: 'bg-blue-500',
              title: `Visualização em: ${(view.properties as any)?.title || 'Propriedade'}`,
              time: view.created_at,
            });
          });
        }
      }

      // Buscar últimas reservas
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          status,
          properties(title)
        `)
        .or(`tenant_id.eq.${user.id},properties.owner_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(2);

      if (recentBookings) {
        recentBookings.forEach(booking => {
          activities.push({
            type: 'booking',
            icon: Calendar,
            color: 'bg-green-500',
            title: `Reserva ${booking.status}: ${(booking.properties as any)?.title || 'Propriedade'}`,
            time: booking.created_at,
          });
        });
      }

      // Ordenar todas as atividades por data
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      // Limitar a 5 atividades mais recentes
      setRecentActivities(activities.slice(0, 5));
    };

    loadRecentActivities();
  }, [user, userType]);

  // Carregar propriedades favoritadas do banco de dados
  useEffect(() => {
    const loadFavoriteProperties = async () => {
      if (!user || favorites.length === 0) {
        setFavoriteProperties([]);
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('id', favorites);

      if (!error && data) {
        // Transformar dados para o formato esperado
        const transformedData = data.map(prop => ({
          id: prop.id,
          title: prop.title,
          location: `${prop.neighborhood}, ${prop.city}`,
          address: `${prop.address}, ${prop.neighborhood} - ${prop.city}/${prop.state}`,
          price: Number(prop.price),
          rating: 4.8,
          reviews: 0,
          image: prop.images?.[0] || "/placeholder.svg",
          images: prop.images,
          type: prop.property_type,
          roommates: prop.max_occupants - 1,
          amenities: prop.amenities || [],
          premium: prop.is_premium,
          is_available: prop.is_available,
          status: prop.is_available ? 'Disponível' : 'Ocupado',
          ...prop
        }));
        setFavoriteProperties(transformedData);
      }
    };

    loadFavoriteProperties();
  }, [user, favorites]);


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
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback>
                  {(profile?.full_name || user?.email || 'U')
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .slice(0,2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Olá, {profile?.full_name || user?.email || 'Usuário'}!
                </h1>
                <p className="text-muted-foreground">
                  {userType === 'student' ? (profile?.university || 'Estudante') : 'Painel do Proprietário'}
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
                {userType === 'student' ? 'Criar Alerta' : 'Cadastrar Imóvel'}
              </Button>
            </div>
          </div>

          {/* Owner Stats Dashboard */}
          {userType === 'owner' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Imóveis</p>
                        <p className="text-3xl font-bold text-secondary">8</p>
                        <p className="text-xs text-muted-foreground mt-1">6 ativos, 2 inativos</p>
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
                      <TrendingUp className="w-10 h-10 text-accent" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Receita Mensal</p>
                        <p className="text-3xl font-bold text-green-600">R$ 9,6k</p>
                        <p className="text-xs text-muted-foreground mt-1">6 contratos ativos</p>
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
                        <p className="text-3xl font-bold text-blue-600">87%</p>
                        <p className="text-xs text-muted-foreground mt-1">7 de 8 ocupados</p>
                      </div>
                      <Users className="w-10 h-10 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Owner Quick Actions */}
              <Card className="mb-8 border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary" />
                    Ações Rápidas - Proprietário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                      <Plus className="w-5 h-5 mb-2 text-secondary" />
                      <span className="font-semibold">Adicionar Propriedade</span>
                      <span className="text-xs text-muted-foreground mt-1">Cadastre um novo imóvel</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                      <FileText className="w-5 h-5 mb-2 text-accent" />
                      <span className="font-semibold">Criar Contrato</span>
                      <span className="text-xs text-muted-foreground mt-1">Formalize um novo aluguel</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                      <TrendingUp className="w-5 h-5 mb-2 text-green-600" />
                      <span className="font-semibold">Ver Relatórios</span>
                      <span className="text-xs text-muted-foreground mt-1">Análise de desempenho</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
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

                  {userType === 'student' && favoriteProperties.length === 0 ? (
                    <Card className="text-center p-12">
                      <div className="flex flex-col items-center space-y-4">
                        <Heart className="w-16 h-16 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
                          <p className="text-muted-foreground mb-4">
                            Comece a favoritar propriedades que você gosta!
                          </p>
                          <Button variant="cta" asChild>
                            <a href="/search">Explorar Imóveis</a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {(userType === 'student' ? favoriteProperties : myProperties).map((property) => (
                        <Card key={property.id} className="hover:shadow-medium transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex space-x-4">
                              <img
                                src={property.images?.[0] || property.image || studentRoom1}
                                alt={property.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">{property.title}</h3>
                                    <div className="flex items-center text-muted-foreground text-sm">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {property.address || property.location}
                                    </div>
                                  </div>
                                  <Badge 
                                    variant={(property.is_available || property.status === 'Ativo' || property.status === 'Disponível') ? 'default' : 'secondary'}
                                  >
                                    {property.is_available !== undefined ? (property.is_available ? 'Disponível' : 'Ocupado') : property.status}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="text-xl font-bold text-secondary">
                                    R$ {Number(property.price).toLocaleString()}
                                    <span className="text-sm text-muted-foreground font-normal">/mês</span>
                                  </div>
                                  
                                  {userType === 'owner' && (
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {(property as any).views || 0} views
                                      </div>
                                      <div className="flex items-center">
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        {(property as any).inquiries || 0} consultas
                                      </div>
                                      <div className="flex items-center">
                                        <Star className="w-4 h-4 mr-1 fill-accent text-accent" />
                                        {(property as any).rating || 4.8}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex space-x-2 mt-4">
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={`/property/${property.id}`}>
                                      <Eye className="w-4 h-4" />
                                      Ver
                                    </a>
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
                                    <>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={async () => {
                                          await toggleFavorite(property.id);
                                          // A lista será atualizada automaticamente pelo useEffect
                                        }}
                                        className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
                                      >
                                        <Heart className="w-4 h-4 fill-red-500 text-red-500 transition-transform hover:scale-110" />
                                        Remover dos Favoritos
                                      </Button>
                                      <Button variant="cta" size="sm">
                                        <MessageCircle className="w-4 h-4" />
                                        Contatar
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Messages */}
                <TabsContent value="messages" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Mensagens</h2>
                    {unreadCount > 0 && (
                      <Badge variant="secondary">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</Badge>
                    )}
                  </div>

                  {conversations.length === 0 ? (
                    <Card className="text-center p-12">
                      <div className="flex flex-col items-center space-y-4">
                        <MessageCircle className="w-16 h-16 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem ainda</h3>
                          <p className="text-muted-foreground mb-4">
                            Suas conversas aparecerão aqui quando você entrar em contato com proprietários ou estudantes.
                          </p>
                          <Button variant="cta" asChild>
                            <a href="/search">Explorar Imóveis</a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {conversations.map((conversation) => (
                        <Card 
                          key={conversation.id} 
                          className={`cursor-pointer hover:shadow-medium transition-shadow ${conversation.isUnread ? 'border-secondary' : ''}`}
                          onClick={() => window.location.href = `/dashboard?conversation=${conversation.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={conversation.otherUserAvatar} />
                                <AvatarFallback>
                                  {conversation.otherUserName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className={`font-medium truncate ${conversation.isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {conversation.otherUserName}
                                  </h3>
                                  {conversation.lastMessageTime && (
                                    <span className="text-sm text-muted-foreground flex-shrink-0 ml-2">
                                      {formatDistanceToNow(new Date(conversation.lastMessageTime), { 
                                        addSuffix: true,
                                        locale: ptBR 
                                      })}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-1 truncate">
                                  {conversation.propertyTitle}
                                </p>
                                <p className={`text-sm truncate ${conversation.isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                  {conversation.lastMessage}
                                </p>
                              </div>
                              {conversation.isUnread && (
                                <Badge variant="secondary" className="flex-shrink-0">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
                  <ProfileEditForm />
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
                  {recentActivities.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p className="text-sm">Nenhuma atividade recente</p>
                    </div>
                  ) : (
                    recentActivities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`} />
                          <div className="flex-1 text-sm">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium flex-1">{activity.title}</p>
                              <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </div>
                            <p className="text-muted-foreground">
                              {formatDistanceToNow(new Date(activity.time), { 
                                addSuffix: true,
                                locale: ptBR 
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
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