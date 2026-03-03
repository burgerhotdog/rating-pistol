import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Card,
  IconButton,
  Stack,
} from "@mui/material";

// ─── Data ────────────────────────────────────────────────────────────────────

const CHARACTERS = [
  {
    id: 1,
    name: "Acheron",
    path: "Nihility",
    element: "Lightning",
    level: 80,
    eidolon: 0,
    bgGradient: "linear-gradient(135deg, #1a0a2e 0%, #2d1054 40%, #0d0520 100%)",
    accentColor: "#c084fc",
    icon: "⚡",
    stats: {
      HP: { value: 1358, max: 2000 },
      ATK: { value: 679, max: 1000 },
      DEF: { value: 412, max: 700 },
      SPD: { value: 101, max: 140 },
      "CRIT Rate": { value: "67.4%", max: null },
      "CRIT DMG": { value: "148.2%", max: null },
      "Effect RES": { value: "18.0%", max: null },
      "Energy Regen": { value: "100%", max: null },
    },
    extraStats: {
      "Lightning DMG Boost": "38.8%",
      "Break Effect": "0%",
      "Effect Hit Rate": "0%",
    },
    relics: [
      { slot: "Head", name: "Prisoner's Sealed Muzzle", mainStat: "HP", mainVal: "705", subs: [{ k: "CRIT Rate", v: "+5.8%" }, { k: "CRIT DMG", v: "+17.5%" }, { k: "ATK", v: "+4.3%" }, { k: "SPD", v: "+3" }] },
      { slot: "Hands", name: "Prisoner's Mittens", mainStat: "ATK", mainVal: "352", subs: [{ k: "CRIT Rate", v: "+8.2%" }, { k: "CRIT DMG", v: "+12.0%" }, { k: "HP%", v: "+4.3%" }, { k: "DEF%", v: "+5.4%" }] },
      { slot: "Body", name: "Prisoner's Uniform", mainStat: "CRIT Rate", mainVal: "43.2%", subs: [{ k: "ATK%", v: "+9.7%" }, { k: "CRIT DMG", v: "+14.2%" }, { k: "SPD", v: "+4" }, { k: "HP%", v: "+3.4%" }] },
      { slot: "Feet", name: "Prisoner's Shackles", mainStat: "SPD", mainVal: "25", subs: [{ k: "CRIT DMG", v: "+15.5%" }, { k: "CRIT Rate", v: "+5.8%" }, { k: "ATK%", v: "+4.3%" }, { k: "DEF%", v: "+3.2%" }] },
      { slot: "Planar Sphere", name: "Izumo Hadaeru no Kami's Sake Cup", mainStat: "Lightning DMG Boost", mainVal: "38.8%", subs: [{ k: "CRIT Rate", v: "+7.0%" }, { k: "ATK%", v: "+8.6%" }, { k: "CRIT DMG", v: "+5.8%" }, { k: "SPD", v: "+5" }] },
      { slot: "Link Rope", name: "Izumo Hadaeru no Kami's Link Rope", mainStat: "ATK%", mainVal: "43.2%", subs: [{ k: "CRIT DMG", v: "+16.5%" }, { k: "CRIT Rate", v: "+3.2%" }, { k: "HP%", v: "+4.3%" }, { k: "DEF", v: "+40" }] },
    ],
  },
  {
    id: 2,
    name: "Kafka",
    path: "Nihility",
    element: "Lightning",
    level: 80,
    eidolon: 2,
    bgGradient: "linear-gradient(135deg, #1a0510 0%, #3d0a1e 40%, #0d0208 100%)",
    accentColor: "#f472b6",
    icon: "🌹",
    stats: {
      HP: { value: 1203, max: 2000 },
      ATK: { value: 698, max: 1000 },
      DEF: { value: 388, max: 700 },
      SPD: { value: 112, max: 140 },
      "CRIT Rate": { value: "52.3%", max: null },
      "CRIT DMG": { value: "116.4%", max: null },
      "Effect RES": { value: "10.0%", max: null },
      "Energy Regen": { value: "100%", max: null },
    },
    extraStats: {
      "Lightning DMG Boost": "25.0%",
      "Break Effect": "0%",
      "Effect Hit Rate": "67.2%",
    },
    relics: [
      { slot: "Head", name: "Band's Polarized Sunglasses", mainStat: "HP", mainVal: "705", subs: [{ k: "ATK%", v: "+9.7%" }, { k: "CRIT Rate", v: "+5.8%" }, { k: "SPD", v: "+5" }, { k: "Effect Hit Rate", v: "+8.6%" }] },
      { slot: "Hands", name: "Band's Touring Bracelet", mainStat: "ATK", mainVal: "352", subs: [{ k: "CRIT DMG", v: "+12.0%" }, { k: "Effect Hit Rate", v: "+12.9%" }, { k: "SPD", v: "+3" }, { k: "ATK%", v: "+4.3%" }] },
      { slot: "Body", name: "Band's Leather Jacket", mainStat: "Effect Hit Rate", mainVal: "43.2%", subs: [{ k: "ATK%", v: "+12.9%" }, { k: "CRIT Rate", v: "+5.8%" }, { k: "SPD", v: "+3" }, { k: "HP%", v: "+4.3%" }] },
      { slot: "Feet", name: "Band's Ankle Boots", mainStat: "SPD", mainVal: "25", subs: [{ k: "ATK%", v: "+9.7%" }, { k: "Effect Hit Rate", v: "+8.6%" }, { k: "CRIT Rate", v: "+3.2%" }, { k: "HP%", v: "+3.4%" }] },
      { slot: "Planar Sphere", name: "Firmament Frontline's Tornado", mainStat: "Lightning DMG Boost", mainVal: "25.0%", subs: [{ k: "ATK%", v: "+8.6%" }, { k: "CRIT Rate", v: "+5.8%" }, { k: "SPD", v: "+5" }, { k: "Effect Hit Rate", v: "+4.3%" }] },
      { slot: "Link Rope", name: "Firmament Frontline's Meteor", mainStat: "ATK%", mainVal: "43.2%", subs: [{ k: "CRIT DMG", v: "+10.4%" }, { k: "Effect Hit Rate", v: "+12.9%" }, { k: "HP%", v: "+4.3%" }, { k: "DEF%", v: "+5.4%" }] },
    ],
  },
  {
    id: 3,
    name: "Seele",
    path: "Hunt",
    element: "Quantum",
    level: 80,
    eidolon: 6,
    bgGradient: "linear-gradient(135deg, #0d0a1e 0%, #1a1040 40%, #08060f 100%)",
    accentColor: "#a78bfa",
    icon: "🦋",
    stats: {
      HP: { value: 1086, max: 2000 },
      ATK: { value: 756, max: 1000 },
      DEF: { value: 352, max: 700 },
      SPD: { value: 115, max: 140 },
      "CRIT Rate": { value: "75.2%", max: null },
      "CRIT DMG": { value: "182.5%", max: null },
      "Effect RES": { value: "8.0%", max: null },
      "Energy Regen": { value: "100%", max: null },
    },
    extraStats: {
      "Quantum DMG Boost": "51.2%",
      "Break Effect": "0%",
      "Effect Hit Rate": "0%",
    },
    relics: [
      { slot: "Head", name: "Space Sealing Station's Mask", mainStat: "HP", mainVal: "705", subs: [{ k: "CRIT Rate", v: "+8.2%" }, { k: "CRIT DMG", v: "+19.4%" }, { k: "ATK%", v: "+4.3%" }, { k: "SPD", v: "+3" }] },
      { slot: "Hands", name: "Space Sealing Station's Bracelet", mainStat: "ATK", mainVal: "352", subs: [{ k: "CRIT DMG", v: "+17.5%" }, { k: "CRIT Rate", v: "+5.8%" }, { k: "SPD", v: "+4" }, { k: "HP%", v: "+4.3%" }] },
      { slot: "Body", name: "Space Sealing Station's Chest", mainStat: "CRIT DMG", mainVal: "64.8%", subs: [{ k: "CRIT Rate", v: "+10.5%" }, { k: "ATK%", v: "+9.7%" }, { k: "SPD", v: "+5" }, { k: "HP%", v: "+3.4%" }] },
      { slot: "Feet", name: "Space Sealing Station's Feet", mainStat: "SPD", mainVal: "25", subs: [{ k: "CRIT Rate", v: "+8.2%" }, { k: "CRIT DMG", v: "+14.2%" }, { k: "ATK%", v: "+8.6%" }, { k: "DEF%", v: "+3.2%" }] },
      { slot: "Planar Sphere", name: "Rutilant Arena's Sphere", mainStat: "Quantum DMG Boost", mainVal: "38.8%", subs: [{ k: "CRIT Rate", v: "+7.0%" }, { k: "ATK%", v: "+8.6%" }, { k: "CRIT DMG", v: "+10.4%" }, { k: "SPD", v: "+3" }] },
      { slot: "Link Rope", name: "Rutilant Arena's Rope", mainStat: "ATK%", mainVal: "43.2%", subs: [{ k: "CRIT DMG", v: "+21.0%" }, { k: "CRIT Rate", v: "+3.2%" }, { k: "HP%", v: "+4.3%" }, { k: "DEF", v: "+40" }] },
    ],
  },
];

