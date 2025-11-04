import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Conversation {
  id: string;
  property_id: string;
  tenant_id: string;
  owner_id: string;
  updated_at: string;
  property: {
    title: string;
    images: string[];
  } | null;
  tenant_profile: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  owner_profile: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  last_message: {
    content: string;
    is_read: boolean;
    sender_id: string;
  } | null;
}

interface ConversationsListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

export const ConversationsList = ({ onSelectConversation, selectedConversationId }: ConversationsListProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    const { data: conversationsData, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`tenant_id.eq.${user.id},owner_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading conversations:", error);
      return;
    }

    // Load additional data for each conversation
    const conversationsWithDetails = await Promise.all(
      (conversationsData || []).map(async (conv) => {
        // Load property details
        const { data: property } = await supabase
          .from("properties")
          .select("title, images")
          .eq("id", conv.property_id)
          .single();

        // Load tenant profile
        const { data: tenantProfile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", conv.tenant_id)
          .single();

        // Load owner profile
        const { data: ownerProfile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", conv.owner_id)
          .single();

        // Load last message
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("content, is_read, sender_id")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return {
          ...conv,
          property,
          tenant_profile: tenantProfile,
          owner_profile: ownerProfile,
          last_message: lastMessage,
        };
      })
    );

    setConversations(conversationsWithDetails);
    setLoading(false);
  };

  if (loading) {
    return <div className="p-4">Carregando conversas...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Nenhuma conversa ainda
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {conversations.map((conversation) => {
        if (!conversation.property || !conversation.tenant_profile || !conversation.owner_profile) {
          return null;
        }

        const isOwner = conversation.owner_id === user?.id;
        const otherUser = isOwner ? conversation.tenant_profile : conversation.owner_profile;
        const hasUnread = conversation.last_message && 
          !conversation.last_message.is_read && 
          conversation.last_message.sender_id !== user?.id;

        return (
          <Card
            key={conversation.id}
            className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
              selectedConversationId === conversation.id ? "bg-accent" : ""
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={otherUser.avatar_url || undefined} />
                <AvatarFallback>
                  {otherUser.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold truncate">{otherUser.full_name}</h3>
                  {hasUnread && <Badge variant="default" className="ml-2">Nova</Badge>}
                </div>
                
                <p className="text-sm text-muted-foreground truncate mb-1">
                  {conversation.property.title}
                </p>
                
                {conversation.last_message && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message.content}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(conversation.updated_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
