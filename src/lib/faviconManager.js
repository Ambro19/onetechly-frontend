// src/lib/faviconManager.js

/**
 * Dynamically updates favicon based on current route
 * - OneTechly logo for marketing pages (/, /ycd, /pricing, etc.)
 * - YCD logo for app pages (/app/*)
 */

export function updateFavicon(pathname) {
  // Determine which logo set to use
  const isAppRoute = pathname.startsWith('/app');
  const iconPath = isAppRoute ? 'favicon_io' : 'favicon_io_onetechly';
  
  // Update all favicon links
  const faviconLinks = [
    { rel: 'icon', type: 'image/x-icon', href: `/${iconPath}/favicon.ico` },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: `/${iconPath}/favicon-32x32.png` },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: `/${iconPath}/favicon-16x16.png` },
    { rel: 'apple-touch-icon', sizes: '180x180', href: `/${iconPath}/apple-touch-icon.png` }
  ];

  // Remove existing favicon links
  document.querySelectorAll('link[rel*="icon"]').forEach(link => link.remove());

  // Add new favicon links
  faviconLinks.forEach(({ rel, type, sizes, href }) => {
    const link = document.createElement('link');
    link.rel = rel;
    if (type) link.type = type;
    if (sizes) link.sizes = sizes;
    link.href = href;
    document.head.appendChild(link);
  });

  // Update document title
  if (isAppRoute) {
    // Keep existing title format for app routes
  } else {
    // Update to OneTechly branding for marketing routes
    if (!document.title.includes('OneTechly')) {
      document.title = 'OneTechly — Tech Tips and Troubleshooting';
    }
  }
}

// Auto-update on route change
export function initFaviconManager() {
  // Update on initial load
  updateFavicon(window.location.pathname);
  
  // Listen for route changes (for React Router)
  const observer = new MutationObserver(() => {
    updateFavicon(window.location.pathname);
  });
  
  observer.observe(document.querySelector('title'), {
    childList: true,
    subtree: true
  });
  
  // Also listen for popstate (browser back/forward)
  window.addEventListener('popstate', () => {
    updateFavicon(window.location.pathname);
  });
}