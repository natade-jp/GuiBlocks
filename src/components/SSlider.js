/**
 * SSlider.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * 数値入力に使用できるスライダーコンポーネント。
 * ステップ、目盛り、リスナー設定などが可能です。
 */
export default class SSlider extends SBase {
	/**
	 * SSliderのインスタンスを生成します。
	 * @param {number} min - スライダーの最小値
	 * @param {number} max - スライダーの最大値
	 * @throws {string} 不正な引数の場合に例外をスローします
	 */
	constructor(min, max) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.SLIDER);

		let number_min = 0.0;
		let number_max = 1.0;

		if (arguments.length === 2) {
			number_min = min;
			number_max = max;
		} else if (arguments.length !== 2) {
			throw "IllegalArgumentException";
		}

		/**
		 * スライダーのinput要素
		 * @type {HTMLInputElement}
		 */
		this.slider = document.createElement("input");
		this.slider.id = this.getId() + "_slider";
		this.slider.type = "range";
		this.slider.className = SBase.CLASS_NAME.SLIDER;
		this.slider.value = number_min.toString();
		this.slider.min = number_min.toString();
		this.slider.max = number_max.toString();
		this.slider.step = ((max - min) / 100).toString();

		/**
		 * 目盛り表示用datalist
		 * @type {HTMLDataListElement}
		 */
		this.datalist = document.createElement("datalist");
		this.datalist.id = this.getId() + "_datalist";
		this.slider.setAttribute("list", this.datalist.id);

		this.element.appendChild(this.slider);
		this.element.appendChild(this.datalist);
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLInputElement} スライダー要素
	 */
	getEnabledElement() {
		return this.slider;
	}

	/**
	 * 最大値を設定します。
	 * @param {number} max - 最大値
	 */
	setMaximum(max) {
		this.slider.max = max.toString();
	}

	/**
	 * 最小値を設定します。
	 * @param {number} min - 最小値
	 */
	setMinimum(min) {
		this.slider.min = min.toString();
	}

	/**
	 * 最大値を取得します。
	 * @returns {number} 最大値
	 */
	getMaximum() {
		return parseFloat(this.slider.max);
	}

	/**
	 * 最小値を取得します。
	 * @returns {number} 最小値
	 */
	getMinimum() {
		return parseFloat(this.slider.min);
	}

	/**
	 * 現在の値を設定します。
	 * @param {number} value - スライダーの値
	 */
	setValue(value) {
		this.slider.value = value.toString();
	}

	/**
	 * 現在の値を取得します。
	 * @returns {number} 現在の値
	 */
	getValue() {
		return parseFloat(this.slider.value);
	}

	/**
	 * ステップ（最小目盛り）を設定します。
	 * @param {number} step - ステップ値
	 */
	setMinorTickSpacing(step) {
		this.slider.step = step.toString();
	}

	/**
	 * ステップ（最小目盛り）を取得します。
	 * @returns {number} ステップ値
	 */
	getMinorTickSpacing() {
		return parseFloat(this.slider.step);
	}

	/**
	 * 主要目盛り（datalist）を設定します。
	 * @param {number} step - 主要目盛り間隔
	 */
	setMajorTickSpacing(step) {
		this.majortick = step;
		this.removeMajorTickSpacing();
		let i;
		const min = this.getMinimum();
		const max = this.getMaximum();
		for (i = min; i <= max; i += step) {
			const option_node = document.createElement("option");
			option_node.value = i.toString();
			this.datalist.appendChild(option_node);
		}
	}

	/**
	 * 現在の主要目盛り間隔を取得します。
	 * @returns {number} 間隔値
	 */
	getMajorTickSpacing() {
		return this.majortick;
	}

	/**
	 * すべての主要目盛りを削除します。
	 */
	removeMajorTickSpacing() {
		const element = this.datalist;
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
	}

	/**
	 * スライダーの変化を監視するイベントリスナーを追加します。
	 * @param {Function} func - 変化時に呼び出されるコールバック
	 */
	addListener(func) {
		let isDown = false;
		const _this = this;
		const setDown = function () {
			isDown = true;
		};
		const setUp = function () {
			if (isDown) {
				if (!_this.slider.disabled) {
					func();
				}
				isDown = false;
			}
		};
		this.slider.addEventListener("touchstart", setDown, false);
		this.slider.addEventListener("touchend", setUp, false);
		this.slider.addEventListener("mousedown", setDown, false);
		this.slider.addEventListener("mouseup", setUp, false);
	}

	/**
	 * 横幅を取得します。
	 * @returns {number|null} 横幅
	 */
	getWidth() {
		let width = this.slider.width;
		if (width === null) {
			return null;
		}
		return parseFloat(width.toString().match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0]);
	}

	/**
	 * 縦幅を取得します。
	 * @returns {number|null} 縦幅
	 */
	getHeight() {
		let height = this.slider.height;
		if (height === null) {
			return null;
		}
		return parseFloat(height.toString().match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0]);
	}

	/**
	 * 横幅を設定します。
	 * @param {number} width - 横幅
	 * @throws {string} 数値でない場合に例外をスロー
	 */
	setWidth(width) {
		if (typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		super.setWidth(width);
		this.slider.style.width = width.toString() + this.unit;
	}

	/**
	 * 縦幅を設定します。
	 * @param {number} height - 縦幅
	 * @throws {string} 数値でない場合に例外をスロー
	 */
	setHeight(height) {
		if (typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		super.setHeight(height);
		this.slider.style.height = height.toString() + this.unit;
	}
}
