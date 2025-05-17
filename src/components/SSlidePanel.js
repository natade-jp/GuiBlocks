/**
 * SSlidePanel.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * 開閉可能なスライド式のパネルコンポーネント。
 * タイトルをクリックすることで、表示/非表示を切り替えられます。
 */
export default class SSlidePanel extends SBase {
	/**
	 * SSlidePanelのインスタンスを生成します。
	 * @param {string} [title] - パネルのタイトル
	 */
	constructor(title) {
		super("div");
		this.addClass(SBase.CLASS_NAME.SLIDEPANEL);

		/**
		 * タイトル用のテキストノード
		 * @type {Text}
		 */
		this.textnode = document.createTextNode(title ? title : "");

		/**
		 * タイトル領域（クリック可能）
		 * @type {HTMLSpanElement}
		 */
		this.legend = document.createElement("span");
		SBase._addClass(this.legend, SBase.CLASS_NAME.SLIDEPANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.appendChild(this.textnode);

		/**
		 * スライドする領域
		 * @type {HTMLDivElement}
		 */
		this.slide = document.createElement("div");
		SBase._addClass(this.slide, SBase.CLASS_NAME.SLIDEPANEL_SLIDE);
		this.slide.id = this.getId() + "_slide";

		/**
		 * コンテンツ配置用の領域
		 * @type {HTMLDivElement}
		 */
		this.body = document.createElement("div");
		SBase._addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";

		// クリックイベントで開閉を切り替える
		const that = this;
		const clickfunc = function () {
			that.setOpen(!that.isOpen());
		};
		this.legend.addEventListener("click", clickfunc);

		// 初期状態は閉じた状態
		this.setOpen(false);

		// スライド部分に内容コンテナを追加
		this.slide.appendChild(this.body);

		// 全体構造を構築
		const element = super.element;
		element.appendChild(this.legend);
		element.appendChild(this.slide);
	}

	/**
	 * パネルの開閉状態を設定します。
	 * @param {boolean} is_open - trueで開く、falseで閉じる
	 */
	setOpen(is_open) {
		this.is_open = is_open;
		if (this.is_open) {
			this.slide.style.maxHeight = this.body.scrollHeight + "px";
			SBase._addClass(this.legend, SBase.CLASS_NAME.OPEN);
			SBase._removeClass(this.legend, SBase.CLASS_NAME.CLOSE);
		} else {
			this.slide.style.maxHeight = null;
			SBase._addClass(this.legend, SBase.CLASS_NAME.CLOSE);
			SBase._removeClass(this.legend, SBase.CLASS_NAME.OPEN);
		}
	}

	/**
	 * 現在パネルが開いているかどうかを返します。
	 * @returns {boolean} trueなら開いている状態
	 */
	isOpen() {
		return this.is_open;
	}

	/**
	 * タイトル部分のテキストノードを取得します。
	 * @returns {Text} テキストノード
	 */
	getTextNode() {
		return this.textnode;
	}

	/**
	 * コンテンツを配置する要素を取得します。
	 * @returns {HTMLDivElement} コンテンツ領域
	 */
	getContainerElement() {
		return this.body;
	}

	/**
	 * コンテンツ領域をクリアします。
	 */
	clear() {
		SBase._removeChildNodes(this.body);
	}
}
