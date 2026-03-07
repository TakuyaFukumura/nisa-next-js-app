# ヘッダーメニュー「NISA内訳」追加 仕様書

## 概要

ヘッダーメニューに「NISA内訳」項目を追加し、積立投資枠・成長投資枠それぞれの**生涯投資枠**の利用状況を一覧できる専用ページ（`/breakdown`）へ遷移できるようにする。

---

## 既存仕様との関係・優先順位

- 既存の仕様書 `docs/nisa-lifetime-limit-by-category.md` では、トップページ（`/`）に生涯投資枠の種別別内訳を表示するための仕様が定義されている。
- `NisaCategoryChart` コンポーネントおよび `TSUMITATE_LIFETIME_LIMIT` / `GROWTH_LIFETIME_LIMIT` 定数は、**`docs/nisa-lifetime-limit-by-category.md` を正とし、トップページ `/` と本ページ `/breakdown` で共用する**ことを前提とする。
- 本仕様書では、ヘッダーメニューへの「NISA内訳」追加と、新規ページ `/breakdown` 固有の挙動・レイアウトのみを定義し、コンポーネント実装や定数値そのものの再定義は行わない。
- 万一、両仕様間で `NisaCategoryChart` や生涯投資枠定数の定義に差異が生じた場合は、`docs/nisa-lifetime-limit-by-category.md` を優先し、本書を更新して整合性を取るものとする。

---

## 現状

### ヘッダーメニュー構成（現状）

| 表示名 | リンク先 | 説明 |
|--------|---------|------|
| 全体   | `/`     | 生涯投資枠の合計利用状況 |
| 年別   | `/yearly` | 年ごとの投資額一覧 |

### 課題

- トップ画面（`/`）では生涯投資枠の**合計**のみが確認できる。
- 積立投資枠・成長投資枠の生涯投資枠に対する**種別ごとの利用状況**を素早く確認するための導線がない。
- 年別詳細ページ（`/yearly/[year]`）は「NISA内訳」というタイトルを持つが、**特定の年**の投資枠利用状況を表示するものであり、**生涯累計の内訳**とは異なる。

---

## 要件

### 機能要件

- ヘッダーメニューに「NISA内訳」リンクを追加する。
- 「NISA内訳」リンクは新規ページ `/breakdown` へ遷移する。
- `/breakdown` ページでは以下を表示する。
  - 積立投資枠の生涯投資枠（600万円）に対する利用済み金額・残り枠・利用率
  - 成長投資枠の生涯投資枠（1,200万円）に対する利用済み金額・残り枠・利用率
  - 各種別の利用状況をプログレスバーで視覚的に表現する
- `/breakdown` がアクティブな場合、ヘッダーメニューの「NISA内訳」リンクをアクティブ状態でハイライト表示する。

### 非機能要件

- 既存の画面レイアウト・デザインを極力維持する。
- ダークモードに対応する。
- レスポンシブデザイン（モバイル・タブレット・PC）に対応する。

---

## ヘッダーメニュー仕様

### 変更後のメニュー構成

| 表示名   | リンク先     | 説明                           |
|---------|------------|-------------------------------|
| 全体    | `/`         | 生涯投資枠の合計利用状況          |
| NISA内訳| `/breakdown`| 種別別の生涯投資枠利用状況        |
| 年別    | `/yearly`   | 年ごとの投資額一覧               |

### ナビゲーションの順序

「全体」と「年別」の間に「NISA内訳」を配置する。

### アクティブ状態の判定

`pathname === '/breakdown'` のときに「NISA内訳」リンクをアクティブ状態にする。

---

## 新規ページ（`/breakdown`）仕様

### URLパス

`/breakdown`

### ページタイトル（`<h1>`）

```
NISA内訳
```

### 表示内容

#### 種別別 生涯投資枠 利用状況カード

各種別について以下の情報を表示する。

| 項目 | 内容 |
|------|------|
| 種別名 | 「つみたて投資枠」または「成長投資枠」 |
| プログレスバー | 利用率（%）を幅で表現 |
| 利用率 | `X.X%` 形式（小数第1位まで） |
| 利用済み金額 | `formatAmount()` でフォーマットした金額 |
| 生涯上限金額 | 積立：6,000,000円 / 成長：12,000,000円 |
| 残り枠 | `max(0, 上限 - 利用済み)` |

