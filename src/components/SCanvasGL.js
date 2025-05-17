/**
 * SCanvasGL.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import SBase from "./SBase.js";

/**
 * WebGL対応のキャンバス描画用コンポーネントクラス。
 * WebGLコンテキストを使って、ハードウェアアクセラレーションによる描画が可能です。
 */
export default class SCanvasGL extends SBase {
	/**
	 * SCanvasGLのインスタンスを生成します。
	 */
	constructor() {
		super("canvas");
		this.addClass(SBase.CLASS_NAME.CANVAS);

		/**
		 * キャンバス要素
		 * @type {HTMLCanvasElement}
		 */
		// @ts-ignore
		this.canvas = this.element;

		/**
		 * WebGLコンテキスト
		 * @type {WebGLRenderingContext}
		 */
		this.gl = null;

		this.setPixelSize(300, 150); // canvas のデフォルト値を設定する
	}

	/**
	 * キャンバスの大きさ
	 * @typedef {Object} SPixelSizeData
	 * @property {number} width 横幅
	 * @property {number} height 縦幅
	 */

	/**
	 * キャンバスのサイズを取得します。
	 * @returns {SPixelSizeData}
	 */
	getPixelSize() {
		return {
			width: this.canvas.width,
			height: this.canvas.height
		};
	}

	/**
	 * キャンバス要素を取得します。
	 * @returns {HTMLCanvasElement} キャンバス要素
	 */
	getCanvas() {
		return this.canvas;
	}

	/**
	 * キャンバスのピクセルサイズを設定します。
	 * @param {number} width - 幅（ピクセル）
	 * @param {number} height - 高さ（ピクセル）
	 * @throws {string} 不正な引数が渡された場合
	 */
	setPixelSize(width, height) {
		if (
			arguments.length !== 2 ||
			typeof width !== "number" ||
			typeof height !== "number" ||
			width < 0 ||
			height < 0
		) {
			throw "IllegalArgumentException";
		}
		width = ~~Math.floor(width);
		height = ~~Math.floor(height);
		this.canvas.width = width;
		this.canvas.height = height;
	}

	/**
	 * WebGL描画コンテキストを取得します。
	 * @returns {WebGLRenderingContext} WebGLコンテキスト
	 */
	getContext() {
		// 一度でも GL で getContext すると使用できなくなります。
		if (this.context === undefined) {
			// @ts-ignore
			this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
			this.context = this.gl;
		}
		return this.context;
	}

	/**
	 * キャンバスをクリアします（GLコンテキストのカラー情報を削除）
	 */
	clear() {
		this.getContext().clear(this.gl.COLOR_BUFFER_BIT);
	}

	/**
	 * ImageDataの取得には対応していません（未実装）
	 * @returns {void}
	 */
	getImageData() {
		return;
	}

	/**
	 * ImageDataの描画には対応していません（未実装）
	 * @param {ImageData} imagedata
	 * @returns {void}
	 */
	putImageData(imagedata) {
		return;
	}
}
