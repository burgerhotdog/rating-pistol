const short = (assets) =>
  Object.fromEntries(
    Object.entries(assets).map(([path, module]) => [
      path.split('/').pop().replace('.webp', ''),
      module.default,
    ])
  );

export const AVATAR_ASSETS = { 
  gi: short(import.meta.glob('./avatar/gi/*.webp', { eager: true })),
  hsr: short(import.meta.glob('./avatar/hsr/*.webp', { eager: true })),
  ww: short(import.meta.glob('./avatar/ww/*.webp', { eager: true })),
  zzz: short(import.meta.glob('./avatar/zzz/*.webp', { eager: true })),
};

export const WEAPON_ASSETS = { 
  gi: short(import.meta.glob('./weapon/gi/*.webp', { eager: true })),
  hsr: short(import.meta.glob('./weapon/hsr/*.webp', { eager: true })),
  ww: short(import.meta.glob('./weapon/ww/*.webp', { eager: true })),
  zzz: short(import.meta.glob('./weapon/zzz/*.webp', { eager: true })),
};

export const EQUIP_ASSETS = { 
  gi: short(import.meta.glob('./equip/gi/*.webp', { eager: true })),
  hsr: short(import.meta.glob('./equip/hsr/*.webp', { eager: true })),
  ww: short(import.meta.glob('./equip/ww/*.webp', { eager: true })),
  zzz: short(import.meta.glob('./equip/zzz/*.webp', { eager: true })),
};

export const FILTER_ASSETS = { 
  gi: short(import.meta.glob('./filter/gi/*.webp', { eager: true })),
  hsr: short(import.meta.glob('./filter/hsr/*.webp', { eager: true })),
  ww: short(import.meta.glob('./filter/ww/*.webp', { eager: true })),
  zzz: short(import.meta.glob('./filter/zzz/*.webp', { eager: true })),
};

export const STAT_ASSETS = { 
  gi: short(import.meta.glob('./stat/gi/*.webp', { eager: true })),
  hsr: short(import.meta.glob('./stat/hsr/*.webp', { eager: true })),
  ww: short(import.meta.glob('./stat/ww/*.webp', { eager: true })),
  zzz: short(import.meta.glob('./stat/zzz/*.webp', { eager: true })),
};

export const ICON_ASSETS = { 
  default: Object.values(import.meta.glob('./icon/default_icon.webp', { eager: true }))[0].default,
  gi: Object.values(import.meta.glob('./icon/gi_icon.webp', { eager: true }))[0].default,
  hsr: Object.values(import.meta.glob('./icon/hsr_icon.webp', { eager: true }))[0].default,
  ww: Object.values(import.meta.glob('./icon/ww_icon.webp', { eager: true }))[0].default,
  zzz: Object.values(import.meta.glob('./icon/zzz_icon.webp', { eager: true }))[0].default,
};

export const RATING_ASSETS = short(import.meta.glob('./rating/*.webp', { eager: true }));
