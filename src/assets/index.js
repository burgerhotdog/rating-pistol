const short = (assets) => {
  const shortened = {};
  Object.entries(assets).forEach(([path, module]) => {
    const filename = path.split("/").pop().replace(".webp", "");
    shortened[filename] = module.default;
  });
  return shortened;
};

const shorter = (assets) => {
  const shortened = {};
  Object.entries(assets).forEach(([path, module]) => {
    const pathParts = path.split("/");
    const avatarId = pathParts[pathParts.length - 2];
    const skillId = pathParts[pathParts.length - 1].replace(".webp", "");
    
    if (!shortened[avatarId]) {
      shortened[avatarId] = {};
    }
    
    shortened[avatarId][skillId] = module.default;
  });
  return shortened;
};

// dynamic exports
export const AVATAR_ASSETS = { 
  gi: shorter(import.meta.glob("./dynamic/avatar/gi_avatar/*/*.webp", { eager: true })),
  hsr: shorter(import.meta.glob("./dynamic/avatar/hsr_avatar/*/*.webp", { eager: true })),
  ww: shorter(import.meta.glob("./dynamic/avatar/ww_avatar/*/*.webp", { eager: true })),
  zzz: shorter(import.meta.glob("./dynamic/avatar/zzz_avatar/*/*.webp", { eager: true })),
};

export const WEAPON_ASSETS = { 
  gi: short(import.meta.glob("./dynamic/weapon/gi_weapon/*.webp", { eager: true })),
  hsr: short(import.meta.glob("./dynamic/weapon/hsr_weapon/*.webp", { eager: true })),
  ww: short(import.meta.glob("./dynamic/weapon/ww_weapon/*.webp", { eager: true })),
  zzz: short(import.meta.glob("./dynamic/weapon/zzz_weapon/*.webp", { eager: true })),
};

export const SET_ASSETS = { 
  gi: short(import.meta.glob("./dynamic/set/gi_set/*.webp", { eager: true })),
  hsr: short(import.meta.glob("./dynamic/set/hsr_set/*.webp", { eager: true })),
  ww: short(import.meta.glob("./dynamic/set/ww_set/*.webp", { eager: true })),
  zzz: short(import.meta.glob("./dynamic/set/zzz_set/*.webp", { eager: true })),
};

// static exports
export const ICON_ASSETS = { 
  default: Object.values(import.meta.glob("./static/icon/default_icon.webp", { eager: true }))[0].default,
  gi: Object.values(import.meta.glob("./static/icon/gi_icon.webp", { eager: true }))[0].default,
  hsr: Object.values(import.meta.glob("./static/icon/hsr_icon.webp", { eager: true }))[0].default,
  ww: Object.values(import.meta.glob("./static/icon/ww_icon.webp", { eager: true }))[0].default,
  zzz: Object.values(import.meta.glob("./static/icon/zzz_icon.webp", { eager: true }))[0].default,
};

export const EQUIP_ASSETS = { 
  gi: short(import.meta.glob("./static/equip/gi_equip/*.webp", { eager: true })),
  hsr: short(import.meta.glob("./static/equip/hsr_equip/*.webp", { eager: true })),
  ww: short(import.meta.glob("./static/equip/ww_equip/*.webp", { eager: true })),
  zzz: short(import.meta.glob("./static/equip/zzz_equip/*.webp", { eager: true })),
};

export const PATH_ASSETS = short(import.meta.glob("./static/path/*.webp", { eager: true }));

export const RATING_ASSETS = short(import.meta.glob("./static/rating/*.webp", { eager: true }));

export const STAT_ASSETS = { 
  gi: short(import.meta.glob("./static/stat/gi_stat/*.webp", { eager: true })),
  hsr: short(import.meta.glob("./static/stat/hsr_stat/*.webp", { eager: true })),
  ww: short(import.meta.glob("./static/stat/ww_stat/*.webp", { eager: true })),
  zzz: short(import.meta.glob("./static/stat/zzz_stat/*.webp", { eager: true })),
};
