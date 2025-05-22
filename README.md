# GuiBlocks

[![npm version](https://badge.fury.io/js/guiblocks.svg)](https://badge.fury.io/js/guiblocks)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**GuiBlocks** は、JavaScript で動的に GUI（グラフィカル・ユーザー・インターフェース）を構築するための軽量ライブラリです。HTML を直接記述することなく、JavaScript のコードで Web アプリケーションの UI を構成できます。
このライブラリは **Java の Swing** に影響を受けて設計しており、オブジェクト指向でコンポーネントを組み合わせて UI を構築できるようになっています。

詳しい説明は、[Github Pages](https://natade-jp.github.io/js-guiblocks/)で解説しています。

## 特長

* 部品（コンポーネント）を組み立ててGUIを構築
* PC、スマホのようなレスポンシブデザインに対応
* Canvas、ファイル操作、カラーピッカーなど豊富な部品
* 独自のレイアウト制御：IN / RIGHT / NEWLINE**

## 利用方法

### ステップ1：ライブラリの選択と読み込み

* `cjs/` – CommonJS（Node.js等向け）
* `esm/` – ES Modules（モダンブラウザ向け）
* `umd/` – UMD（HTMLスクリプトタグ向け）

いずれかの中にある `GuiBlocks.js` または `GuiBlocks.min.js` を読み込んでください。

### ステップ2：CSSの適用


GUI の外観を整えるために、`GuiBlocks.css` を HTML に読み込みます。

```html
<link rel="stylesheet" href="./build/umd/GuiBlocks.css">
```

### ステップ3：ライブラリの読み込み

```html
<script src="./build/umd/GuiBlocks.min.js"></script>
```

またはモジュール形式で

```javascript
import Blocks from "./build/esm/GuiBlocks.js";
```

---

## 使用例

```javascript
const panel = new Blocks.SPanel("デモパネル");
panel.putMe("container_id", Blocks.PUT_TYPE.IN);

const label = new Blocks.SLabel("こんにちは");
const button = new Blocks.SButton("クリック");

panel.put(label, Blocks.PUT_TYPE.IN);
label.put(button, Blocks.PUT_TYPE.RIGHT);

button.addListener(() => {
  alert("クリックされました！");
});
```

## 主なコンポーネント一覧

| コンポーネント名                           | 説明             |
| ---------------------------------- | -------------- |
| `SPanel`, `SGroupBox`                | 枠付きコンテナ        |
| `SSlidePanel`                       | 開閉式のスライドパネル    |
| `SLabel`, `SButton`                  | テキスト表示・クリック操作  |
| `SCheckBox`, `SComboBox`             | 入力選択用UI        |
| `SSlider`, `SProgressBar`            | 数値入力・進捗表示      |
| `SFileLoadButton`, `SFileSaveButton` | ファイル読み込み・保存操作  |
| `SCanvas`, `SCanvasGL`               | 2D描画およびWebGL描画 |
| `SImagePanel`                       | 画像表示           |
| `SColorPicker`                      | 色の選択           |
