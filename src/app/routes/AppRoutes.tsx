import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout, ErrorBoundary } from '../layout';
import { Spinner } from '../../shared/components/ui';
import { RoleGuard } from '../../features/auth';

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Spinner className="h-10 w-10 text-blue-600" />
  </div>
);

const ProductGrid = lazy(() => import('../../features/products').then(module => ({ default: module.ProductGrid })));
const ProductDetail = lazy(() => import('../../features/products').then(module => ({ default: module.ProductDetail })));
const ProductBackoffice = lazy(() => import('../../features/products').then(module => ({ default: module.ProductBackoffice })));
const Cart = lazy(() => import('../../features/cart').then(module => ({ default: module.Cart })));
const Checkout = lazy(() => import('../../features/checkout').then(module => ({ default: module.Checkout })));
const Login = lazy(() => import('../../features/auth').then(module => ({ default: module.Login })));
const Register = lazy(() => import('../../features/auth').then(module => ({ default: module.Register })));

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
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'backoffice',
        element: (
          <Suspense fallback={<RouteFallback />}>
            {/* Blindagem estrutural de rota: impede o carregamento do bundle caso o usuário não tenha privilégios */}
            <RoleGuard 
              allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']}
              fallback={
                <div className="mx-auto max-w-xl px-4 py-16 text-center">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-red-700 mb-2">Acesso Negado</h2>
                    <p className="text-sm text-red-600 mb-6">
                      Sua conta ativa não possui privilégios operacionais para acessar este nó do sistema.
                    </p>
                    <button 
                      type="button"
                      onClick={() => window.location.assign('/')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Voltar para a Página Inicial
                    </button>
                  </div>
                </div>
              }
            >
              <ProductBackoffice />
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