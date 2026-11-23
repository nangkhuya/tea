import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { RotateCcw, Rotate3D, Save } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAvatarStore } from '../stores/useAvatarStore';
import { useProfileStore } from '../stores/useProfileStore';
import type { AvatarAccessory, AvatarAttireStyle, AvatarColorTone, AvatarFacePreset, AvatarHairColor, AvatarHairStyle } from '../types/domain';
import { AvatarCanvas } from '../features/avatar/AvatarCanvas';
import type { AvatarMotion } from '../features/avatar/avatarAssets';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';

const tones: Array<{ id: AvatarColorTone; color: string; en: string; vi: string }> = [
  { id: 'warm-ivory', color: '#ded2bb', en: 'Warm ivory', vi: 'Ngà ấm' },
  { id: 'moss-green', color: '#68715b', en: 'Moss', vi: 'Rêu trầm' },
  { id: 'muted-indigo', color: '#59677a', en: 'Indigo', vi: 'Chàm nhạt' },
  { id: 'walnut-earth', color: '#74543d', en: 'Walnut', vi: 'Óc chó' },
];
const skinTones = [
  { id: 'porcelain', color: '#efd9c9', en: 'Porcelain', vi: 'Ngà sáng' },
  { id: 'warm-beige', color: '#d6ab8c', en: 'Warm beige', vi: 'Be ấm' },
  { id: 'amber-olive', color: '#bd8c68', en: 'Amber olive', vi: 'Ô liu hổ phách' },
  { id: 'deep-bronze', color: '#80533f', en: 'Deep bronze', vi: 'Đồng trầm' },
] as const;

