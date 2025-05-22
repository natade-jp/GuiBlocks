# Architecture.md

## 概要

**GuiBlocks**は、JavaScriptのみで動的なWeb GUIを構築できる軽量なUIコンポーネント・ライブラリです。
JavaのSwingアーキテクチャを参考に、オブジェクト指向でUIを組み立てる思想がベースです。
各コンポーネントはHTML/CSSをラップし、`put/putMe`による柔軟なレイアウト、イベント登録、状態管理機能を備えます。

---

## ディレクトリ構造・主要ファイル

```
/
├── components/
│   ├── SBase.js
│   ├── SPanel.js
│   ├── SButton.js
│   ├── SLabel.js
│   ├── SCheckBox.js
│   ├── SComboBox.js
│   ├── SSlider.js
│   ├── SProgressBar.js
│   ├── SGroupBox.js
│   ├── SSlidePanel.js
│   ├── SFileLoadButton.js
│   ├── SFileSaveButton.js
│   ├── SCanvas.js
│   ├── SCanvasGL.js
│   ├── SImagePanel.js
│   ├── SColorPicker.js
│   └── ...（各種UI部品）
├── GuiBlocks.js
├── GuiBlocks.css
└── README.md
```

---

## コンポーネントアーキテクチャ

### 1. **基底クラス（SBase）**

* すべてのUI部品は`SBase`を継承します。
* 主な責務：

  * HTML要素（DOM）の生成・保持
  * テキスト・状態・可視性・有効無効の管理
  * レイアウト（IN/RIGHT/NEWLINE）制御
  * 基本スタイル/クラス名付与
  * イベント伝搬や削除処理
* 例: `SBase#getContainerElement()`, `setText()`, `setEnabled()`, `put()`, `putMe()` など

### 2. **派生コンポーネント群**

* **SPanel**: シンプルな枠付きパネル、legend（タイトル）とbody（コンテンツ領域）
* **SSlidePanel**: タイトルクリックで開閉できるスライド式パネル。CSSアニメーション付き
* **SGroupBox**: フィールドセット＋タイトル＋枠のあるコンテナ
* **SLabel/SButton**: テキスト表示、ボタンクリック等の基本UI
* **SCheckBox/SComboBox**: 入力フォーム部品（チェックボックス、セレクトボックス）
* **SSlider/SProgressBar**: 数値入力用のスライダー、進捗バー
* **SFileLoadButton/SFileSaveButton**: ファイル入出力のための特殊なボタン
* **SCanvas/SCanvasGL**: 2D/3D描画用のcanvasラッパー
* **SImagePanel**: 画像表示、CanvasやImageData、Blobに対応
* **SColorPicker**: HSLカラー形式のカラーピッカー部品

---

### 3. **モジュールエントリポイント**

* `GuiBlocks.js`で各コンポーネントをオブジェクトとして集約。
  `import GuiBlocks from 'guiblocks'`で利用可能

---

## レイアウトと配置

* **put/putMe**メソッドで、各UI部品同士の「親子」「横並び」「改行」配置を制御（IN/RIGHT/NEWLINE）
* \*\*getContainerElement()\*\*で配置先HTML要素を取得、内部的にはDOM操作でツリー構造を組み立て

---

## スタイル

* **GuiBlocks.css**に全コンポーネント共通・個別のデザインルールを記述

  * レスポンシブデザイン（スマホ最適化）にも配慮
  * クラス名でCSSとJavaScript部品を連携（例：`SCOMPONENT_Panel`等）

---

## 拡張性と設計思想

* Swingライクな設計。各部品は継承・カスタマイズ可能
* 内部状態はJavaScriptクラスで管理、直接HTMLを操作せず抽象化されたAPIでUIを構築
* 最小限の依存（`ntcolor`のみ色操作に使用）、素のJS/HTML/CSS技術のみ

---

## 典型的な利用例

```javascript
import GuiBlocks from "guiblocks";
const panel = new GuiBlocks.SPanel("デモパネル");
const label = new GuiBlocks.SLabel("こんにちは");
const button = new GuiBlocks.SButton("OK");

panel.put(label, GuiBlocks.PUT_TYPE.IN);
label.put(button, GuiBlocks.PUT_TYPE.RIGHT);
document.body.appendChild(panel.element);

button.addListener(() => { alert("クリックされました！"); });
```

---

## 依存関係

* 基本：ESモジュール/UMD形式の単体ライブラリ
* 色操作のみに`ntcolor`を利用（ColorPicker等で使用）

---

## 参考

* [README.md（公式）](./README.md)
* [公式ドキュメント](https://natade-jp.github.io/js-guiblocks/)

---
