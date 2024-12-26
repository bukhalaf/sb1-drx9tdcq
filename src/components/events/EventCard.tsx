import { CalendarDays, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Database } from '@/types/database';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            {format(new Date(event.date), 'PPP')}
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            {event.required_ushers} ushers needed
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}