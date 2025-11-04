import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UnreadMessage {
  id: string;
  content: string;
  created_at: string;
  conversation_id: string;
  sender: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  conversation: {
    property: {
      title: string;
    } | null;
  } | null;
}

export const MessageNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    loadUnreadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("new-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          // Only show if message is not from current user
          if (payload.new.sender_id !== user.id) {
            loadUnreadMessages();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        () => {
          loadUnreadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadUnreadMessages = async () => {
    if (!user) return;

    // Get all conversations where user is involved
    const { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .or(`tenant_id.eq.${user.id},owner_id.eq.${user.id}`);

    if (!conversations) return;

    const conversationIds = conversations.map((c) => c.id);

    // Get unread messages from those conversations
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", conversationIds)
      .neq("sender_id", user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!messages) return;

    // Load additional details for each message
    const messagesWithDetails = await Promise.all(
      messages.map(async (msg) => {
        // Load sender profile
        const { data: sender } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", msg.sender_id)
          .single();

        // Load conversation and property details
        const { data: conversation } = await supabase
          .from("conversations")
          .select("property_id")
          .eq("id", msg.conversation_id)
          .single();

        let property = null;
        if (conversation) {
          const { data: propertyData } = await supabase
            .from("properties")
            .select("title")
            .eq("id", conversation.property_id)
            .single();
          property = propertyData;
        }

        return {
          ...msg,
          sender,
          conversation: {
            property,
          },
        };
      })
    );

    setUnreadMessages(messagesWithDetails);
    setUnreadCount(messages.length);
  };

  const handleMessageClick = async (conversationId: string) => {
    // Mark messages as read before navigating
    if (user) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
        .eq("is_read", false);
    }
    
    setOpen(false);
    // Navigate to property management with conversation ID as query param
    navigate(`/property-management?conversation=${conversationId}&tab=messages`);
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Mail className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Mensagens</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} não lida{unreadCount !== 1 ? "s" : ""}</Badge>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {unreadMessages.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma mensagem nova
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {unreadMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleMessageClick(message.conversation_id)}
                  className="w-full p-4 hover:bg-accent transition-colors text-left"
                >
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.sender?.avatar_url || undefined} />
                      <AvatarFallback>
                        {message.sender?.full_name.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm truncate">
                          {message.sender?.full_name || "Usuário"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      {message.conversation?.property && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {message.conversation.property.title}
                        </p>
                      )}

                      <p className="text-sm text-muted-foreground truncate">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {unreadMessages.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setOpen(false);
                navigate("/property-management?tab=messages");
              }}
            >
              Ver todas as mensagens
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
