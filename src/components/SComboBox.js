/**
 * SComboBox.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * コンボボックス（ドロップダウンリスト）を表すUIコンポーネントクラス。
 * テキストのリスト表示と選択が可能です。
 */
export default class SComboBox extends SBase {
	/**
	 * コンボボックスのインスタンスを生成します。
	 * @param {string[]} item - 初期リスト項目
	 */
	constructor(item) {
		super("select", item);
		this.addClass(SBase.CLASS_NAME.SELECT);
		this.addClass(SBase.CLASS_NAME.COMBOBOX);

		/**
		 * select要素
		 * @type {HTMLSelectElement}
		 */
		this.select = /** @type {HTMLSelectElement} */ (this.element);
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLElement} select要素
	 */
	getEnabledElement() {
		return this.select;
	}

	/**
	 * コンボボックスの選択変更時イベントリスナーを追加します。
	 * @param {EventListenerOrEventListenerObject} func - コールバック関数
	 */
	addListener(func) {
		this.select.addEventListener("change", func, false);
	}

	/**
	 * コンボボックスのリストにテキストを設定します。
	 * @param {string|string[]} title - 単一または複数の項目文字列
	 */
	setText(title) {
		if (!title) {
			return;
		}
		// 1つの文字列のみならば、配列化する
		if (typeof title === "string") {
			title = [title];
		}
		/**
		 * @type {HTMLSelectElement}
		 */
		const select = /** @type {HTMLSelectElement} */ (this.element);
		// 内部の要素を全部消去する
		let child = select.lastChild;
		while (child) {
			select.removeChild(child);
			child = select.lastChild;
		}
		let i = 0;
		// 追加していく
		for (i = 0; i < title.length; i++) {
			const option_node = document.createElement("option");
			option_node.text = title[i].toString();
			option_node.value = title[i].toString();
			select.appendChild(option_node);
		}
	}

	/**
	 * コンボボックスに登録されているテキスト一覧を取得します。
	 * @returns {string[]} テキストの配列
	 */
	getText() {
		/**
		 * @type {HTMLSelectElement}
		 */
		const select = /** @type {HTMLSelectElement} */ (this.element);
		const child = select.children;
		let i = 0;
		const output = [];
		for (i = 0; i < child.length; i++) {
			if (child[i].tagName === "OPTION") {
				/**
				 * @type {HTMLOptionElement}
				 */
				// @ts-ignore
				const option = child[i];
				output[output.length] = option.text;
			}
		}
		return output;
	}

	/**
	 * 指定された値を選択状態に設定します。
	 * @param {string} text - 選択したい項目の値
	 */
	setSelectedItem(text) {
		const child = this.select.children;
		let i = 0,
			j = 0;
		for (i = 0; i < child.length; i++) {
			if (child[i].tagName === "OPTION") {
				/**
				 * @type {HTMLOptionElement}
				 */
				// @ts-ignore
				const option = child[i];
				if (option.value === text.toString()) {
					this.select.selectedIndex = j;
					break;
				}
				j++;
			}
		}
	}

	/**
	 * 現在選択されている項目の値を取得します。
	 * @returns {string} 選択された値。未選択の場合は空文字
	 */
	getSelectedItem() {
		const child = this.select.children;
		const selectindex = this.select.selectedIndex;
		let i = 0,
			j = 0;
		for (i = 0; i < child.length; i++) {
			if (child[i].tagName === "OPTION") {
				/**
				 * @type {HTMLOptionElement}
				 */
				// @ts-ignore
				const option = child[i];
				if (selectindex === j) {
					return option.value;
				}
				j++;
			}
		}
		return "";
	}
}
