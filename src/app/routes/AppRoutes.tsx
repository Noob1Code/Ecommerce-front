import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '../../shared/components/layout';
import { Spinner } from '../../shared/components/ui';

// Lazy loading features for performance optimization
const ProductGrid = lazy(() => import('../../features/products').then(module => ({ default: module.ProductGrid })));
const ProductDetail = lazy(() => import('../../features/products').then(module => ({ default: module.ProductDetail })));
const Cart = lazy(() => import('../../features/cart').then(module => ({ default: module.Cart })));
const Checkout = lazy(() => import('../../features/checkout').then(module => ({ default: module.Checkout })));
const Login = lazy(() => import('../../features/auth').then(module => ({ default: module.Login })));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Spinner />}>
            <ProductGrid />
          </Suspense>
        ),
      },
      {
        path: 'product/:id',
        element: (
          <Suspense fallback={<Spinner />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<Spinner />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<Spinner />}>
            <Checkout />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<Spinner />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};