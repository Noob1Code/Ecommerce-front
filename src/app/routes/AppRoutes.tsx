import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout, ErrorBoundary } from '../layout';
import { Spinner } from '../../shared/components/ui';
import { RoleGuard, useAuthStore } from '../../features/auth';

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Spinner className="h-10 w-10 text-blue-600" />
  </div>
);

const GuardaVisitante = ({ children }: { children: React.ReactNode }) => {
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  if (estaAutenticado) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const ProductGrid = lazy(() => import('../../features/products').then(m => ({ default: m.ProductGrid })));
const ProductDetail = lazy(() => import('../../features/products').then(m => ({ default: m.ProductDetail })));
const ProductBackoffice = lazy(() => import('../../features/products').then(m => ({ default: m.ProductBackoffice })));
const Cart = lazy(() => import('../../features/cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('../../features/checkout').then(m => ({ default: m.Checkout })));
const Login = lazy(() => import('../../features/auth').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../../features/auth').then(m => ({ default: m.Register })));
const EmployeeRegister = lazy(() => import('../../features/auth').then(m => ({ default: m.EmployeeRegister })));
const CustomerProfile = lazy(() => import('../../features/customer').then(m => ({ default: m.CustomerProfile })));
const CustomerOrders = lazy(() => import('../../features/customer').then(m => ({ default: m.CustomerOrders })));

const PainelEntregaMock = () => (
  <div className="mx-auto max-w-7xl px-4 py-12"><h1 className="text-2xl font-bold">Módulo de Entregas</h1></div>
);

const PainelFaturamentoMock = () => (
  <div className="mx-auto max-w-7xl px-4 py-12"><h1 className="text-2xl font-bold">Módulo Financeiro</h1></div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: 'minha-conta',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <CustomerProfile />
          </Suspense>
        )
      },
      {
        path: 'meus-pedidos',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <CustomerOrders />
          </Suspense>
        )
      },
      {
        index: true,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <ProductGrid />
          </Suspense>
        ),
      },
      {
        path: 'product/:id',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <Checkout />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <GuardaVisitante>
              <Login />
            </GuardaVisitante>
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <GuardaVisitante>
              <Register />
            </GuardaVisitante>
          </Suspense>
        ),
      },
      {
        path: 'backoffice',
        element: (
          <Suspense fallback={<RouteFallback />}>
            {/* CORREÇÃO: Apenas ADMIN e ESTOQUE entram no Backoffice de Produtos */}
            <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']} fallback={<Navigate to="/" replace />}>
              <ProductBackoffice />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: 'backoffice/funcionarios',
        element: (
          <Suspense fallback={<RouteFallback />}>
            {/* CORREÇÃO DO ERRO DA URL: Se o cacatua tentar forçar a URL, ele é ejetado de volta para o /backoffice de produtos */}
            <RoleGuard allowedRoles={['ROLE_ADMIN']} fallback={<Navigate to="/backoffice" replace />}>
              <EmployeeRegister />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: 'backoffice/entregas',
        element: (
          <Suspense fallback={<RouteFallback />}>
            {/* CORREÇÃO DAS OUTRAS ROLES: Travado rigidamente apenas para ADMIN e ENTREGA */}
            <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_ENTREGA']} fallback={<Navigate to="/" replace />}>
              <PainelEntregaMock />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: 'backoffice/faturamento',
        element: (
          <Suspense fallback={<RouteFallback />}>
            {/* CORREÇÃO DAS OUTRAS ROLES: Travado rigidamente apenas para ADMIN e FATURAMENTO */}
            <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_FATURAMENTO']} fallback={<Navigate to="/" replace />}>
              <PainelFaturamentoMock />
            </RoleGuard>
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};