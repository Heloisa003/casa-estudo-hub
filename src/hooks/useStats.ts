import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  students: string;
  properties: string;
  cities: string;
  loading: boolean;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M+`;
  }
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}k+`;
  }
  return `${num}+`;
};

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    students: '0',
    properties: '0',
    cities: '0',
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total de estudantes ativos
        const { count: studentsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'student');

        // Total de imóveis disponíveis
        const { count: propertiesCount } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('is_available', true);

        // Total de cidades atendidas (distinct)
        const { data: citiesData } = await supabase
          .from('properties')
          .select('city')
          .eq('is_available', true);

        const uniqueCities = new Set(citiesData?.map(p => p.city) || []);

        setStats({
          students: formatNumber(studentsCount || 0),
          properties: formatNumber(propertiesCount || 0),
          cities: formatNumber(uniqueCities.size || 0),
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          students: '0',
          properties: '0',
          cities: '0',
          loading: false,
        });
      }
    };

    fetchStats();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return stats;
};