function Field({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-2.5"><h3 className="text-sm font-medium text-dark-walnut dark:text-ink-text">{title}</h3>{children}</section>;
}

export default function AvatarEntryPage() {
  const { t, language } = useTranslation();
  const uid = useProfileStore((s) => s.profile.uid);
  const config = useAvatarStore((s) => s.config);
  const saving = useAvatarStore((s) => s.saving);
  const updateDraft = useAvatarStore((s) => s.updateDraft);
  const saveDraft = useAvatarStore((s) => s.saveDraft);
  const resetDraft = useAvatarStore((s) => s.resetDraft);
  const hydrateAvatar = useAvatarStore((s) => s.hydrateAvatar);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [assetState, setAssetState] = useState<{ status: 'demo' | 'loading' | 'ready' | 'error'; details?: string }>({ status: 'demo' });
  const [availableMotions, setAvailableMotions] = useState<AvatarMotion[]>([]);
  const [motion, setMotion] = useState<AvatarMotion>('idle');
  const [portrait, setPortrait] = useState(false);
  const [resetViewKey, setResetViewKey] = useState(0);
  const isDirty = savedSnapshot.length > 0 && savedSnapshot !== JSON.stringify(config);

  useEffect(() => {
    let active = true;
    void hydrateAvatar(uid).then(() => {
      if (active) setSavedSnapshot(JSON.stringify(useAvatarStore.getState().config));
    });
    return () => { active = false; };
  }, [uid, hydrateAvatar]);

  const onAssetStatus = useCallback((status: typeof assetState.status, details?: string) => setAssetState({ status, details }), []);
  const onAvailableMotions = useCallback((motions: AvatarMotion[]) => setAvailableMotions(motions), []);
  const save = async () => {
    if (await saveDraft(uid)) setSavedSnapshot(JSON.stringify(useAvatarStore.getState().config));
  };
  const reset = async () => {
    await resetDraft(uid);
    setSavedSnapshot(JSON.stringify(useAvatarStore.getState().config));
  };

  const attireOptions = useMemo(() => [
    { value: 'natural-linen' as AvatarAttireStyle, label: language === 'vi' ? 'Vải lanh' : 'Linen' },
    { value: 'hanfu-scholar' as AvatarAttireStyle, label: language === 'vi' ? 'Áo văn nhân' : 'Scholar robe' },
    { value: 'zen-yukata' as AvatarAttireStyle, label: language === 'vi' ? 'Yukata' : 'Yukata' },
    { value: 'tea-robe' as AvatarAttireStyle, label: language === 'vi' ? 'Trà bào' : 'Tea robe' },
    { value: 'modern-linen' as AvatarAttireStyle, label: language === 'vi' ? 'Lanh đương đại' : 'Modern linen' },
  ], [language]);
  const hairOptions: Array<{ value: AvatarHairStyle; label: string }> = [
    { value: 'low-bun', label: language === 'vi' ? 'Búi thấp' : 'Low bun' },
    { value: 'shoulder-natural', label: language === 'vi' ? 'Ngang vai' : 'Shoulder length' },
    { value: 'short-neat', label: language === 'vi' ? 'Ngắn gọn' : 'Short and neat' },
    { value: 'pinned-classic', label: language === 'vi' ? 'Búi cài trâm' : 'Pinned classic' },
  ];
  const hairColors: Array<{ value: AvatarHairColor; label: string; swatch: string }> = [
    { value: 'espresso', label: language === 'vi' ? 'Nâu espresso' : 'Espresso', swatch: '#29221e' },
    { value: 'chestnut', label: language === 'vi' ? 'Hạt dẻ' : 'Chestnut', swatch: '#594033' },
    { value: 'silver', label: language === 'vi' ? 'Bạc' : 'Silver', swatch: '#a8a39a' },
  ];
  const faceOptions: Array<{ value: AvatarFacePreset; label: string }> = [
    { value: 'soft', label: language === 'vi' ? 'Mềm mại' : 'Soft' },
    { value: 'oval', label: language === 'vi' ? 'Trái xoan' : 'Oval' },
    { value: 'defined', label: language === 'vi' ? 'Nét rõ' : 'Defined' },
  ];
  const accessoryOptions: Array<{ id: AvatarAccessory; en: string; vi: string }> = [
    { id: 'wooden-hairpin', en: 'Wood hairpin', vi: 'Trâm gỗ' },
    { id: 'tea-beads', en: 'Tea beads', vi: 'Chuỗi hạt trà' },
    { id: 'round-glasses', en: 'Round glasses', vi: 'Kính tròn' },
  ];
  const toggleAccessory = (item: AvatarAccessory) => {
    const accessories = config.accessories.includes(item)
      ? config.accessories.filter((value) => value !== item)
      : [...config.accessories, item];
    updateDraft({ accessories });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-linen pb-5 dark:border-ink-border">
        <p className="text-[11px] font-medium tracking-[0.18em] text-moss dark:text-sage">{t.avatar.studioLabel}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-medium text-dark-walnut dark:text-ink-text">{t.avatar.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-walnut dark:text-ink-muted">{t.avatar.subtitle}</p>
          </div>
          <div className={`text-xs ${isDirty ? 'text-[#946c36]' : 'text-moss dark:text-sage'}`} role="status">
            {isDirty ? t.avatar.unsaved : t.avatar.saved}
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)]">
        <Card padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-linen px-4 py-3 dark:border-ink-border">
            <div><h2 className="font-serif text-base text-dark-walnut dark:text-ink-text">{t.avatar.previewTitle}</h2><p className="mt-0.5 text-[11px] text-walnut dark:text-ink-muted">{assetState.status === 'ready' ? `${t.avatar.modelReady} · ${assetState.details ?? ''}` : assetState.status === 'loading' ? `${language === 'vi' ? 'Đang nạp mô hình…' : 'Loading character model…'} ${assetState.details ?? ''}` : assetState.status === 'error' ? `${t.avatar.assetError} ${assetState.details ?? ''}` : t.avatar.demoModelNotice}</p></div>
            <div className="flex gap-1" role="group" aria-label={language === 'vi' ? 'Khung hình máy quay' : 'Camera framing'}>
              <Button size="sm" variant={portrait ? 'ghost' : 'outline'} aria-pressed={!portrait} onClick={() => setPortrait(false)}>{t.avatar.viewFull}</Button>
              <Button size="sm" variant={portrait ? 'outline' : 'ghost'} aria-pressed={portrait} onClick={() => setPortrait(true)}>{t.avatar.viewPortrait}</Button>
            </div>
          </div>
          <div className="relative h-[420px] sm:h-[560px]">
            <AvatarCanvas config={config} portrait={portrait} motion={motion} resetViewKey={resetViewKey} onAssetStatus={onAssetStatus} onAvailableMotions={onAvailableMotions} />
            <button type="button" className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-2 text-xs text-[#51463a] shadow-sm backdrop-blur hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss" onClick={() => { setMotion('idle'); setPortrait(false); setResetViewKey((key) => key + 1); }} aria-label={language === 'vi' ? 'Đặt lại góc nhìn' : 'Reset view'}><Rotate3D size={15} />{language === 'vi' ? 'Kéo để xoay · Đặt lại' : 'Drag to rotate · Reset view'}</button>
          </div>
          <div className="border-t border-linen px-4 py-3 dark:border-ink-border">
            <Field title={t.avatar.animationsTitle}>
              <div className="flex flex-wrap gap-2">
                {([
                  ['idle', t.avatar.animationIdle], ['walk', t.avatar.animationWalk], ['seated-meditation', t.avatar.animationMeditate], ['tea-cup', t.avatar.animationTea],
                ] as Array<[AvatarMotion, string]>).map(([id, label]) => (
                  <Button key={id} size="sm" variant={motion === id ? 'secondary' : 'outline'} disabled={!availableMotions.includes(id)} title={!availableMotions.includes(id) ? t.avatar.noAnimationNotice : undefined} onClick={() => setMotion(id)}>{label}</Button>
                ))}
              </div>
              {availableMotions.length === 0 && <p className="text-[11px] leading-relaxed text-walnut dark:text-ink-muted">{t.avatar.noAnimationNotice}</p>}
            </Field>
          </div>
        </Card>

        <Card surface="paper" className="space-y-6">
          <div className="flex items-center justify-between border-b border-linen pb-3 dark:border-ink-border">
            <h2 className="font-serif text-xl text-dark-walnut dark:text-ink-text">{t.avatar.appearanceTitle}</h2>
            <button type="button" onClick={() => void reset()} className="inline-flex min-h-10 items-center gap-2 rounded px-2 text-xs text-walnut hover:bg-rice-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss dark:text-ink-muted"><RotateCcw size={14} />{t.avatar.reset}</button>
          </div>

          <Field title={t.avatar.presentationLabel}>
            <Tabs ariaLabel={t.avatar.presentationLabel} value={config.appearance.presentation} onChange={(presentation) => updateDraft({ appearance: { ...config.appearance, presentation } })} items={[
              { value: 'feminine', label: language === 'vi' ? 'Nữ tính' : 'Feminine' }, { value: 'neutral', label: language === 'vi' ? 'Trung tính' : 'Neutral' }, { value: 'masculine', label: language === 'vi' ? 'Nam tính' : 'Masculine' },
            ]} />
          </Field>

          <Field title={t.avatar.toneLabel}>
            <div className="flex flex-wrap gap-2.5">{skinTones.map((tone) => <button key={tone.id} type="button" onClick={() => updateDraft({ appearance: { ...config.appearance, skinTone: tone.id } })} aria-label={language === 'vi' ? tone.vi : tone.en} aria-pressed={config.appearance.skinTone === tone.id} className={`group grid h-10 w-10 place-items-center rounded-full border-2 ${config.appearance.skinTone === tone.id ? 'border-moss ring-2 ring-moss/20' : 'border-white/80 hover:border-sand'}`} style={{ backgroundColor: tone.color }}><span className="sr-only">{language === 'vi' ? tone.vi : tone.en}</span></button>)}<span className="self-center text-xs text-walnut dark:text-ink-muted">{language === 'vi' ? skinTones.find((x) => x.id === config.appearance.skinTone)?.vi : skinTones.find((x) => x.id === config.appearance.skinTone)?.en}</span></div>
          </Field>

          <Field title={t.avatar.faceLabel}>
            <Tabs ariaLabel={t.avatar.faceLabel} value={config.appearance.facePreset} onChange={(facePreset) => updateDraft({ appearance: { ...config.appearance, facePreset } })} items={faceOptions} />
          </Field>

          <Field title={t.avatar.hairLabel}>
            <div className="grid grid-cols-2 gap-2">{hairOptions.map((item) => <button key={item.value} type="button" onClick={() => updateDraft({ hairstyle: item.value })} aria-pressed={config.hairstyle === item.value} className={`min-h-10 rounded border px-3 text-left text-xs transition-colors ${config.hairstyle === item.value ? 'border-moss bg-moss/10 text-dark-walnut dark:text-ink-text' : 'border-linen bg-ivory/70 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'}`}>{item.label}</button>)}</div>
          </Field>

          <Field title={t.avatar.hairColorLabel}>
            <div className="flex flex-wrap gap-2">{hairColors.map((item) => <button key={item.value} type="button" onClick={() => updateDraft({ hairColor: item.value })} aria-pressed={config.hairColor === item.value} className={`flex min-h-10 items-center gap-2 rounded border px-3 text-xs ${config.hairColor === item.value ? 'border-moss bg-ivory dark:bg-ink-bg' : 'border-linen dark:border-ink-border'}`}><span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.swatch }} />{item.label}</button>)}</div>
          </Field>

          <Field title={t.avatar.attireLabel}>
            <Tabs ariaLabel={t.avatar.attireLabel} value={config.clothing} onChange={(clothing) => updateDraft({ clothing })} items={attireOptions} />
          </Field>

          <Field title={t.avatar.clothingColorLabel}>
            <div className="flex flex-wrap gap-2">{tones.map((tone) => <button key={tone.id} type="button" onClick={() => updateDraft({ colors: { ...config.colors, primary: tone.id } })} aria-pressed={config.colors.primary === tone.id} aria-label={language === 'vi' ? tone.vi : tone.en} className={`h-9 w-9 rounded-full border-2 ${config.colors.primary === tone.id ? 'border-dark-walnut ring-2 ring-moss/20' : 'border-white hover:border-sand'}`} style={{ backgroundColor: tone.color }} />)}</div>
          </Field>

          <Field title={t.avatar.accessoriesLabel}>
            <div className="flex flex-wrap gap-2">{accessoryOptions.map((item) => <button key={item.id} type="button" onClick={() => toggleAccessory(item.id)} aria-pressed={config.accessories.includes(item.id)} className={`min-h-10 rounded border px-3 text-xs ${config.accessories.includes(item.id) ? 'border-moss bg-moss/10 text-dark-walnut dark:text-ink-text' : 'border-linen text-walnut hover:border-sand dark:border-ink-border dark:text-ink-muted'}`}>{language === 'vi' ? item.vi : item.en}</button>)}</div>
          </Field>

          <Field title={`${t.avatar.heightLabel} · ${config.body.heightScale.toFixed(2)}×`}>
            <input aria-label={t.avatar.heightLabel} type="range" min="0.9" max="1.1" step="0.01" value={config.body.heightScale} onChange={(event) => updateDraft({ body: { ...config.body, heightScale: Number(event.target.value) } })} className="w-full accent-[#68715b]" />
          </Field>

          <Field title={t.avatar.postureLabel}>
            <Tabs ariaLabel={t.avatar.postureLabel} value={config.body.posture} onChange={(posture) => updateDraft({ body: { ...config.body, posture } })} items={[
              { value: 'upright-calm', label: language === 'vi' ? 'Đĩnh đạc' : 'Upright' }, { value: 'relaxed-tea', label: language === 'vi' ? 'Thư thái' : 'Relaxed tea' },
            ]} />
          </Field>

          <div className="rounded-md border border-linen bg-ivory/70 p-3 dark:border-ink-border dark:bg-ink-bg/70">
            <h3 className="text-xs font-medium text-dark-walnut dark:text-ink-text">{t.avatar.modelPipelineTitle}</h3>
            <p className="mt-1 text-xs leading-relaxed text-walnut dark:text-ink-muted">{t.avatar.modelPipelineBody}</p>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-linen pt-4 dark:border-ink-border">
            <Button onClick={() => void save()} disabled={saving || !isDirty}><Save size={15} />{saving ? (language === 'vi' ? 'Đang lưu…' : 'Saving…') : t.avatar.saveDraft}</Button>
            <span className="self-center text-xs text-walnut dark:text-ink-muted">{language === 'vi' ? 'Lưu bản demo trên trình duyệt này' : 'Demo save on this browser'}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
