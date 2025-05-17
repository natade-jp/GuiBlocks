/**
 * SButton.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * ボタンクラス
 * 基本ボタンUI部品を提供します。
 */
export default class SButton extends SBase {
	/**
	 * SButtonのインスタンスを生成します。
	 * @param {string} [title] ボタンに表示するテキスト
	 */
	constructor(title) {
		super("input", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);

		/**
		 * @type {HTMLInputElement}
		 */
		// @ts-ignore
		const element = this.element;

		element.type = "button";
	}

	/**
	 * Value属性を持つ編集可能なノードを取得します。
	 * @returns {HTMLInputElement} ボタン要素
	 */
	getEditableNodeForValue() {
		return /** @type {HTMLInputElement} */ (this.element);
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLElement} ボタン要素
	 */
	getEnabledElement() {
		return this.element;
	}

	/**
	 * ボタンのクリックイベントリスナーを追加します。
	 * @param {EventListenerOrEventListenerObject} func クリック時に呼び出される関数
	 */
	addListener(func) {
		this.element.addEventListener("click", func, false);
	}
}
