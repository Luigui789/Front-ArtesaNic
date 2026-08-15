import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { SessionProvider } from "@/hooks/use-session";
import { CurrencyProvider } from "@/hooks/use-currency";
import { NotificationsProvider } from "@/hooks/use-notifications";
import { Toaster } from "@/components/ui/sonner";
import { AppErrorBoundary } from "./error-boundary";
import { ScrollToTop } from "./scroll-to-top";
import { NotFound } from "./not-found";

import Index from "@/routes/index";
import Auth from "@/routes/auth";
import Catalogo from "@/routes/catalogo";
import Producto from "@/routes/producto.$id";
import Artesano from "@/routes/artesano.$id";
import Solicitar from "@/routes/solicitar.$productId";
import PedidosIndex from "@/routes/pedidos.index";
import PedidosDetalle from "@/routes/pedidos.$id";
import Mensajes from "@/routes/mensajes";
import PanelIndex from "@/routes/panel.index";
import PanelPerfil from "@/routes/panel.perfil";
import PanelProductos from "@/routes/panel.productos";
import PanelPedidosIndex from "@/routes/panel.pedidos.index";
import PanelPedidosDetalle from "@/routes/panel.pedidos.$id";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <CurrencyProvider>
          <NotificationsProvider>
            <BrowserRouter>
              <AppErrorBoundary>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/catalogo" element={<Catalogo />} />
                  <Route path="/producto/:id" element={<Producto />} />
                  <Route path="/artesano/:id" element={<Artesano />} />
                  <Route path="/solicitar/:productId" element={<Solicitar />} />
                  <Route path="/pedidos" element={<PedidosIndex />} />
                  <Route path="/pedidos/:id" element={<PedidosDetalle />} />
                  <Route path="/mensajes" element={<Mensajes />} />
                  <Route path="/panel" element={<PanelIndex />} />
                  <Route path="/panel/perfil" element={<PanelPerfil />} />
                  <Route path="/panel/productos" element={<PanelProductos />} />
                  <Route path="/panel/pedidos" element={<PanelPedidosIndex />} />
                  <Route path="/panel/pedidos/:id" element={<PanelPedidosDetalle />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppErrorBoundary>
            </BrowserRouter>
            <Toaster richColors position="top-center" />
          </NotificationsProvider>
        </CurrencyProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
