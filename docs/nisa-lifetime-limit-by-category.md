# 生涯投資枠 種別別利用状況表示 仕様書

## 概要

トップ画面（`/`）の「生涯投資枠 利用状況」セクション下部に、積立投資枠・成長投資枠それぞれの生涯投資枠の利用状況を種別ごとに表示するUIを追加する。

---

## 現状

現在のトップ画面では、生涯投資枠の合計（1,800万円）に対する利用済み合計・残り枠・利用率をドーナツチャートとサマリーカードで表示している。

積立投資枠と成長投資枠を合算した値のみが表示されており、種別ごとの内訳は確認できない。

---

## 要件

### 機能要件

- 積立投資枠の生涯投資枠（600万円）に対する利用済み金額・残り枠・利用率を表示する。
- 成長投資枠の生涯投資枠（1,200万円）に対する利用済み金額・残り枠・利用率を表示する。
- 各種別の利用状況はプログレスバーで視覚的に表現する。
- 既存の合計表示は維持する。

### 非機能要件

- 既存の画面レイアウト・デザインを極力維持する。
- ダークモードに対応する。
- レスポンシブデザイン（モバイル・タブレット・PC）に対応する。

---

## 生涯投資枠 上限値

| 種別 | 年間投資枠 | 生涯投資枠 |
|------|-----------|-----------|
| 積立投資枠 | 120万円 | 600万円 |
| 成長投資枠 | 240万円 | 1,200万円 |
| 合計 | 360万円 | 1,800万円 |

---

## UI設計

### レイアウト変更

既存の「生涯投資枠 利用状況」カードの下部（サマリーカード群の下）に、種別ごとの内訳セクションを追加する。

#### 変更後のカード構成

```
┌─────────────────────────────────────────┐
│  生涯投資枠 利用状況                      │
│                                         │
│  [ドーナツチャート（現状維持）]            │
│                                         │
│  [生涯投資枠] [利用済み合計]              │
│  [残り枠]     [利用率]                   │
│                                         │
│  ─────────────────────────────          │
│                                         │
│  種別別 生涯投資枠 利用状況               │
│                                         │
│  つみたて投資枠                          │
│  ████████████░░░░░░░░  XX.X%           │
│  利用済み: X,XXX,XXX円 / 6,000,000円    │
│                                         │
│  成長投資枠                              │
│  ████████████░░░░░░░░  XX.X%           │
│  利用済み: X,XXX,XXX円 / 12,000,000円   │
│                                         │
└─────────────────────────────────────────┘
```

### 種別別利用状況セクション

各種別の表示項目：

- 種別名（「つみたて投資枠」または「成長投資枠」）
- プログレスバー（利用率を視覚的に表現）
- 利用率（パーセンテージ）
- 利用済み金額 / 生涯上限金額（残り枠）

---

## データ仕様

### 利用するデータ

- `loadNisaData()` で取得した全レコード（`data/nisa.csv`）を使用する。
- CSVの `tsumitate_amount` カラムの合計値を積立投資枠の利用済み金額とする。
- CSVの `growth_amount` カラムの合計値を成長投資枠の利用済み金額とする。

### 集計ロジック

```
積立投資枠 利用済み = records の tsumitateAmount の合計
成長投資枠 利用済み = records の growthAmount の合計

積立投資枠 残り枠 = max(0, TSUMITATE_LIFETIME_LIMIT - 積立投資枠 利用済み)
成長投資枠 残り枠 = max(0, GROWTH_LIFETIME_LIMIT - 成長投資枠 利用済み)

積立投資枠 利用率 = (積立投資枠 利用済み / TSUMITATE_LIFETIME_LIMIT) * 100
成長投資枠 利用率 = (成長投資枠 利用済み / GROWTH_LIFETIME_LIMIT) * 100
```

### 定数追加

`lib/nisaConstants.ts` に以下の定数を追加する。

| 定数名 | 値 | 説明 |
|--------|-----|------|
| `TSUMITATE_LIFETIME_LIMIT` | `6000000` | 積立投資枠 生涯投資枠（600万円） |
| `GROWTH_LIFETIME_LIMIT` | `12000000` | 成長投資枠 生涯投資枠（1,200万円） |

---

## 改修対象ファイル

| ファイルパス | 変更内容 |
|-------------|---------|
| `lib/nisaConstants.ts` | `TSUMITATE_LIFETIME_LIMIT`・`GROWTH_LIFETIME_LIMIT` 定数を追加する。 |
| `src/app/page.tsx` | 積立投資枠・成長投資枠の利用済み金額を集計し、種別別利用状況セクションを追加する。 |
| `src/app/components/NisaCategoryChart.tsx` | 種別別利用状況を表示する新規コンポーネントを作成する。 |

