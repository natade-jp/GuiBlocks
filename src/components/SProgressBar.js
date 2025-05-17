/**
 * SProgressBar.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * プログレスバーを表すUIコンポーネントクラス。
 * 値の進捗状況を視覚的に表示します。
 */
export default class SProgressBar extends SBase {
	/**
	 * SProgressBarのインスタンスを生成します。
	 * @param {number} [min=0.0] - プログレスバーの最小値
	 * @param {number} [max=1.0] - プログレスバーの最大値
	 * @throws {string} 不正な引数が渡された場合に例外をスロー
	 */
	constructor(min, max) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.PROGRESSBAR);

		this.min = 0.0;
		this.max = 0.0;
		this.value = min;
		this.is_indeterminate = false;

		if (arguments.length === 0) {
			this.min = 0.0;
			this.max = 1.0;
		} else if (arguments.length === 2) {
			this.min = min;
			this.max = max;
		} else {
			throw "IllegalArgumentException";
		}

		/**
		 * 表示用のprogress要素
		 * @type {HTMLProgressElement}
		 */
		this.progress = document.createElement("progress");
		this.element.appendChild(this.progress);
		this.progress.id = this.getId() + "_progress";
		this.progress.className = SBase.CLASS_NAME.PROGRESSBAR;
		// 内部の目盛りは0-1を使用する
		this.progress.value = 0.0;
		this.progress.max = 1.0;
	}

	/**
	 * プログレスバーの最大値を設定します。
	 * @param {number} max - 最大値
	 */
	setMaximum(max) {
		this.max = max;
	}

	/**
	 * プログレスバーの最小値を設定します。
	 * @param {number} min - 最小値
	 */
	setMinimum(min) {
		this.min = min;
	}

	/**
	 * プログレスバーの最大値を取得します。
	 * @returns {number} 最大値
	 */
	getMaximum() {
		return this.max;
	}

	/**
	 * プログレスバーの最小値を取得します。
	 * @returns {number} 最小値
	 */
	getMinimum() {
		return this.min;
	}

	/**
	 * プログレスバーの現在値を設定します。
	 * @param {number} value - 現在値
	 */
	setValue(value) {
		this.value = value;
		this.progress.value = this.getPercentComplete();
	}

	/**
	 * プログレスバーの現在値を取得します。
	 * @returns {number} 現在値
	 */
	getValue() {
		return this.value;
	}

	/**
	 * プログレスバーの不確定状態を設定します。
	 * @param {boolean} is_indeterminate - trueで不確定状態
	 */
	setIndeterminate(is_indeterminate) {
		this.is_indeterminate = is_indeterminate;
		if (this.is_indeterminate) {
			this.progress.removeAttribute("value");
		} else {
			this.setValue(this.value);
		}
	}

	/**
	 * プログレスバーが不確定状態かどうかを取得します。
	 * @returns {boolean} trueなら不確定状態
	 */
	isIndeterminate() {
		return this.is_indeterminate;
	}

	/**
	 * 進捗率を取得します。
	 * @returns {number} 進捗率（0.0〜1.0）
	 */
	getPercentComplete() {
		const delta = this.max - this.min;
		return (this.value - this.min) / delta;
	}
}
