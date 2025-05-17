/**
 * SLabel.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * ラベル表示用のUIコンポーネントクラス。
 * 単純なテキスト表示を行います。
 */
export default class SLabel extends SBase {
	/**
	 * SLabelのインスタンスを生成します。
	 * @param {string} [title] - ラベルに表示するテキスト
	 */
	constructor(title) {
		super("div", title);
		this.addClass(SBase.CLASS_NAME.LABEL);
	}

	/**
	 * コンテンツ配置用の要素を取得します。
	 * 通常は自身のdiv要素を返します。
	 * @returns {HTMLElement} ラベルの要素
	 */
	getContainerElement() {
		return this.element;
	}
}