---

## 実装方針

### `lib/nisaConstants.ts` の変更内容

```ts
export const TSUMITATE_LIFETIME_LIMIT = 6000000;
export const GROWTH_LIFETIME_LIMIT = 12000000;
```

### `src/app/components/NisaCategoryChart.tsx` の新規作成

種別別の生涯投資枠利用状況を表示するコンポーネントを作成する。

```tsx
import { formatAmount, TSUMITATE_LIFETIME_LIMIT, GROWTH_LIFETIME_LIMIT } from '@/lib/nisaConstants';

type Props = {
  readonly label: string;
  readonly usedAmount: number;
  readonly lifetimeLimit: number;
  readonly textColorClass: string;
  readonly bgColorClass: string;
};

export default function NisaCategoryChart({ label, usedAmount, lifetimeLimit, textColorClass, bgColorClass }: Props) {
  const remainingAmount = Math.max(0, lifetimeLimit - usedAmount);
  const usageRate = lifetimeLimit > 0 ? (usedAmount / lifetimeLimit) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className={`text-sm font-semibold ${textColorClass}`}>{usageRate.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-1">
        <div
          className={`h-3 rounded-full ${bgColorClass}`}
          style={{ width: `${Math.min(100, usageRate)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        利用済み: {formatAmount(usedAmount)} / {formatAmount(lifetimeLimit)}
        （残り {formatAmount(remainingAmount)}）
      </div>
    </div>
  );
}
```

### `src/app/page.tsx` の変更内容

1. `TSUMITATE_LIFETIME_LIMIT`・`GROWTH_LIFETIME_LIMIT` をインポートする。
2. `NisaCategoryChart` コンポーネントをインポートする。
3. 積立投資枠・成長投資枠の利用済み金額をそれぞれ集計する。
4. 既存のサマリーカード群の下に、種別別利用状況セクションを追加する。

```tsx
const tsumitateUsed = records.reduce((sum, r) => sum + r.tsumitateAmount, 0);
const growthUsed = records.reduce((sum, r) => sum + r.growthAmount, 0);
```

```tsx
{/* 種別別 生涯投資枠 利用状況 */}
<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
    種別別 生涯投資枠 利用状況
  </h3>
  <NisaCategoryChart
    label="つみたて投資枠"
    usedAmount={tsumitateUsed}
    lifetimeLimit={TSUMITATE_LIFETIME_LIMIT}
    textColorClass="text-blue-500"
    bgColorClass="bg-blue-500"
  />
  <NisaCategoryChart
    label="成長投資枠"
    usedAmount={growthUsed}
    lifetimeLimit={GROWTH_LIFETIME_LIMIT}
    textColorClass="text-green-500"
    bgColorClass="bg-green-500"
  />
</div>
```

---

## ワイヤーフレーム（詳細）

### PC表示

```
┌────────────────────────────────────────────────────┐
│  生涯投資枠 利用状況                                  │
│                                                    │
│            ╭──────────╮                            │
│           /  利用済み   \                           │
│          │  X,XXX,XXX円  │                         │
│           \  XX.X%     /                           │
│            ╰──────────╯                            │
│                                                    │
│  [生涯投資枠 18,000,000円] [利用済み X,XXX,XXX円]   │
│  [残り枠 X,XXX,XXX円]     [利用率 XX.X%]            │
│                                                    │
│  ──────────────────────────────────────────        │
│                                                    │
│  種別別 生涯投資枠 利用状況                          │
│                                                    │
│  つみたて投資枠                          XX.X%      │
│  ████████████████░░░░░░░░░░░░░░░░░░░░            │
│  利用済み: X,XXX,XXX円 / 6,000,000円（残り X,XXX,XXX円）│
│                                                    │
│  成長投資枠                              XX.X%      │
│  ████████████████░░░░░░░░░░░░░░░░░░░░            │
│  利用済み: X,XXX,XXX円 / 12,000,000円（残り X,XXX,XXX円）│
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 考慮事項・エッジケース

| ケース | 対応方針 |
|--------|---------|
| 利用済み金額が生涯上限を超過している | プログレスバーは100%で頭打ちにする（`Math.min(100, usageRate)`） |
| データが0件 | 利用済み0円・利用率0%として表示する |
| 利用済み金額が0円 | プログレスバーは0%（空）で表示する |

> 備考: 利用済み金額が0円のときはプログレスバー幅が `0%` となり、実装によっては `div` の `width: 0%` では塗りつぶし部分が視覚的に確認できない（`rounded-full` などの装飾も見えない）場合がある。
> そのため、0% 時でも「空のバー」であることが分かるように、背景トラックや枠線を表示する・最小幅を設けるなど、0% 幅要素の描画方法を実装時に検討すること。
