/**
 * SFileLoadButton.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * ファイル読み込み用のボタンコンポーネント。
 * 非表示のinput要素を用いて、ユーザーがローカルファイルを選択できるようにします。
 * @extends SBase
 */
export default class SFileLoadButton extends SBase {
	/**
	 * SFileLoadButtonのインスタンスを生成します。
	 * @param {string} [title] - ボタンに表示するテキスト
	 */
	constructor(title) {
		super("label", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.addClass(SBase.CLASS_NAME.FILELOAD);

		// CSS有効化のために、label 内に input(file) を入れる
		// Edge のバグがあるので Edgeで使用できない
		// https://github.com/facebook/react/issues/7683

		/**
		 * 非表示のinput[type=file]要素
		 * @type {HTMLLabelElement}
		 */
		const label = /** @type {HTMLLabelElement} */ (super.element);
		const file = document.createElement("input");
		label.style.textAlign = "center";
		file.setAttribute("type", "file");
		file.id = this.getId() + "_file";
		file.style.display = "none";
		this.file = file;
		label.appendChild(file);
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLElement} input要素
	 */
	getEnabledElement() {
		return this.file;
	}

	/**
	 * 現在設定されているファイルフィルタを取得します。
	 * @returns {string} accept属性の値
	 */
	getFileAccept() {
		const accept = this.file.getAttribute("accept");
		return accept === null ? "" : accept;
	}

	/**
	 * ファイルフィルタを設定します。
	 * @param {string} filter - SFileLoadButton.FILE_ACCEPTで定義された文字列
	 */
	setFileAccept(filter) {
		if (filter === SFileLoadButton.FILE_ACCEPT.DEFAULT) {
			if (this.file.getAttribute("accept") !== null) {
				this.file.removeAttribute("accept");
			}
		} else {
			this.file.accept = filter;
		}
	}

	/**
	 * ファイルが選択された際に呼び出されるイベントリスナーを追加します。
	 * @param {function(FileList): void} func - 選択されたファイルリストを受け取るコールバック
	 */
	addListener(func) {
		this.file.addEventListener(
			"change",
			function (event) {
				func(/** @type {HTMLInputElement} */ (event.target).files);
			},
			false
		);
	}
}

/**
 * ファイルのaccept属性で使用するプリセット定数
 * @enum {string}
 */
SFileLoadButton.FILE_ACCEPT = {
	DEFAULT: "",
	IMAGE: "image/*",
	AUDIO: "audio/*",
	VIDEO: "video/*",
	TEXT: "text/*",
	PNG: "image/png",
	JPEG: "image/jpg",
	GIF: "image/gif"
};
