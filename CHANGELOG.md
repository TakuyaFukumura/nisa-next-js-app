# Changelog

このプロジェクトのすべての変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいており、
このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/) に従っています。

## [Unreleased]

## [0.2.0] - 2026-03-02

### 追加

- NISA利用状況可視化機能の実装
  - NISA全体利用状況画面（`/`）: 生涯投資枠（1,800万円）の利用状況をドーナッツグラフで表示
  - 年別利用状況画面（`/yearly`）: 各年の投資額を積み上げ棒グラフとテーブルで表示
  - 年別内訳グラフ画面（`/yearly/[year]`）: 特定年のつみたて投資枠・成長投資枠の利用状況をドーナッツグラフで表示
- CSVファイルからNISAデータを読み込む `lib/csvLoader.ts` の実装
- Rechartsライブラリによるグラフ描画
- ヘッダーへのナビゲーションリンクの追加

### 削除

- SQLiteデータベース連携機能（`lib/database.ts`、`src/app/api/message/route.ts`）
- `better-sqlite3` パッケージへの依存

## [0.1.0] - 2026-03-02

### 追加

- 初期リリース
