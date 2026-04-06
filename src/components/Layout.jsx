import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Header />
        <section className="pt-24 px-8 pb-12">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
