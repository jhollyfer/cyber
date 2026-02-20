import {
  Navigate,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router';

import { AppSidebar } from '@/components/common/app-sidebar';
import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import RouteError from '@/components/common/route-error';
import RoutePending from '@/components/common/route-pending';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/authentication';

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
  pendingComponent: RoutePending,
  errorComponent: RouteError,
  ssr: false,
});

function PrivateLayout(): React.ReactElement | null {
  const { hasHydrated, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!hasHydrated) return null;
  if (!isAuthenticated) return <Navigate to="/sign-in" />;

  // Game and Result are immersive - no sidebar
  const isImmersive =
    location.pathname.startsWith('/game/') ||
    location.pathname.startsWith('/result/');

  if (isImmersive) return <Outlet />;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <PageBreadcrumb />
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
