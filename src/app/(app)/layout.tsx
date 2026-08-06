import { SiteNavbar } from "@/components/app-shell/site-navbar";
import { SiteFooter } from "@/components/app-shell/site-footer";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