const ELEMENT_COLORS = {
  Lightning: "#c084fc",
  Quantum:   "#a78bfa",
  Fire:      "#f97316",
  Ice:       "#67e8f9",
  Wind:      "#4ade80",
  Physical:  "#cbd5e1",
  Imaginary: "#fbbf24",
};

const PATH_ICONS = {
  Nihility:     "⬛",
  Hunt:         "🎯",
  Erudition:    "📚",
  Harmony:      "🎵",
  Preservation: "🛡",
  Abundance:    "🌸",
  Destruction:  "💥",
};

function StatRow({ label, value, accentColor }) {
  const isCrit = label.includes("CRIT");
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
      <Typography sx={{ fontSize: "11px", color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "13px", color: isCrit ? accentColor : "#f8fafc", fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

function BonusRow({ label, value }) {
  const isPositive = parseFloat(value) > 0;
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
      <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontSize: "13px", color: isPositive ? "#4ade80" : "#475569", fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

function CharIconButton({ char, isActive, onClick }) {
  const ec = ELEMENT_COLORS[char.element] || "#7c3aed";
  return (
    <IconButton
      onClick={onClick}
      disableRipple
      sx={{
        p: 0,
        borderRadius: "12px",
        width: 48, height: 48,
        background: isActive ? `linear-gradient(135deg, ${ec}30, ${ec}10)` : "rgba(15,23,42,0.8)",
        border: `2px solid ${isActive ? ec : "rgba(255,255,255,0.08)"}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography sx={{ fontSize: "18px", lineHeight: 1 }}>{char.icon}</Typography>
    </IconButton>
  );
}

export default function HSRShowcase() {
  const [selected, setSelected] = useState(0);
  const char = CHARACTERS[selected];
  const { accentColor } = char;
  const elemColor = ELEMENT_COLORS[char.element] || accentColor;

  return (
    <Box sx={{ display: "flex", position: "relative", overflow: "hidden" }}>
      {/* ── LEFT: Roster sidebar ── */}
      <Box sx={{
        width: 72, flexShrink: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        pt: 2.5, gap: 1, position: "relative", zIndex: 10,
      }}>
        {CHARACTERS.map((c, i) => (
          <CharIconButton key={c.id} char={c} isActive={i === selected} onClick={() => setSelected(i)} />
        ))}
      </Box>

      {/* ── CENTER: Stats panel ── */}
      <Card sx={{
        flex: "0 0 340px",
        background: char.bgGradient,
        p: 2,
        position: "relative", zIndex: 10,
        overflowY: "auto",
      }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="flex-end" gap={1}>
            <Typography sx={{ fontSize: "26px", fontWeight: 900, color: "#f8fafc", lineHeight: 1 }}>
              {char.name}
            </Typography>
            <Stack direction="row" gap={1}>
              <Chip
                label={char.element}
                size="small"
                sx={{
                  height: 20, fontSize: "11px", fontWeight: 700,
                  background: `${elemColor}25`, border: `1px solid ${elemColor}50`, color: elemColor,
                  "& .MuiChip-label": { px: "8px" },
                }}
              />
              <Chip
                label={`${PATH_ICONS[char.path]} ${char.path}`}
                size="small"
                sx={{
                  height: 20, fontSize: "11px", fontWeight: 700,
                  background: "rgba(255,255,255,0.08)", color: "#94a3b8",
                  "& .MuiChip-label": { px: "8px" },
                }}
              />
            </Stack>
          </Stack>
          <Stack direction="row" gap={1}>
            <Typography sx={{ fontSize: "12px", color: "#64748b" }}>Lv.{char.level}</Typography>
            <Typography sx={{ fontSize: "12px", color: accentColor }}>E{char.eidolon}</Typography>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: `${accentColor}40` }} />

        <Box sx={{ mb: 2.5 }}>
          {Object.entries(char.stats).map(([k, { value, max }]) =>
            <StatRow key={k} label={k} value={String(value)} accentColor={accentColor} />
          )}
        </Box>

        <Divider sx={{ borderColor: `${accentColor}20` }} />

        <Box>
          {Object.entries(char.extraStats).map(([k, v]) => (
            <BonusRow key={k} label={k} value={v} />
          ))}
        </Box>
      </Card>
    </Box>
  );
}
