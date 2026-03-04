# NISA内訳画面 年ナビゲーション機能 仕様書

## 概要

NISA内訳画面（`/yearly/[year]`）において、前後の年に移動できるナビゲーション機能を追加する。

---

## 現状

現在のNISA内訳画面では、ページ上部に以下の形式で年が表示されている。

```
{年}年 NISA内訳
```

前後の年に移動するには、一旦「年別利用状況」画面（`/yearly`）に戻り、目的の年の行にある `→` リンクをクリックする必要がある。

---

## 要件

### 機能要件

- NISA内訳画面で前後の年に直接移動できる。
- 前の年が存在しない場合（データの最初の年）、前へのナビゲーションを無効化する。
- 次の年が存在しない場合（データの最後の年）、次へのナビゲーションを無効化する。

### 非機能要件

- 既存の画面レイアウト・デザインを極力維持する。
- ダークモードに対応する。
- アクセシビリティ（`aria-label`）を考慮する。

---

## UI設計

### ヘッダー部分のレイアウト変更

現在の表示：

```
{年}年 NISA内訳
```

変更後の表示：

```
◀  2025年  ▶
  NISA内訳
```

- `◀`（前の年へ）と `▶`（次の年へ）をクリックすることで年を切り替える。
- 年号の表示（例：`2025年`）は中央に配置する。
- `NISA内訳` の文字は次の行に表示する。
- データが存在しない前後の年へのボタンは非活性（グレーアウト）にし、クリック不可とする。

### ワイヤーフレーム

```
┌─────────────────────────────────────┐
│      ◀  2025年  ▶                   │
│         NISA内訳                    │
│                                     │
│  [つみたて投資枠グラフ] [成長投資枠グラフ] │
│                                     │
│  サマリー                           │
│  ...                                │
│                                     │
│        ← 年別利用状況に戻る         │
└─────────────────────────────────────┘
```

---

## データ仕様

### 利用するデータ

- `loadNisaData()` で取得した全レコード（`data/nisa.csv`）の `year` 一覧を使用する。
- 前の年・次の年の存在有無は、取得した全レコードの年リストを基に判定する。

### 前後年の判定ロジック

```
全レコードを year の昇順でソートし、現在表示中の year のインデックスを特定する。

- インデックスが 0 → 前の年は存在しない（◀ を非活性化）
- インデックスが 最大値 → 次の年は存在しない（▶ を非活性化）
```

---

## URL仕様

| 操作 | 遷移先URL |
|------|-----------|
| 前の年へ | `/yearly/{前の年}` |
| 次の年へ | `/yearly/{次の年}` |

---

## 改修対象ファイル

| ファイルパス | 変更内容 |
|-------------|---------|
| `src/app/yearly/[year]/page.tsx` | 年ナビゲーション用UIを追加する。ヘッダー部分を 1 行目 `◀ {年}年 ▶`、2 行目 `NISA内訳` の 2 行構成に変更する。 |

---

## 実装方針

### `src/app/yearly/[year]/page.tsx` の変更内容

1. `loadNisaData()` で取得した全レコードから、現在の年の前後の年を特定する。
2. ヘッダー部分を以下のように変更する。
   - 前の年が存在する場合：`◀` を `<Link href="/yearly/{前の年}">` としてレンダリングする。
   - 前の年が存在しない場合：`◀` をテキストとしてレンダリングし、`opacity-30` などで非活性を表現する。
   - 次の年が存在する場合：`▶` を `<Link href="/yearly/{次の年}">` としてレンダリングする。
   - 次の年が存在しない場合：`▶` をテキストとしてレンダリングし、`opacity-30` などで非活性を表現する。
3. `NISA内訳` の文字を年号の次の行に表示する。

### 実装イメージ（擬似コード）

```tsx
// year はレコード単位でユニークであることを前提とする（同一年のレコードが複数存在する場合は Set でユニーク化すること）
const sortedYears = [...new Set(records.map((r) => r.year))].sort((a, b) => a - b);
const currentIndex = sortedYears.indexOf(yearNum);

// currentIndex が -1 の場合は notFound() で処理済みのため、ここには到達しない想定
// ただし実装時は念のため明示的にガードすること
// if (currentIndex === -1) { notFound(); }

const prevYear = currentIndex > 0 ? sortedYears[currentIndex - 1] : null;
const nextYear = currentIndex < sortedYears.length - 1 ? sortedYears[currentIndex + 1] : null;
```

```tsx
<div className="flex items-center justify-center gap-4 mb-2">
  {prevYear !== null ? (
    <Link
      href={`/yearly/${prevYear}`}
      aria-label={`${prevYear}年の内訳へ`}
      className="text-2xl text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      ◀
    </Link>
  ) : (
    <span
      className="text-2xl text-gray-400 dark:text-gray-600 opacity-30 cursor-default"
      aria-disabled="true"
      aria-label="前の年の内訳へ（移動不可）"
    >
      ◀
    </span>
  )}
  <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">{yearNum}年</span>
  {nextYear !== null ? (
    <Link
      href={`/yearly/${nextYear}`}
      aria-label={`${nextYear}年の内訳へ`}
      className="text-2xl text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      ▶
    </Link>
  ) : (
    <span
      className="text-2xl text-gray-400 dark:text-gray-600 opacity-30 cursor-default"
      aria-disabled="true"
      aria-label="次の年の内訳へ（移動不可）"
    >
      ▶
    </span>
  )}
</div>
<h1 className="text-3xl font-bold text-center mb-6">NISA内訳</h1>
```

---

## 考慮事項・エッジケース

| ケース | 対応方針 |
|--------|---------|
| データが1件のみ | 前後ともに非活性 |
| データの最初の年を表示中 | `◀` のみ非活性 |
| データの最後の年を表示中 | `▶` のみ非活性 |
| URLに存在しない年を指定 | 既存の `notFound()` ハンドリングで対応済み |
