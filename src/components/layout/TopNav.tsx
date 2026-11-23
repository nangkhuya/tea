import { Menu } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../config/constants';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { IconButton } from '../ui/IconButton';

export function TopNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mobileMenuOpen = useAppStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);

  const navLinks = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/lobby', label: t.nav.lobby },
    { to: '/rooms', label: t.nav.rooms },
    { to: '/avatar', label: t.nav.avatar },
    { to: '/settings', label: t.nav.settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-linen bg-ivory/95 backdrop-blur-sm dark:border-ink-border dark:bg-ink-bg/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="font-serif text-base sm:text-lg font-semibold tracking-wider text-dark-walnut whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss rounded dark:text-ink-text"
          >
            {APP_NAME}
          </Link>

          <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative py-1 text-sm whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss rounded ${
                    isActive
                      ? 'font-medium text-dark-walnut underline decoration-moss decoration-2 underline-offset-8 dark:text-ink-text'
                      : 'text-walnut hover:text-charcoal hover:underline hover:decoration-sand hover:underline-offset-8 dark:text-ink-muted dark:hover:text-ink-text'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:block">
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                {t.nav.profile}
              </Button>
            </div>
            <div className="md:hidden">
              <IconButton
                label={t.nav.menu}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={APP_NAME}
        closeLabel={t.nav.closeMenu}
      >
        <nav aria-label="Điều hướng di động" className="flex flex-col gap-1">
          {[...navLinks, { to: '/profile', label: t.nav.profile, end: false }].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center rounded-md px-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-rice-paper font-medium text-dark-walnut dark:bg-ink-surface dark:text-ink-text'
                    : 'text-walnut hover:bg-rice-paper/60 dark:text-ink-muted dark:hover:bg-ink-surface/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </Drawer>
    </>
  );
}
