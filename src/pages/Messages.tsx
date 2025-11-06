import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, MessageCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        handleSelectConversation(conv);
      }
    }
  }, [searchParams, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup realtime
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          loadConversations();
          if (selectedConversation) {
            loadMessages(selectedConversation.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

    const conversationsWithMessages = await Promise.all(
      conversationsData.map(async (conv) => {
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('is_read', false)
          .neq('sender_id', user.id);

        const isUserTenant = conv.tenant_id === user.id;
        const otherUser = isUserTenant ? conv.owner : conv.tenant;

        return {
          ...conv,
          propertyTitle: (conv.properties as any)?.title || 'Propriedade',
          propertyImage: (conv.properties as any)?.images?.[0],
          otherUserId: isUserTenant ? conv.owner_id : conv.tenant_id,
          otherUserName: (otherUser as any)?.full_name || 'Usuário',
          otherUserAvatar: (otherUser as any)?.avatar_url,
          lastMessage: lastMessage?.content || 'Sem mensagens',
          lastMessageTime: lastMessage?.created_at,
          unreadCount: unreadCount || 0,
        };
      })
    );

    setConversations(conversationsWithMessages);

    const totalUnread = conversationsWithMessages.reduce(
      (sum, conv) => sum + conv.unreadCount,
      0
    );
    setUnreadCount(totalUnread);
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .eq('is_read', false);

    loadConversations();
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    setIsSending(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage("");
      await loadMessages(selectedConversation.id);
      await loadConversations();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                  Mensagens
                </h1>
                <p className="text-muted-foreground">
                  Gerencie suas conversas com estudantes e proprietários
                </p>
              </div>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {conversations.length === 0 ? (
            <Card className="text-center p-12">
              <div className="flex flex-col items-center space-y-4">
                <MessageCircle className="w-20 h-20 text-muted-foreground" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Nenhuma conversa ainda</h3>
                  <p className="text-muted-foreground mb-6">
                    Suas conversas aparecerão aqui quando você entrar em contato com proprietários ou estudantes.
                  </p>
                  <Button variant="cta" asChild>
                    <a href="/search">Explorar Imóveis</a>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
              {/* Lista de Conversas */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Conversas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-360px)]">
                    <div className="space-y-2 p-4">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => handleSelectConversation(conversation)}
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation?.id === conversation.id
                              ? 'bg-secondary/20 border-2 border-secondary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar>
                              <AvatarImage src={conversation.otherUserAvatar} />
                              <AvatarFallback>
                                {conversation.otherUserName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold truncate">
                                  {conversation.otherUserName}
                                </h4>
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="secondary" className="ml-2">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-1 truncate">
                                {conversation.propertyTitle}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage}
                              </p>
                              {conversation.lastMessageTime && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(new Date(conversation.lastMessageTime), { 
                                    addSuffix: true,
                                    locale: ptBR 
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Área de Chat */}
              <Card className="lg:col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    <CardHeader className="border-b">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={selectedConversation.otherUserAvatar} />
                          <AvatarFallback>
                            {selectedConversation.otherUserName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{selectedConversation.otherUserName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedConversation.propertyTitle}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-4 overflow-hidden">
                      <ScrollArea className="h-[calc(100vh-480px)] pr-4">
                        <div className="space-y-4">
                          {messages.map((message) => {
                            const isOwnMessage = message.sender_id === user?.id;
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-lg p-3 ${
                                    isOwnMessage
                                      ? 'bg-secondary text-secondary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs mt-1 opacity-70">
                                    {formatDistanceToNow(new Date(message.created_at), { 
                                      addSuffix: true,
                                      locale: ptBR 
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                    </CardContent>

                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={isSending}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={isSending || !newMessage.trim()}
                          variant="cta"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Selecione uma conversa para começar</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
