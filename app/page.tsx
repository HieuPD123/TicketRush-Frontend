import HeroSlider from "@/components/homepage/home/hero-slider";
import ScheduleList from "@/components/homepage/home/schedule-list";
import TrendingNow from "@/components/homepage/home/trending-now";

export default function Home() {
  return (
    <div>
      <HeroSlider/>
      <TrendingNow/>
      <ScheduleList/>
    </div>
  );
}
