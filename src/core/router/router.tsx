import { env } from '@local/core/envs';
import { LayoutErrorRouter } from '@local/layouts/layout-error';
import { LayoutRoot } from '@local/layouts/layout-root';
import { PageHome } from '@local/pages/home';
import { PageProductsPagination } from '@local/pages/products-pagination';
import { PageProductsVirtual } from '@local/pages/products-virtual';

import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, createRoute, createRouter, Navigate } from '@tanstack/react-router';

import { validateLayoutRouteRootSearch } from './router.search';

export interface IContext {
  queryClient: QueryClient;
}

export const LayoutRouteRoot = createRootRouteWithContext<IContext>()({
  component: LayoutRoot,
  validateSearch: validateLayoutRouteRootSearch,
  errorComponent: LayoutErrorRouter,
  notFoundComponent: () => <Navigate to='/home' />,
});

export const PageRouteHome = createRoute({
  getParentRoute: () => LayoutRouteRoot,
  component: PageHome,
  path: '/home',
});

export const PageRouteIndex = createRoute({
  getParentRoute: () => LayoutRouteRoot,
  component: () => <Navigate to={PageRouteHome.fullPath} />,
  path: '/',
});

export const PageRouteProductsVirtual = createRoute({
  getParentRoute: () => LayoutRouteRoot,
  component: PageProductsVirtual,
  path: '/products-virtual',
});

export const PageRouteProductsPagination = createRoute({
  getParentRoute: () => LayoutRouteRoot,
  component: PageProductsPagination,
  path: '/products-pagination',
});

const routeTree = LayoutRouteRoot.addChildren({
  PageRouteHome,
  PageRouteIndex,
  PageRouteProductsPagination,
  PageRouteProductsVirtual,
});

export const router = createRouter({
  basepath: env.basePath,
  routeTree: routeTree,
  context: {
    queryClient: undefined!,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
