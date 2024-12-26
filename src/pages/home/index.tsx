import { Hero } from './Hero';
import { FeaturedEvents } from './FeaturedEvents';
import { FeaturedUshers } from './FeaturedUshers';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedEvents />
      <FeaturedUshers />
    </div>
  );
}