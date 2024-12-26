import { BadgeCheck, Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Database } from '@/types/database';

type UsherProfile = Database['public']['Tables']['usher_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

interface UsherCardProps {
  usher: UsherProfile;
}

export function UsherCard({ usher }: UsherCardProps) {
  const initials = usher.profiles.full_name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={usher.profiles.avatar_url || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="flex items-center">
              {usher.profiles.full_name}
              {usher.rating >= 4.5 && (
                <BadgeCheck className="ml-2 h-4 w-4 text-primary" />
              )}
            </CardTitle>
            <CardDescription>{usher.specialty}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4 text-yellow-500" />
            <span>{usher.rating.toFixed(1)} / 5.0</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {usher.experience_years} years of experience
          </div>
          <div className="font-semibold">
            ${usher.hourly_rate.toFixed(2)}/hour
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Contact Usher</Button>
      </CardFooter>
    </Card>
  );
}