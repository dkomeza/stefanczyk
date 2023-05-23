import { MainFeed, SuggestedProfiles } from "@/components/home";

import "@assets/styles/pages/app/home.scss";

function Home() {
  return (
    <div className="home">
      <div className="home_feed">
        <MainFeed />
      </div>
      <aside>
        <SuggestedProfiles />
      </aside>
    </div>
  );
}

export default Home;
