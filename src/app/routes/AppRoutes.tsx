import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout, ErrorBoundary } from '../../shared/components/layout';
import { Spinner } from '../../shared/components/ui';

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
            <ProductBackoffice />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};