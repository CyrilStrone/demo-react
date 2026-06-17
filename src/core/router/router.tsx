import { env } from '@local/core/envs';
import { LayoutErrorRouter } from '@local/layouts/layout-error';
import { LayoutPrivate } from '@local/layouts/layout-private';
import { LayoutPublic } from '@local/layouts/layout-public';
import { LayoutRoot } from '@local/layouts/layout-root';
import { PagePrivateHome } from '@local/pages/private/home';
import { PagePublicHome } from '@local/pages/public/home';

import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, createRoute, createRouter, Navigate, redirect } from '@tanstack/react-router';

import { validateLayoutRouteRootSearch } from './router.search';

export interface IContext {
  queryClient: QueryClient;
}

export const LayoutRouteRoot = createRootRouteWithContext<IContext>()({
  component: LayoutRoot,
  validateSearch: validateLayoutRouteRootSearch,
  errorComponent: LayoutErrorRouter,
  notFoundComponent: () => <Navigate to={LayoutRoutePublic.fullPath} />,
});

export const LayoutRoutePrivate = createRoute({
  getParentRoute: () => LayoutRouteRoot,
  component: LayoutPrivate,
  notFoundComponent: () => <Navigate to={PageRoutePrivateHome.fullPath} />,
  path: '/pr',
  beforeLoad: (props) => {
    const isFirst = props.location.pathname === '/pr';
    if (isFirst)
      throw redirect({
        to: '/pr/home',
      });
  },
});

export const LayoutRoutePublic = createRoute({
  getParentRoute: () => LayoutRouteRoot,
  component: LayoutPublic,
  notFoundComponent: () => <Navigate to={PageRoutePublicHome.fullPath} />,
  path: '/pu',
  beforeLoad: (props) => {
    const isFirst = props.location.pathname === '/pu';
    if (isFirst)
      throw redirect({
        to: '/pu/home',
      });
  },
});

export const PageRoutePrivateHome = createRoute({
  getParentRoute: () => LayoutRoutePrivate,
  component: PagePrivateHome,
  path: '/home',
});

export const PageRoutePublicHome = createRoute({
  getParentRoute: () => LayoutRoutePublic,
  component: PagePublicHome,
  path: '/home',
});

const routeTree = LayoutRouteRoot.addChildren({
  LayoutRoutePublic: LayoutRoutePublic.addChildren({
    PageRoutePublicHome,
  }),
  LayoutRoutePrivate: LayoutRoutePrivate.addChildren({
    PageRoutePrivateHome,
  }),
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
