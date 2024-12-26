import { useEffect, useState } from 'react';
import { UsherCard } from '@/components/ushers/UsherCard';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type UsherProfile = Database['public']['Tables']['usher_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

export function FeaturedUshers() {
  const [ushers, setUshers] = useState<UsherProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedUshers() {
      const { data, error } = await supabase
        .from('usher_profiles')
        .select('*, profiles(*)')
        .eq('featured', true)
        .eq('available', true)
        .order('rating', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching featured ushers:', error);
        return;
      }

      setUshers(data);
      setLoading(false);
    }

    fetchFeaturedUshers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-12">Featured Ushers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ushers.map((usher) => (
            <UsherCard key={usher.id} usher={usher} />
          ))}
        </div>
      </div>
    </section>
  );
}