---

## UI設計

### ワイヤーフレーム（PC表示）

```
┌────────────────────────────────────────────────────────┐
│ [nisa]  全体  NISA内訳  年別              ☀️ ライトモード│  ← ヘッダー
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ NISA内訳                                               │  ← h1
│                                                        │
│ ┌──────────────────────────────────────────────────┐  │
│ │  種別別 生涯投資枠 利用状況                         │  │
│ │                                                  │  │
│ │  つみたて投資枠                         XX.X%     │  │
│ │  ████████████████░░░░░░░░░░░░░░░░░░░           │  │
│ │  利用済み: X,XXX,XXX円 / 6,000,000円            │  │
│ │  （残り X,XXX,XXX円）                            │  │
│ │                                                  │  │
│ │  成長投資枠                             XX.X%     │  │
│ │  ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░           │  │
│ │  利用済み: X,XXX,XXX円 / 12,000,000円           │  │
│ │  （残り X,XXX,XXX円）                            │  │
│ │                                                  │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│               [← 全体利用状況に戻る]                   │
└────────────────────────────────────────────────────────┘
```

### ワイヤーフレーム（モバイル表示）

```
┌──────────────────────────┐
│ ☰ nisa          ☀️      │  ← ヘッダー（ハンバーガーメニュー）
└──────────────────────────┘

  ↓ ☰ タップ時のメニュー展開

┌──────────────────────────┐
│   全体                   │
│   NISA内訳               │
│   年別                   │
└──────────────────────────┘

┌──────────────────────────┐
│ NISA内訳                 │  ← h1
│                          │
│ ┌──────────────────────┐ │
│ │ 種別別 生涯投資枠     │ │
│ │ 利用状況             │ │
│ │                      │ │
│ │ つみたて投資枠        │ │
│ │                XX.X% │ │
│ │ ████████░░░░░░       │ │
│ │ 利用済み:            │ │
│ │ X,XXX,XXX円          │ │
│ │ / 6,000,000円        │ │
│ │ （残り X,XXX,XXX円）  │ │
│ │                      │ │
│ │ 成長投資枠           │ │
│ │                XX.X% │ │
│ │ ████░░░░░░░░░░       │ │
│ │ 利用済み:            │ │
│ │ X,XXX,XXX円          │ │
│ │ / 12,000,000円       │ │
│ │ （残り X,XXX,XXX円）  │ │
│ └──────────────────────┘ │
│                          │
│ [← 全体利用状況に戻る]   │
└──────────────────────────┘
```

---

## データ仕様

### 利用するデータ

- `loadNisaData()` で取得した全レコード（`data/nisa.csv`）を使用する。
- CSVの `tsumitate_amount` カラムの合計値を積立投資枠の生涯利用済み金額とする。
- CSVの `growth_amount` カラムの合計値を成長投資枠の生涯利用済み金額とする。

### 集計ロジック

```
積立投資枠 利用済み = records の tsumitateAmount の合計
成長投資枠 利用済み = records の growthAmount の合計

積立投資枠 残り枠 = max(0, TSUMITATE_LIFETIME_LIMIT - 積立投資枠 利用済み)
成長投資枠 残り枠 = max(0, GROWTH_LIFETIME_LIMIT - 成長投資枠 利用済み)

積立投資枠 利用率 = TSUMITATE_LIFETIME_LIMIT > 0 ? (積立投資枠 利用済み / TSUMITATE_LIFETIME_LIMIT) * 100 : 0
成長投資枠 利用率 = GROWTH_LIFETIME_LIMIT > 0 ? (成長投資枠 利用済み / GROWTH_LIFETIME_LIMIT) * 100 : 0
```

### 定数追加

`lib/nisaConstants.ts` に以下の定数を追加する。

| 定数名 | 値 | 説明 |
|--------|-----|------|
| `TSUMITATE_LIFETIME_LIMIT` | `6000000` | 積立投資枠 生涯投資枠（600万円） |
| `GROWTH_LIFETIME_LIMIT` | `12000000` | 成長投資枠 生涯投資枠（1,200万円） |

---

