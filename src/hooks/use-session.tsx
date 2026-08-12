import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "@/types";
import { DEMO_ARTISAN_ID } from "@/services/mock-api";

export interface SesionUsuario {
  id: string;
  nombre: string;
  telefono: string;
  rol: Role;
  artesanoId?: string;
}

const COMPRADOR: SesionUsuario = {
  id: "user-comprador",
  nombre: "Ana Lucía Delgado",
  telefono: "8555 1234",
  rol: "comprador",
};

const ARTESANO: SesionUsuario = {
  id: "user-artesano",
  nombre: "Taller artesanal",
  telefono: "8777 9090",
  rol: "artesano",
  artesanoId: DEMO_ARTISAN_ID,
};

interface SessionContextValue {
  usuario: SesionUsuario | null;
  ingresar: (rol: Role, nombre?: string) => void;
  salir: () => void;
  cambiarRol: (rol: Role) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const KEY = "masaya.sesion";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null);

  // Se lee después de hidratar para evitar diferencias entre servidor y cliente.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setUsuario(raw ? (JSON.parse(raw) as SesionUsuario) : COMPRADOR);
    } catch {
      setUsuario(COMPRADOR);
    }
  }, []);

  const value = useMemo<SessionContextValue>(() => {
    const persist = (u: SesionUsuario | null) => {
      setUsuario(u);
      try {
        if (u) localStorage.setItem(KEY, JSON.stringify(u));
        else localStorage.removeItem(KEY);
      } catch {
        /* almacenamiento no disponible */
      }
    };
    return {
      usuario,
      ingresar: (rol, nombre) => {
        const base = rol === "artesano" ? ARTESANO : COMPRADOR;
        persist(nombre ? { ...base, nombre } : base);
      },
      salir: () => persist(null),
      cambiarRol: (rol) => persist(rol === "artesano" ? ARTESANO : COMPRADOR),
    };
  }, [usuario]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession debe usarse dentro de SessionProvider");
  return ctx;
}
