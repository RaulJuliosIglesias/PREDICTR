# Predictr (Simulado)

Predictr es una simulación de plataforma de mercados de predicción en tiempo real, enfocada 100% en front-end para demostrar UI compleja, reactiva y de alto rendimiento.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (modo claro/oscuro)
- React Router v6
- TanStack Query (estado del servidor)
- Zustand (estado cliente: auth/tema)
- React Hook Form + Zod (formularios de trading)
- Recharts (gráfico de precios)
- Supabase Realtime (opcional/mocked)

## Ejecutar

```bash
npm install
npm run dev
```

## Estructura de carpetas

```
src/
  api/
  assets/
  components/
    core/
    ui/
  features/
    markets/
    trade/
    portfolio/
  hooks/
  lib/
  pages/
  store/
  types/
```

## Funcionalidad

- Feed de mercados con parpadeo verde/rojo en precios
- Detalle con gráfico en vivo (punto cada 5s)
- Trade Box con cálculos instantáneos (coste, payoff, impacto)
- Estado invitado vs demo (saldo: $5,000) y toasts (simples)
- Portafolio con posiciones abiertas e historial (simulado)
- A11y: navegación teclado, `aria-live` en precios/saldo

## Notas

- Supabase es opcional; por defecto todo corre con mocks en el front-end.
- Los estilos y componentes son intencionalmente ligeros para claridad.
