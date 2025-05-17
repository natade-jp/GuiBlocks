/**
 * SCheckBox.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * チェックボックスを表すUIコンポーネントクラス。
 * ラベル付きで表示され、選択状態の取得・変更が可能です。
 */
export default class SCheckBox extends SBase {
	/**
	 * SCheckBoxのインスタンスを生成します。
	 * @param {string} [title] - チェックボックスに表示するテキスト
	 */
	constructor(title) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.CHECKBOX);

		/**
		 * チェックボックスのinput要素
		 * @type {HTMLInputElement}
		 */
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = this.getId() + "_checkbox";
		checkbox.className = SBase.CLASS_NAME.CHECKBOX_IMAGE;
		this.checkbox = checkbox;

		/**
		 * チェックボックスに表示するテキストノード
		 * @type {Text}
		 */
		this.textnode = document.createTextNode(title ? title : "");

		const element = this.element;
		element.appendChild(this.checkbox);
		element.appendChild(this.textnode);
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLElement} チェックボックス要素
	 */
	getEnabledElement() {
		return this.checkbox;
	}

	/**
	 * テキストノードを取得します。
	 * @returns {Text} ラベル用のテキストノード
	 */
	getTextNode() {
		return this.textnode;
	}

	/**
	 * input要素ノードを取得します。
	 * @returns {HTMLInputElement} チェックボックスのinput要素
	 */
	getElementNode() {
		return this.checkbox;
	}

	/**
	 * ラベルの位置を設定します。
	 * @param {number} LABEL_POSITION - ラベル位置定数（SBase.LABEL_POSITION）
	 */
	setLabelPosition(LABEL_POSITION) {
		// ラベルかどうか確認
		const element = this.element;
		const textnode = this.getTextNode();
		const elementnode = this.getElementNode();
		// 中身を一旦消去する
		SBase._removeChildNodes(element);
		// 配置を設定する
		if (LABEL_POSITION === SBase.LABEL_POSITION.LEFT) {
			// ラベル内のテキストは左側
			element.appendChild(textnode);
			element.appendChild(elementnode);
		} else {
			// ラベルのテキストは右側
			element.appendChild(elementnode);
			element.appendChild(textnode);
		}
		return;
	}

	/**
	 * チェックボックスのサイズを設定します。
	 * @param {number} size - サイズ（pxなど）
	 * @throws {string} 数値以外が指定された場合に例外をスロー
	 */
	setCheckBoxImageSize(size) {
		if (typeof size !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.checkbox.style.height = size.toString() + this.unit;
		this.checkbox.style.width = size.toString() + this.unit;
	}

	/**
	 * チェック状態変更時のイベントリスナーを追加します。
	 * @param {EventListenerOrEventListenerObject} func - コールバック関数
	 */
	addListener(func) {
		this.checkbox.addEventListener("change", func, false);
	}

	/**
	 * チェック状態を設定します。
	 * @param {boolean} ischecked - trueでチェック状態、falseで非チェック
	 */
	setChecked(ischecked) {
		this.checkbox.checked = ischecked;
	}

	/**
	 * 現在のチェック状態を取得します。
	 * @returns {boolean} チェックされていればtrue
	 */
	isChecked() {
		return this.checkbox.checked;
	}
}
