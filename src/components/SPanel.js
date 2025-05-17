/**
 * SPanel.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * パネル要素を表すクラス。タイトル表示用の legend 部分と、
 * コンテンツ配置用の body 部分を持つ。
 * @extends SBase
 */
export default class SPanel extends SBase {
	/**
	 * パネルを生成する
	 * @param {string} [title] - パネルのタイトルテキスト。未指定または空文字の場合はタイトル非表示
	 */
	constructor(title) {
		super("div", null);
		// パネルの基本スタイルを適用
		this.addClass(SBase.CLASS_NAME.PANEL);
		const element = this.element;

		/**
		 * パネルのタイトル表示領域 (legend 部分)
		 * @type {HTMLSpanElement}
		 */
		this.legend = document.createElement("span");
		SBase._addClass(this.legend, SBase.CLASS_NAME.PANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";

		/**
		 * パネルのコンテンツ配置領域 (body 部分)
		 * @type {HTMLDivElement}
		 */
		this.body = document.createElement("div");
		SBase._addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";

		const that = this;
		/**
		 * パネル操作用ツールセット
		 * @type {{ setText: function(string=): void }}
		 */
		this.paneltool = {
			/**
			 * パネルのタイトルを設定またはクリアし、表示/非表示を切り替える
			 * @param {string} [title] - 設定するタイトル。未指定または空文字の場合は非表示にする
			 * @returns {void}
			 */
			setText: function (title) {
				if (title) {
					that.legend.textContent = title;
					that.legend.style.display = "block";
				} else {
					that.legend.style.display = "none";
				}
			}
		};

		// 初期タイトルを設定
		this.paneltool.setText(title);
		// DOM に legend と body を追加
		element.appendChild(this.legend);
		element.appendChild(this.body);
	}

	/**
	 * パネルのタイトルを更新する
	 * @param {string} [title] - 新しいタイトルテキスト。未指定または空文字の場合はタイトルを非表示
	 * @returns {void}
	 */
	setText(title) {
		if (this.paneltool) {
			this.paneltool.setText(title);
		}
	}

	/**
	 * コンテンツ配置用の要素を取得する
	 * @returns {HTMLDivElement} パネルのコンテンツ要素 (body 部分)
	 */
	getContainerElement() {
		return this.body;
	}

	/**
	 * パネルのコンテンツ領域から全子ノードを削除する
	 * @returns {void}
	 */
	clear() {
		SBase._removeChildNodes(this.body);
	}
}
