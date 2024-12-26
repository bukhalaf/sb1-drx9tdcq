import { useEffect, useState } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Event = Database['public']['Tables']['events']['Row'];

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('featured', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching featured events:', error);
        return;
      }

      setEvents(data);
      setLoading(false);
    }

    fetchFeaturedEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-12">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}