import Footer from "@/components/shared/footer";
import Hero from "@/components/homepage/hero";
import NavBar from "@/components/shared/navbar";
import TrendingEventsSection from "@/features/events/components/trending-events-section";
import { getTrendingEvents } from "@/features/events/services/get-trending-events";

export default async function Home() {
  const events = await getTrendingEvents();

  return (
    <div className="min-h-dvh">
      <NavBar />
      <main className="pt-24">
        <Hero />
        <TrendingEventsSection events={events} />
      </main>
      <Footer />
    </div>
  );
}
