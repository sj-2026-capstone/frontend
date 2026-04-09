import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />
      <main className="md:ml-64 min-h-screen">
        <Header />
        <section className="pt-24 px-4 md:px-8 pb-28 md:pb-12">
          <Outlet />
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
