import { Route, Routes } from "react-router-dom";

import { Home } from "@pages/app";
import { Navbar } from "@/layouts";

function Router() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}

export default Router;