## 改修対象ファイル

| ファイルパス | 変更種別 | 変更内容 |
|-------------|---------|---------|
| `lib/nisaConstants.ts` | 変更 | `TSUMITATE_LIFETIME_LIMIT`・`GROWTH_LIFETIME_LIMIT` 定数を追加する。 |
| `src/app/components/Header.tsx` | 変更 | ナビゲーションに「NISA内訳」リンク（`/breakdown`）を追加する。 |
| `src/app/breakdown/page.tsx` | 新規作成 | 種別別の生涯投資枠利用状況を表示するページを作成する。 |
| `src/app/components/NisaCategoryChart.tsx` | 新規作成 | 種別別利用状況を表示する再利用可能なコンポーネントを作成する。 |

---

## 実装方針

### `lib/nisaConstants.ts` の変更内容

```ts
export const TSUMITATE_LIFETIME_LIMIT = 6000000;
export const GROWTH_LIFETIME_LIMIT = 12000000;
```

### `src/app/components/Header.tsx` の変更内容

デスクトップナビゲーション（`.hidden.md:flex`）とモバイルメニュー（`#mobile-menu`）の両方に「NISA内訳」リンクを追加する。

```tsx
// デスクトップメニューへの追加例（「全体」と「年別」の間に挿入）
<Link href="/breakdown" className={navLinkClass('/breakdown')}>
    NISA内訳
</Link>
```

モバイルメニューにも同様のリンクを追加する。

現在の `navLinkClass` 関数は、`pathname === href` による完全一致に加え、`/yearly` に対しては `pathname.startsWith('/yearly')` を用いたサブルート対応の特別扱いを行っている。`/breakdown` にサブルート（例：`/breakdown/[category]`）を追加する場合は、同様に `pathname.startsWith('/breakdown')` を用いた条件を `navLinkClass` に追加する必要がある。

### `src/app/components/NisaCategoryChart.tsx` の新規作成

種別別の生涯投資枠利用状況を表示するコンポーネントを作成する。

```tsx
'use client';

import {formatAmount} from '../../../lib/nisaConstants';

type Props = {
    readonly label: string;
    readonly usedAmount: number;
    readonly lifetimeLimit: number;
    readonly textColorClass: string;
    readonly bgColorClass: string;
};

export default function NisaCategoryChart({label, usedAmount, lifetimeLimit, textColorClass, bgColorClass}: Props) {
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
                    style={{width: `${Math.min(100, usageRate)}%`}}
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

### `src/app/breakdown/page.tsx` の新規作成

```tsx
import Link from 'next/link';
import {loadNisaData} from '../../../lib/csvLoader';
import {GROWTH_LIFETIME_LIMIT, TSUMITATE_LIFETIME_LIMIT} from '../../../lib/nisaConstants';
import NisaCategoryChart from '../components/NisaCategoryChart';

export default function BreakdownPage() {
    const records = loadNisaData();
    const {tsumitateUsed, growthUsed} = records.reduce(
        (acc, r) => ({
            tsumitateUsed: acc.tsumitateUsed + r.tsumitateAmount,
            growthUsed: acc.growthUsed + r.growthAmount,
        }),
        {tsumitateUsed: 0, growthUsed: 0},
    );

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 lg:p-6">
            <main className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    NISA内訳
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        種別別 生涯投資枠 利用状況
                    </h2>
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

                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        ← 全体利用状況に戻る
                    </Link>
                </div>
            </main>
        </div>
    );
}
```

---

## 考慮事項・エッジケース

| ケース | 対応方針 |
|--------|---------|
| 利用済み金額が生涯上限を超過している | プログレスバーは100%で頭打ちにする（`Math.min(100, usageRate)`） |
| データが0件 | 利用済み0円・利用率0%として表示する |
| 利用済み金額が0円 | プログレスバーは0%（空）で表示する |
| 生涯投資上限が0の場合（異常値） | 利用率は0%として表示する（ゼロ除算ガード） |

> 備考: 利用済み金額が0円のときはプログレスバー幅が `0%` となり、`rounded-full` などの装飾が視覚的に確認できない場合がある。
> 最小幅を設ける・背景トラックや枠線を表示するなど、0%時の描画方法を実装時に検討すること。
