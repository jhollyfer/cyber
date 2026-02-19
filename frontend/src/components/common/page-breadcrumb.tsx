import { Link, useMatches } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];

  if (pathname === '/') {
    segments.push({ label: 'Modulos' });
    return segments;
  }

  if (pathname === '/ranking') {
    segments.push({ label: 'Ranking' });
    return segments;
  }

  if (pathname.startsWith('/admin')) {
    segments.push({ label: 'Admin', href: '/admin' });

    if (pathname === '/admin') {
      segments[0] = { label: 'Dashboard' };
      return segments;
    }

    if (pathname.startsWith('/admin/modules')) {
      segments.push({ label: 'Modulos', href: '/admin/modules' });

      // Check for module editor: /admin/modules/<id>
      const moduleMatch = pathname.match(/^\/admin\/modules\/([^/]+)/);
      if (moduleMatch) {
        segments.push({ label: 'Editar' });
      }

      return segments;
    }

    if (pathname.startsWith('/admin/students')) {
      segments.push({ label: 'Alunos' });
      return segments;
    }
  }

  return segments;
}

export function PageBreadcrumb() {
  const matches = useMatches();
  const pathname = matches[matches.length - 1]?.pathname ?? '/';
  const crumbs = buildBreadcrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast || !crumb.href ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
