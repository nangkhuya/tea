import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE, IMAGE_ASSETS } from '../config/constants';
import { useTranslation } from '../hooks/useTranslation';
import { useSessionStore } from '../stores/useSessionStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SafeImage } from '../components/ui/SafeImage';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const enterGuestDemo = useSessionStore((s) => s.enterGuestDemo);

  const handleEnterTeaHouse = async () => {
    await enterGuestDemo();
    navigate('/lobby');
  };

  const handleExplore = () => {
    const el = document.getElementById('experience');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-linen dark:border-ink-border">
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="relative overflow-hidden rounded-lg border border-linen bg-charcoal dark:border-ink-border">
            <div className="aspect-[16/9] min-h-[420px] w-full max-h-[620px]">
              <SafeImage
                src={IMAGE_ASSETS.HERO_PAVILION}
                alt="Trà thất gỗ nhìn ra núi sương sớm — ZEN TEA HOUSE"
                fallbackTitle={APP_NAME}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/95 via-charcoal/65 to-charcoal/25" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
              <p className="text-xs font-medium tracking-widest uppercase text-ivory/90">
                {t.landing.eyebrow}
              </p>

              <h1
                className="mt-3 max-w-2xl font-serif font-medium leading-[1.15] text-ivory text-balance"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.35rem)' }}
              >
                {t.landing.headline}
              </h1>

              <p className="mt-3 text-sm font-serif italic tracking-wide text-linen">
                {APP_TAGLINE}
              </p>

              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-ivory/90">
                {t.landing.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={handleEnterTeaHouse}>
                  {t.landing.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleExplore}
                  className="border-ivory/50 text-ivory hover:bg-ivory/15 hover:text-ivory dark:border-ivory/50 dark:text-ivory"
                >
                  {t.landing.secondaryCta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-dark-walnut dark:text-ink-text text-balance">
            {t.landing.pillarsTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-walnut dark:text-ink-muted">
            {t.landing.pillarsSubtitle}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {t.landing.pillars.map((pillar) => (
            <Card key={pillar.index} surface="paper">
              <p className="font-serif text-sm font-medium text-moss dark:text-sage">
                {pillar.index}.
              </p>
              <h3 className="mt-2 font-serif text-xl font-medium text-dark-walnut dark:text-ink-text">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-walnut dark:text-ink-muted">
                {pillar.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-linen bg-rice-paper/55 dark:border-ink-border dark:bg-ink-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="font-serif text-2xl font-medium text-dark-walnut dark:text-ink-text">
                {t.landing.sanctuaryTitle}
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-walnut dark:text-ink-muted">
                {t.landing.sanctuaryBody}
              </p>
              <p className="mt-4 text-xs text-moss dark:text-sage">{t.landing.sanctuaryNote}</p>
            </div>
            <div className="flex lg:col-span-4 lg:justify-end">
              <Button variant="secondary" size="lg" onClick={handleEnterTeaHouse}>
                {t.landing.enterLobbyCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
