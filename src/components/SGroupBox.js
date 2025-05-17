/**
 * SGroupBox.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * グループボックスを表すUIコンポーネントクラス。
 * 枠で囲まれたタイトル付きのコンテナを提供します。
 */
export default class SGroupBox extends SBase {
	/**
	 * SGroupBoxのインスタンスを生成します。
	 * @param {string} [title] - グループボックスのタイトル
	 */
	constructor(title) {
		super("fieldset");
		this.addClass(SBase.CLASS_NAME.GROUPBOX);

		/**
		 * グループのタイトル部分
		 * @type {HTMLLegendElement}
		 */
		this.legend = document.createElement("legend");
		SBase._addClass(this.legend, SBase.CLASS_NAME.GROUPBOX_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.textContent = title;

		/**
		 * グループ内のコンテンツを格納する要素
		 * @type {HTMLDivElement}
		 */
		this.body = document.createElement("div");
		SBase._addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";

		const fieldset = /** @type {HTMLFieldSetElement} */ (this.element);
		fieldset.appendChild(this.legend);
		fieldset.appendChild(this.body);
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLElement} fieldset要素
	 */
	getEnabledElement() {
		return this.element;
	}

	/**
	 * コンテンツ配置用の要素を取得します。
	 * @returns {HTMLDivElement} グループ内のコンテンツエリア
	 */
	getContainerElement() {
		return this.body;
	}

	/**
	 * グループ内のすべての子要素を削除します。
	 */
	clear() {
		SBase._removeChildNodes(this.body);
	}
}
