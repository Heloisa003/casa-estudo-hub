import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar favoritos do usuário
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('property_id')
          .eq('user_id', user.id);

        if (error) throw error;
        setFavorites(data.map((fav) => fav.property_id));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar propriedades",
        variant: "destructive"
      });
      return false;
    }

    const isFavorited = favorites.includes(propertyId);

    try {
      if (isFavorited) {
        // Remover dos favoritos
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;

        setFavorites(favorites.filter(id => id !== propertyId));
        toast({
          title: "Removido dos favoritos",
          description: "Propriedade removida da sua lista",
        });
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            property_id: propertyId
          });

        if (error) throw error;

        setFavorites([...favorites, propertyId]);
        toast({
          title: "❤️ Adicionado aos favoritos!",
          description: "Você pode ver seus favoritos no seu perfil",
        });
      }
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive"
      });
      return false;
    }
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite
  };
};
