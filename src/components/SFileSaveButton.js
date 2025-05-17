/**
 * SFileSaveButton.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * ファイル保存用のボタンコンポーネント。
 * ユーザーがダウンロードできるリンクボタンを提供します。
 */
export default class SFileSaveButton extends SBase {
	/**
	 * SFileSaveButtonのインスタンスを生成します。
	 * @param {string} [title] - ボタンに表示するテキスト
	 */
	constructor(title) {
		super("a", title);

		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.addClass(SBase.CLASS_NAME.FILESAVE);

		/**
		 * ダウンロード時のファイル名
		 * @type {string}
		 */
		this.filename = "";

		/**
		 * ダウンロードするURL
		 * @type {string}
		 */
		this.url = "";

		/** @type {HTMLAnchorElement} */ (this.element).setAttribute("download", this.filename);
	}

	/**
	 * 保存時のファイル名を取得します。
	 * @returns {string} ファイル名
	 */
	getFileName() {
		return this.filename;
	}

	/**
	 * 保存時のファイル名を設定します。
	 * @param {string} filename - 設定するファイル名
	 */
	setFileName(filename) {
		this.filename = filename;
		/** @type {HTMLAnchorElement} */ (this.element).setAttribute("download", this.filename);
	}

	/**
	 * ダウンロードするURLを設定します。
	 * @param {string} url - ダウンロード対象のURL
	 */
	setURL(url) {
		/** @type {HTMLAnchorElement} */ (this.element).href = url;
		this.url = url;
	}

	/**
	 * ボタンの有効・無効を設定します。
	 * 無効にする場合はhref属性を削除します。
	 * @param {boolean} isenabled - true: 有効, false: 無効
	 */
	setEnabled(isenabled) {
		if (this.isEnabled() !== isenabled) {
			if (isenabled) {
				/** @type {HTMLAnchorElement} */ (this.element).href = this.url;
			} else {
				/** @type {HTMLAnchorElement} */ (this.element).removeAttribute("href");
			}
		}
		super.setEnabled(isenabled);
	}
}
