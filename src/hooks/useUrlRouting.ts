import { useCallback, useEffect, useState } from 'react';
import { ActiveTab, ReportViewMode } from '../types/finance';

export interface RouteState {
  tab: ActiveTab;
  reportMode?: ReportViewMode;
  transactionFilter?: string;
  searchQuery?: string;
}

export function useUrlRouting() {
  const parseCurrentUrl = useCallback((): RouteState => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const [pathPart, queryPart] = hash.split('?');
    const segments = (pathPart || 'dashboard').split('/');
    const primarySegment = segments[0] as ActiveTab;

    const validTabs: ActiveTab[] = ['dashboard', 'transactions', 'reports', 'folders', 'udhaar', 'notes', 'settings'];
    const tab: ActiveTab = validTabs.includes(primarySegment) ? primarySegment : 'dashboard';

    let reportMode: ReportViewMode = 'weekly';
    if (tab === 'reports') {
      if (segments[1] === 'monthly') {
        reportMode = 'monthly';
      } else if (segments[1] === 'weekly') {
        reportMode = 'weekly';
      }
    }

    const searchParams = new URLSearchParams(queryPart || '');
    if (searchParams.get('view') === 'monthly') {
      reportMode = 'monthly';
    } else if (searchParams.get('view') === 'weekly') {
      reportMode = 'weekly';
    }

    return {
      tab,
      reportMode,
      transactionFilter: searchParams.get('type') || undefined,
      searchQuery: searchParams.get('q') || undefined,
    };
  }, []);

  const [route, setRoute] = useState<RouteState>(parseCurrentUrl);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseCurrentUrl());
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    
    // Ensure clean initial hash if completely empty
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/dashboard');
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [parseCurrentUrl]);

  const navigateTo = useCallback(
    (tab: ActiveTab, subOptions?: { reportMode?: ReportViewMode; typeFilter?: string; query?: string }) => {
      let path = `#/${tab}`;
      if (tab === 'reports') {
        const mode = subOptions?.reportMode || (route.tab === 'reports' ? route.reportMode : 'weekly');
        path = `#/reports/${mode}`;
      }

      const params = new URLSearchParams();
      if (subOptions?.typeFilter) params.set('type', subOptions.typeFilter);
      if (subOptions?.query) params.set('q', subOptions.query);

      const queryString = params.toString();
      const fullUrl = queryString ? `${path}?${queryString}` : path;

      if (window.location.hash !== fullUrl) {
        window.history.pushState(null, '', fullUrl);
        setRoute(parseCurrentUrl());
      }
    },
    [route, parseCurrentUrl]
  );

  return {
    route,
    navigateTo,
  };
}
