/**
 * SImagePanel.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";
import SCanvas from "./SCanvas.js";

/**
 * 画像を表示するためのパネルコンポーネント。
 * URL、ImageData、HTMLImageElement、Canvasなどを描画可能です。
 */
export default class SImagePanel extends SBase {
	/**
	 * SImagePanelのインスタンスを生成します。
	 */
	constructor() {
		super("div");
		this.addClass(SBase.CLASS_NAME.IMAGEPANEL);

		/**
		 * 表示用のimg要素
		 * @type {HTMLImageElement}
		 */
		const image = document.createElement("img");
		image.id = this.id + "_img";
		this.image = image;
		this.element.appendChild(this.image);
	}

	/**
	 * パネル内の全ての要素を削除します。
	 * 画像をクリアする用途で使用します。
	 */
	clear() {
		// 未作成
		SBase._removeChildNodes(this.element);
	}

	/**
	 * 現在表示中の画像をデータURL形式で取得します。
	 * @returns {string} データURL文字列
	 */
	toDataURL() {
		return this.image.src;
	}

	/**
	 * ImageDataを画像として表示します。
	 * @param {ImageData} imagedata - 描画する画像データ
	 */
	putImageData(imagedata) {
		this.putImage(imagedata);
	}

	/**
	 * 画像データをパネルに描画します。
	 * 対応するデータ型は以下の通りです:
	 * - URL文字列
	 * - ImageDataオブジェクト
	 * - HTMLImageElement
	 * - Canvasオブジェクト
	 * - HTMLCanvasElement
	 * - BlobまたはFileオブジェクト
	 *
	 * @param {string|ImageData|HTMLImageElement|SCanvas|HTMLCanvasElement|Blob|File} data 描画する画像データ
	 * @param {Function} [drawcallback] 描画完了時に呼び出されるコールバック関数
	 * @throws {string} 不正なデータ型が渡された場合に例外をスローします。
	 */
	putImage(data, drawcallback) {
		if (!drawcallback) {
			drawcallback = null;
		}
		if (typeof data === "string") {
			// URL(string) -> IMG
			this.image.onload = function () {
				if (typeof drawcallback === "function") {
					drawcallback();
				}
			};
			this.image.src = data;
		} else if (data instanceof ImageData) {
			const canvas = document.createElement("canvas");
			canvas.width = data.width;
			canvas.height = data.height;
			const context = canvas.getContext("2d");
			context.putImageData(data, 0, 0);
			this.putImage(canvas, drawcallback);
		} else if (data instanceof Image) {
			this.image.src = data.src;
		} else if (data instanceof SCanvas) {
			// SCanvas -> canvas
			this.putImage(data.canvas, drawcallback);
		} else if (data instanceof HTMLCanvasElement && data.tagName === "CANVAS") {
			// canvas -> URL(string)
			try {
				this.putImage(data.toDataURL("image/png"), drawcallback);
			} catch (e) {
				try {
					this.putImage(data.toDataURL("image/jpeg"), drawcallback);
				} catch (e) {
					// falls through
				}
			}
		} else if (data instanceof Blob || data instanceof File) {
			const _this = this;
			const reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function () {
				if (typeof reader.result === "string") {
					_this.putImage(reader.result, drawcallback);
				} else {
					throw "Unexpected result type from FileReader";
				}
			};
			reader.readAsDataURL(data);
		} else {
			throw "IllegalArgumentException";
		}
	}
}
