# nisa-next-js-app

NISAの利用状況をグラフで視覚的に表示するWebアプリケーションです。
データはリポジトリ内のCSVファイルから読み込みます。

## 技術スタック

- **Next.js 16.1.6** - React フレームワーク（App Routerを使用）
- **React 19.2.4** - ユーザーインターフェース構築
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **Recharts 2** - グラフ描画
- **ESLint** - コード品質管理

## 機能

- NISA全体利用状況の可視化（生涯投資枠 1,800万円に対するドーナッツグラフ）
- 年別NISA利用状況の可視化（積み上げ棒グラフ＋テーブル）
- 年別内訳グラフ（つみたて投資枠・成長投資枠の各ドーナッツグラフ）
- CSVファイルからのデータ読み込み
- レスポンシブデザイン対応
- ダークモード対応（手動切替機能付き）
    - ライトモードとダークモードの2つのモードを手動で切り替え可能
    - ユーザーの選択はローカルストレージに保存され、ページ再読み込み時も維持されます
- TypeScriptによる型安全性

## 始め方

### 前提条件

- Node.js 20.x以上
- npm、yarn、またはpnpm

### インストール

1. リポジトリをクローン：
    ```bash
    git clone https://github.com/TakuyaFukumura/nisa-next-js-app.git
    ```
    ```bash
    cd nisa-next-js-app
    ```

2. 依存関係をインストール：
    ```bash
    npm install
    ```
   または
    ```bash
    yarn install
    ```
   または
    ```bash
    pnpm install
    ```

### 開発サーバーの起動

```bash
npm run dev
```

または

```bash
yarn dev
```

または

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて
アプリケーションを確認してください。

### ビルドと本番デプロイ

本番用にアプリケーションをビルドする：

```bash
npm run build
```

```bash
npm start
```

または

```bash
yarn build
```

```bash
yarn start
```

または

```bash
pnpm build
```

```bash
pnpm start
```

## プロジェクト構造

```
├── data/
│   └── nisa.csv             # NISAデータCSVファイル
├── lib/
│   └── csvLoader.ts         # CSVファイル読み込みユーティリティ
├── src/
│   └── app/
│       ├── components/      # Reactコンポーネント
│       │   ├── DarkModeProvider.tsx    # ダークモードProvider
│       │   ├── Header.tsx              # ヘッダーコンポーネント
│       │   ├── NisaOverallChart.tsx    # NISA全体グラフ
│       │   ├── NisaYearlyChart.tsx     # 年別グラフ
│       │   └── NisaYearlyDetailChart.tsx # 年別内訳グラフ
│       ├── yearly/
│       │   ├── page.tsx               # 年別利用状況画面
│       │   └── [year]/
│       │       └── page.tsx           # 年別内訳グラフ画面
│       ├── globals.css      # グローバルスタイル
│       ├── layout.tsx       # アプリケーションレイアウト
│       └── page.tsx         # NISA全体利用状況画面
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## データファイル

### data/nisa.csv

年ごとのNISA投資実績を記録するCSVファイルです。

```csv
year,tsumitate_amount,growth_amount
2024,400000,2400000
2025,400000,2400000
```

| カラム名 | 型 | 説明 |
|----------|----|------|
| `year` | 整数 | 投資年（西暦） |
| `tsumitate_amount` | 整数 | つみたて投資枠の利用額（円） |
| `growth_amount` | 整数 | 成長投資枠の利用額（円） |

### NISA制度の定数

| 定数名 | 値 | 説明 |
|--------|----|------|
| NISA_TOTAL_LIMIT | 1,800万円 | NISA生涯投資枠上限 |
| TSUMITATE_YEARLY_LIMIT | 120万円 | つみたて投資枠 年間上限 |
| GROWTH_YEARLY_LIMIT | 240万円 | 成長投資枠 年間上限 |
| YEARLY_TOTAL_LIMIT | 360万円 | 年間投資枠合計上限 |

## 開発

### テスト

このプロジェクトはJestを使用したテストが設定されています。

#### テストの実行

```bash
npm test
```

または

```bash
yarn test
```

または

```bash
pnpm test
```

#### テストの監視モード

```bash
npm run test:watch
```

#### カバレッジレポートの生成

```bash
npm run test:coverage
```

#### テストファイルの構成

- `__tests__/lib/csvLoader.test.ts`: CSVローダーのテスト
- `__tests__/src/app/components/DarkModeProvider.test.tsx`: ダークモードProvider のテスト
- `__tests__/src/app/components/Header.test.tsx`: ヘッダーコンポーネントのテスト

### リンティング

```bash
npm run lint
```

または

```bash
yarn lint
```

または

```bash
pnpm lint
```

### 型チェック

TypeScriptの型チェックは、ビルド時またはIDEで自動的に実行されます。

## CI/CD

このプロジェクトはGitHub Actionsを使用した継続的インテグレーション（CI）を設定しています。

### 自動テスト

以下の条件でCIが実行されます：

- `main`ブランチへのプッシュ時
- プルリクエストの作成・更新時

CIでは以下のチェックが行われます：

- ESLintによる静的解析
- TypeScriptの型チェック
- Jestを使用したユニットテストとインテグレーションテスト
- アプリケーションのビルド検証
- Node.js 20.x での動作確認

## 自動依存関係更新（Dependabot）

このプロジェクトでは、依存関係の安全性と最新化のために[Dependabot](https://docs.github.com/ja/code-security/dependabot)
を利用しています。

- GitHub Actionsおよびnpmパッケージの依存関係は**月次（月曜日 09:00 JST）**で自動チェック・更新されます。
- 更新内容は自動でプルリクエストとして作成されます。
- 詳細な設定は `.github/dependabot.yml` を参照してください。

## トラブルシューティング

### ポート競合

デフォルトのポート3000が使用中の場合：

```bash
npm run dev -- --port 3001
```
