import { useEffect, useState } from 'react';
import { Color, Product } from '@/lib/api';

interface HomeData {
  featuredProducts: Product[];
  popularColors: Color[];
  isLoading: boolean;
  error: Error | null;
}

const fetchPopularColors = async (): Promise<Color[]> => {
  try {
    const response = await fetch('/api/colors');
    if (!response.ok) {
      throw new Error('Failed to fetch colors');
    }
    const data = await response.json();
    return data.data.colors;
  } catch (error) {
    console.error('Error fetching colors:', error);
    // Fallback colors in case of error
    return [
      {
        id: '1',
        name: 'Warm Grey',
        code: '#8B8680',
        imageUrl: '/colors/WarmGrey.png',
        isPopular: true,
        description: 'Signature Color'
      },
    ];
  }
};

export const useHomeData = (): HomeData => {
  const [homeData, setHomeData] = useState<HomeData>({
    featuredProducts: [],
    popularColors: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colors] = await Promise.all([
          fetchPopularColors(),
          // Add other API calls here when needed
        ]);

        setHomeData({
          featuredProducts: [],
          popularColors: colors,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching home page data:', err);
        setHomeData(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Failed to fetch home data'),
        }));
      }
    };

    fetchData();
  }, []);

  return homeData;
};
