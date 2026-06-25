import { GI, HSR, WW, ZZZ } from '@/data';

const short = (assets) =>
  Object.fromEntries(
    Object.entries(assets).map(([path, module]) => [
      path.split('/').pop().replace('.webp', ''),
      module.default,
    ])
  );

export const ATTR_ASSETS = { 
  [GI]: short(import.meta.glob('./attr/genshin-impact/*.webp', { eager: true })),
  [HSR]: short(import.meta.glob('./attr/honkai-star-rail/*.webp', { eager: true })),
  [WW]: short(import.meta.glob('./attr/wuthering-waves/*.webp', { eager: true })),
  [ZZZ]: short(import.meta.glob('./attr/zenless-zone-zero/*.webp', { eager: true })),
};

export const EQUIP_ASSETS = { 
  [GI]: short(import.meta.glob('./equip/gi/*.webp', { eager: true })),
  [HSR]: short(import.meta.glob('./equip/hsr/*.webp', { eager: true })),
  [WW]: short(import.meta.glob('./equip/ww/*.webp', { eager: true })),
  [ZZZ]: short(import.meta.glob('./equip/zzz/*.webp', { eager: true })),
};

export const FILTER_ASSETS = { 
  [GI]: short(import.meta.glob('./filter/gi/*.webp', { eager: true })),
  [HSR]: short(import.meta.glob('./filter/hsr/*.webp', { eager: true })),
  [WW]: short(import.meta.glob('./filter/ww/*.webp', { eager: true })),
  [ZZZ]: short(import.meta.glob('./filter/zzz/*.webp', { eager: true })),
};

export const STAT_ASSETS = { 
  [GI]: short(import.meta.glob('./stat/gi/*.webp', { eager: true })),
  [HSR]: short(import.meta.glob('./stat/hsr/*.webp', { eager: true })),
  [WW]: short(import.meta.glob('./stat/ww/*.webp', { eager: true })),
  [ZZZ]: short(import.meta.glob('./stat/zzz/*.webp', { eager: true })),
};

export const ICON_ASSETS = { 
  default: Object.values(import.meta.glob('./icon/default_icon.webp', { eager: true }))[0].default,
  [GI]: Object.values(import.meta.glob('./icon/gi_icon.webp', { eager: true }))[0].default,
  [HSR]: Object.values(import.meta.glob('./icon/hsr_icon.webp', { eager: true }))[0].default,
  [WW]: Object.values(import.meta.glob('./icon/ww_icon.webp', { eager: true }))[0].default,
  [ZZZ]: Object.values(import.meta.glob('./icon/zzz_icon.webp', { eager: true }))[0].default,
};
