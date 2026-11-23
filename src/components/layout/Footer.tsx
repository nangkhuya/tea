import { Link } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE } from '../../config/constants';
import { useTranslation } from '../../hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-linen bg-rice-paper/45 dark:border-ink-border dark:bg-ink-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-serif text-sm font-semibold tracking-wider text-dark-walnut dark:text-ink-text">
            {APP_NAME}
          </p>
          <p className="mt-1 text-xs text-walnut dark:text-ink-muted">{APP_TAGLINE}</p>
        </div>

        <nav aria-label="Liên kết chân trang" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-walnut dark:text-ink-muted">
          <Link to="/" className="hover:text-charcoal dark:hover:text-ink-text whitespace-nowrap">
            {t.nav.home}
          </Link>
          <Link to="/lobby" className="hover:text-charcoal dark:hover:text-ink-text whitespace-nowrap">
            {t.nav.lobby}
          </Link>
          <Link to="/rooms" className="hover:text-charcoal dark:hover:text-ink-text whitespace-nowrap">
            {t.nav.rooms}
          </Link>
          <Link to="/avatar" className="hover:text-charcoal dark:hover:text-ink-text whitespace-nowrap">
            {t.nav.avatar}
          </Link>
          <Link to="/profile" className="hover:text-charcoal dark:hover:text-ink-text whitespace-nowrap">
            {t.nav.profile}
          </Link>
          <Link to="/settings" className="hover:text-charcoal dark:hover:text-ink-text whitespace-nowrap">
            {t.nav.settings}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
