# Промпты для генерации картинок — «Солод Руси»

Гамма сайта, её нужно держать во всех кадрах:
беж `#F7EFE3` · пшеничное золото `#E9B84F` · терракота `#C4693F` · тёплый тёмно-коричневый `#33241C`

Кидать сгенерированное в папку `assets/img/` под именами, указанными в заголовках.
Формат — JPG, качество 85. После загрузки я встрою их в вёрстку.

---

## 1. `hero-malt.jpg` — первый экран, 4:5 вертикальный, 1400×1750

```
Editorial macro photograph of a heap of pale golden barley malt grains, shot from a
45-degree angle. Individual grains sharply in focus in the foreground, softly blurred
toward the back. Warm diffused daylight from the left, gentle shadows. Background is a
plain warm beige surface (#F7EFE3). The grains are pale straw-gold (#E9B84F range), clean,
dry, no husk debris. Subtle warm terracotta shadow tones. Shallow depth of field, 100mm
macro lens look, natural film grain. No text, no logos, no watermark, no hands, no people.
Not a wheat field, not a sunset, not a windmill.
```

## 2. `product-barley.jpg` — карточка «Светлый ячменный», квадрат 1:1, 1200×1200

```
Overhead flat-lay photograph of light barley malt grains spread in a loose pile on a
cream linen cloth (#F7EFE3). Pale straw-gold grains, plump and rounded, uniform in colour,
each grain with a visible longitudinal crease. Soft even daylight, very soft shadows,
slightly desaturated warm palette. Centered composition with generous empty beige space
around the pile. Editorial food photography, natural texture. No text, no logos, no
watermark, no hands, no tools, no props.
```

## 3. `product-wheat.jpg` — карточка «Светлый пшеничный», квадрат 1:1, 1200×1200

```
Overhead flat-lay photograph of light wheat malt grains on a cream linen cloth (#F7EFE3).
The grains are narrower and more elongated than barley, pale honey-gold, without husks.
Two dry wheat ears lie diagonally beside the pile. Soft even daylight, warm muted palette
of beige and wheat gold, subtle terracotta shadows. Generous empty space around the
composition. Editorial food photography, natural texture, shallow depth of field.
No text, no logos, no watermark, no hands, no people.
```

## 4. `lab-ebc.jpg` — блок «Лаборатория», 3:2 горизонтальный, 1800×1200

```
Row of six identical clear laboratory glass cuvettes standing on a warm beige surface
(#F7EFE3), each filled with brewing wort of a different colour, forming a smooth gradient
from very pale straw at the left to deep amber-brown at the right. Backlit so the liquids
glow warmly. Clean minimal composition, plenty of empty beige space above. Soft diffused
studio light, warm neutral colour grading, no cold blue or clinical white tones. Shallow
depth of field. No text, no labels, no logos, no watermark, no people.
```

## 5. `production-venev.jpg` — блок «О компании», 16:9, 1920×1080

```
Interior photograph of a clean modern malt house: rows of stacked paper malt sacks on
wooden pallets, warm dusty daylight falling from a high window, fine grain dust suspended
in the light beam. Warm beige and brown palette, terracotta and wheat-gold accents,
concrete floor. Calm, spacious, orderly. Wide angle, natural perspective, soft warm colour
grading. No text, no logos, no brand marks on the sacks, no watermark, no visible faces.
```

## 6. `og-cover.jpg` — картинка для мессенджеров и соцсетей, 1200×630

```
Wide horizontal composition: pale golden barley malt grains scattered loosely across the
left two thirds of a warm beige surface (#F7EFE3), with the right third left empty for
text overlay. Soft warm daylight from the upper left, gentle natural shadows, shallow
depth of field. Muted warm palette of beige, wheat gold and terracotta. Editorial
minimalist product photography. No text, no logos, no watermark.
```

---

## Общие правила для всех кадров

- **Тёплый свет**, никакого холодного/белого «студийного» освещения.
- **Фон — беж `#F7EFE3`** или максимально близкий, чтобы картинка садилась в макет без рамок.
- **Никакого текста, логотипов, водяных знаков, подписей** — всё это добавляется вёрсткой.
- **Запрещённые штампы:** пшеничное поле на закате, мельница, колосья в руках на фоне неба,
  пивная кружка с пеной, стоковые улыбающиеся люди в касках.
- Если генератор выдаёт слишком жёлто-кислотную картинку — добавляй в конец промпта
  `muted, desaturated, warm beige tones, low saturation`.
