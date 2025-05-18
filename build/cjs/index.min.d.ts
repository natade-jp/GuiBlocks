export { GuiBlocks as default };
export type SColorPickerDataElement = {
    /**
     * - 各カラー要素の外枠
     */
    div: HTMLDivElement;
    /**
     * - 分割数（グラデーション用）
     */
    split: number;
    /**
     * - 現在の値（0.0〜1.0）
     */
    value: number;
    /**
     * - 数値入力用のテキストボックス
     */
    input: HTMLInputElement;
    /**
     * - ゲージ表示部分
     */
    gauge: HTMLDivElement;
    /**
     * - グラデーションカラー配列
     */
    color_data: string[];
    /**
     * - カラーノードの配列
     */
    color_node: HTMLDivElement[];
    /**
     * - 押下状態
     */
    is_press: boolean;
};
export type SColorPickerData = {
    H: SColorPickerDataElement;
    S: SColorPickerDataElement;
    L: SColorPickerDataElement;
};
declare namespace GuiBlocks {
    export { SButton };
    export { SCanvas };
    export { SCheckBox };
    export { NTColor as Color };
    export { SColorPicker };
    export { SComboBox };
    export { SFileLoadButton };
    export { SFileSaveButton };
    export { SGroupBox };
    export { SImagePanel };
    export { SLabel };
    export { SPanel };
    export { SProgressBar };
    export { SSlidePanel };
    export { SSlider };
    import PUT_TYPE = SBase.PUT_TYPE;
    export { PUT_TYPE };
    import UNIT_TYPE = SBase.UNIT_TYPE;
    export { UNIT_TYPE };
    import LABEL_POSITION = SBase.LABEL_POSITION;
    export { LABEL_POSITION };
    import FILE_ACCEPT = SFileLoadButton.FILE_ACCEPT;
    export { FILE_ACCEPT };
}
/**
 * SButton.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * ボタンクラス
 * 基本ボタンUI部品を提供します。
 */
declare class SButton extends SBase {
    /**
     * SButtonのインスタンスを生成します。
     * @param {string} [title] ボタンに表示するテキスト
     */
    constructor(title?: string);
    /**
     * ボタンのクリックイベントリスナーを追加します。
     * @param {EventListenerOrEventListenerObject} func クリック時に呼び出される関数
     */
    addListener(func: EventListenerOrEventListenerObject): void;
}
/**
 * SCanvas.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * キャンバス描画用のコンポーネントクラス。
 * キャンバス上に画像の描画や取得、クリアなどの操作が可能です。
 */
declare class SCanvas extends SBase {
    constructor();
    /**
     * @type {HTMLCanvasElement}
     */
    canvas: HTMLCanvasElement;
    /**
     * ピクセルサイズのオブジェクト
     * @typedef {Object} SPixelSizeData
     * @property {number} width 横幅
     * @property {number} height 縦幅
     */
    /**
     * キャンバスのサイズを取得します。
     * @returns {SPixelSizeData}
     */
    getPixelSize(): {
        /**
         * 横幅
         */
        width: number;
        /**
         * 縦幅
         */
        height: number;
    };
    /**
     * キャンバス要素を取得します。
     * @returns {HTMLCanvasElement} キャンバス要素
     */
    getCanvas(): HTMLCanvasElement;
    /**
     * キャンバスのピクセルサイズを設定します。
     * @param {number} width - 幅（ピクセル）
     * @param {number} height - 高さ（ピクセル）
     * @throws {string} 引数が不正な場合に例外をスローします
     */
    setPixelSize(width: number, height: number, ...args: any[]): void;
    /**
     * 2D描画用コンテキストを取得します。
     * @returns {CanvasRenderingContext2D} コンテキストオブジェクト
     */
    getContext(): CanvasRenderingContext2D;
    context: CanvasRenderingContext2D;
    /**
     * キャンバスをクリアします。
     */
    clear(): void;
    /**
     * 現在のキャンバス画像をImageDataとして取得します。
     * @returns {ImageData} 画像データ
     */
    getImageData(): ImageData;
    /**
     * ImageDataをキャンバスに描画します。
     * @param {ImageData} imagedata - 描画する画像データ
     */
    putImageData(imagedata: ImageData): void;
    /**
     * 内部的な画像描画関数（位置やサイズ調整）
     * @param {CanvasImageSource|ImageData} image
     * @param {boolean} isresizecanvas
     * @param {number} drawsize
     * @private
     */
    private _putImage;
    /**
     * 多様な画像ソースを受け取りキャンバスに描画します。
     * @param {ImageData|string|SCanvas|HTMLCanvasElement|HTMLImageElement|Blob|File} data
     * @param {boolean} [isresizecanvas=false] - キャンバスサイズを変更するかどうか
     * @param {number} [drawsize=SCanvas.drawtype.LETTER_BOX] - 描画サイズモード
     * @param {Function} [drawcallback] - 描画完了時のコールバック
     * @throws {string} 不正なデータ型が渡された場合
     */
    putImage(data: ImageData | string | SCanvas | HTMLCanvasElement | HTMLImageElement | Blob | File, isresizecanvas?: boolean, drawsize?: number, drawcallback?: Function): void;
    /**
     * 現在のキャンバスをデータURLとして取得します。
     * @param {string} [mime_type="image/png"] - 出力する画像のMIMEタイプ
     * @returns {string} データURL
     */
    toDataURL(mime_type?: string): string;
}
declare namespace SCanvas {
    namespace drawtype {
        let ORIGINAL: number;
        let ASPECT_RATIO: number;
        let STRETCH: number;
        let LETTER_BOX: number;
        let FILL_ASPECT_RATIO: number;
    }
    /**
     * 描画サイズのモード定数
     */
    type drawtype = number;
}
/**
 * SCheckBox.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * チェックボックスを表すUIコンポーネントクラス。
 * ラベル付きで表示され、選択状態の取得・変更が可能です。
 */
declare class SCheckBox extends SBase {
    /**
     * SCheckBoxのインスタンスを生成します。
     * @param {string} [title] - チェックボックスに表示するテキスト
     */
    constructor(title?: string);
    checkbox: HTMLInputElement;
    /**
     * チェックボックスに表示するテキストノード
     * @type {Text}
     */
    textnode: Text;
    /**
     * テキストノードを取得します。
     * @returns {Text} ラベル用のテキストノード
     */
    getTextNode(): Text;
    /**
     * input要素ノードを取得します。
     * @returns {HTMLInputElement} チェックボックスのinput要素
     */
    getElementNode(): HTMLInputElement;
    /**
     * ラベルの位置を設定します。
     * @param {number} LABEL_POSITION - ラベル位置定数（SBase.LABEL_POSITION）
     */
    setLabelPosition(LABEL_POSITION: number): void;
    /**
     * チェックボックスのサイズを設定します。
     * @param {number} size - サイズ（pxなど）
     * @throws {string} 数値以外が指定された場合に例外をスロー
     */
    setCheckBoxImageSize(size: number): void;
    /**
     * チェック状態変更時のイベントリスナーを追加します。
     * @param {EventListenerOrEventListenerObject} func - コールバック関数
     */
    addListener(func: EventListenerOrEventListenerObject): void;
    /**
     * チェック状態を設定します。
     * @param {boolean} ischecked - trueでチェック状態、falseで非チェック
     */
    setChecked(ischecked: boolean): void;
    /**
     * 現在のチェック状態を取得します。
     * @returns {boolean} チェックされていればtrue
     */
    isChecked(): boolean;
}
/**
 * NTColor.js
 *
 * AUTHOR:
 *  natade (https://github.com/natade-jp)
 *
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */
/**
 * 色情報を扱うクラス (immutable)
 */
declare class NTColor {
    /**
     * `v0 + (v1 - v0) * x` で線形補間する
     * @param {number} v0
     * @param {number} v1
     * @param {number} x
     * @returns {number}
     * @private
     */
    private static _mix;
    /**
     * 指定した値を [0.0,1.0] の範囲にする
     * @param {number} x
     * @returns {number}
     * @private
     */
    private static _limit;
    /**
     * 指定した値を比較する
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     * @private
     */
    private static _equals;
    /**
     * 指定した値を負の値へ整数化する
     * @param {number} x
     * @returns {number}
     * @private
     */
    private static _flact;
    /**
     * 16進数の文字列化する
     * @param {number} x
     * @returns {string}
     * @private
     */
    private static _hex;
    /**
     * 少数3桁程度の固定小数点文字列を取得する
     * @param {number} x
     * @returns {string}
     * @private
     */
    private static _ftos;
    /**
     * 色の型情報
     * @typedef {Object} NTColorInputColorRGBA
     * @property {number} [r]
     * @property {number} [g]
     * @property {number} [b]
     * @property {number} [a]
     */
    /**
     * 指定した 0...1 の色情報からオブジェクトを作成する
     * @param {number|NTColorInputColorRGBA|number[]} color_or_r
     * @param {number} [g]
     * @param {number} [b]
     * @param {number} [a = 1.0]
     * @returns {NTColor}
     */
    static newColorNormalizedRGB(color_or_r: number | {
        r?: number;
        g?: number;
        b?: number;
        a?: number;
    } | number[], g?: number, b?: number, a?: number, ...args: any[]): NTColor;
    /**
     * 指定した 0...255 の色情報からオブジェクトを作成する
     * @param {number|NTColorInputColorRGBA|number[]} color_or_aarrggbb
     * @param {number|boolean} [g_or_is_load_alpha = false]
     * @param {number} [b]
     * @param {number} [a=255.0]
     * @returns {NTColor}
     */
    static newColorRGB(color_or_aarrggbb: number | {
        r?: number;
        g?: number;
        b?: number;
        a?: number;
    } | number[], g_or_is_load_alpha?: number | boolean, b?: number, a?: number, ...args: any[]): NTColor;
    /**
     * 色の型情報
     * @typedef {Object} NTColorInputColorHSVA
     * @property {number} [h]
     * @property {number} [s]
     * @property {number} [v]
     * @property {number} [a]
     */
    /**
     * 指定した 0...1 の色情報からオブジェクトを作成する
     * @param {number|NTColorInputColorHSVA|number[]} color_or_h
     * @param {number} [s]
     * @param {number} [v]
     * @param {number} [a=1.0]
     * @returns {NTColor}
     */
    static newColorNormalizedHSV(color_or_h: number | {
        h?: number;
        s?: number;
        v?: number;
        a?: number;
    } | number[], s?: number, v?: number, a?: number, ...args: any[]): NTColor;
    /**
     * 指定した 0...360, 0...255 の色情報からオブジェクトを作成する
     * @param {number|NTColorInputColorHSVA|number[]} color_or_h
     * @param {number} [s]
     * @param {number} [v]
     * @param {number} [a=255.0]
     * @returns {NTColor}
     */
    static newColorHSV(color_or_h: number | {
        h?: number;
        s?: number;
        v?: number;
        a?: number;
    } | number[], s?: number, v?: number, a?: number, ...args: any[]): NTColor;
    /**
     * 色の型情報
     * @typedef {Object} NTColorInputColorHSLA
     * @property {number} [h]
     * @property {number} [s]
     * @property {number} [l]
     * @property {number} [a]
     */
    /**
     * 指定した 0...1 の色情報からオブジェクトを作成する
     * @param {number|NTColorInputColorHSLA|number[]} color_or_h
     * @param {number} [s]
     * @param {number} [l]
     * @param {number} [a=1.0]
     * @returns {NTColor}
     */
    static newColorNormalizedHSL(color_or_h: number | {
        h?: number;
        s?: number;
        l?: number;
        a?: number;
    } | number[], s?: number, l?: number, a?: number, ...args: any[]): NTColor;
    /**
     * 指定した 0...360, 0...255 の色情報からオブジェクトを作成する
     * @param {number|NTColorInputColorHSLA|number[]} color_or_h
     * @param {number} s
     * @param {number} l
     * @param {number} [a=255.0]
     * @returns {NTColor}
     */
    static newColorHSL(color_or_h: number | {
        h?: number;
        s?: number;
        l?: number;
        a?: number;
    } | number[], s: number, l: number, a?: number, ...args: any[]): NTColor;
    /**
     * white
     * @returns {NTColor}
     */
    static get WHITE(): NTColor;
    /**
     * lightGray
     * @returns {NTColor}
     */
    static get LIGHT_GRAY(): NTColor;
    /**
     * gray
     * @returns {NTColor}
     */
    static get GRAY(): NTColor;
    /**
     * darkGray
     * @returns {NTColor}
     */
    static get DARK_GRAY(): NTColor;
    /**
     * black
     * @returns {NTColor}
     */
    static get BLACK(): NTColor;
    /**
     * red
     * @returns {NTColor}
     */
    static get RED(): NTColor;
    /**
     * pink
     * @returns {NTColor}
     */
    static get PINK(): NTColor;
    /**
     * orange
     * @returns {NTColor}
     */
    static get ORANGE(): NTColor;
    /**
     * yellow
     * @returns {NTColor}
     */
    static get YELLOW(): NTColor;
    /**
     * green
     * @returns {NTColor}
     */
    static get GREEN(): NTColor;
    /**
     * magenta
     * @returns {NTColor}
     */
    static get MAGENTA(): NTColor;
    /**
     * cyan
     * @returns {NTColor}
     */
    static get CYAN(): NTColor;
    /**
     * blue
     * @returns {NTColor}
     */
    static get BLUE(): NTColor;
    /**
     * 赤色成分 [0.0,1.0]
     * @types {number}
     */
    _r: number;
    /**
     * 緑色成分 [0.0,1.0]
     * @types {number}
     */
    _g: number;
    /**
     * 青色成分 [0.0,1.0]
     * @types {number}
     */
    _b: number;
    /**
     * 透明度成分 [0.0,1.0]
     * @types {number}
     */
    _a: number;
    /**
     * 色を表示できる範囲内 [0.0,1.0] に収める
     * @returns {NTColor}
     */
    limit(): NTColor;
    /**
     * 色をアルファ値で焼きこむ
     * @returns {NTColor}
     */
    bake(): NTColor;
    /**
     * 各色成分に加法混色を行う
     * @param {NTColor} x
     * @returns {NTColor}
     */
    addColorMixture(x: NTColor): NTColor;
    /**
     * 各色成分に減法混色を行う
     * @param {NTColor} x
     * @returns {NTColor}
     */
    subColorMixture(x: NTColor): NTColor;
    /**
     * 各色成分に掛け算を行う
     * @param {NTColor|number} x
     * @returns {NTColor}
     */
    mul(x: NTColor | number): NTColor;
    /**
     * オブジェクトを複製する
     * @returns {NTColor}
     */
    clone(): NTColor;
    /**
     * オブジェクトを比較する
     * @param {NTColor} x
     * @returns {boolean}
     */
    equals(x: NTColor): boolean;
    /**
     * 文字列化する
     * @returns {string}
     */
    toString(): string;
    /**
     * 内部のデータを RGBA で書き換える
     * @param {number} r [0.0,1.0]
     * @param {number} g [0.0,1.0]
     * @param {number} b [0.0,1.0]
     * @param {number} [a] [0.0,1.0]
     * @returns {NTColor}
     * @private
     */
    private _setRGB;
    /**
     * 内部のデータを HSVA で書き換える
     * @param {number} h [0.0,1.0]
     * @param {number} s [0.0,1.0]
     * @param {number} v [0.0,1.0]
     * @param {number} [a] [0.0,1.0]
     * @returns {NTColor}
     * @private
     */
    private _setHSV;
    /**
     * 内部のデータを HSLA で書き換える
     * @param {number} h [0.0,1.0]
     * @param {number} s [0.0,1.0]
     * @param {number} l [0.0,1.0]
     * @param {number} [a] [0.0,1.0]
     * @returns {NTColor}
     * @private
     */
    private _setHSL;
    /**
     * 内部のデータを RGBA の値で取得する
     * @returns {{r: number, g: number, b: number, a: number}}
     * @private
     */
    private _getRGB;
    /**
     * 内部のデータを HSVA の値で取得する
     * @returns {{h: number, s: number, v: number, a: number}}
     * @private
     */
    private _getHSV;
    /**
     * 内部のデータを HSLA の値で取得する
     * @returns {{h: number, s: number, l: number, a: number}}
     * @private
     */
    private _getHSL;
    /**
     * [0.0,1.0] に正規化された ARGB の値を取得する
     * @returns {{r: number, g: number, b: number, a: number}}
     */
    toNormalizedRGB(): {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    /**
     * [0,255] の ARGB の値を取得する
     * @returns {{r: number, g: number, b: number, a: number}}
     */
    toRGB(): {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    /**
     * 0x00RRGGBB の値を取得する
     * @returns {number}
     */
    toRRGGBB(): number;
    /**
     * 0xAARRGGBB の値を取得する
     * @returns {number}
     */
    toAARRGGBB(): number;
    /**
     * [0.0,1.0] に正規化された HSV の値を取得する
     * @returns {{h: number, s: number, v: number, a: number}}
     */
    toNormalizedHSV(): {
        h: number;
        s: number;
        v: number;
        a: number;
    };
    /**
     * [0,255] の HSV の値を取得する。ただし色相は [0,359] とする。
     * @returns {{h: number, s: number, v: number, a: number}}
     */
    toHSV(): {
        h: number;
        s: number;
        v: number;
        a: number;
    };
    /**
     * [0.0,1.0] に正規化された HSL の値を取得する
     * @returns {{h: number, s: number, l: number, a: number}}
     */
    toNormalizedHSL(): {
        h: number;
        s: number;
        l: number;
        a: number;
    };
    /**
     * [0,255] の HSL の値を取得する。ただし色相は [0,359] とする。
     * @returns {{h: number, s: number, l: number, a: number}}
     */
    toHSL(): {
        h: number;
        s: number;
        l: number;
        a: number;
    };
    /**
     * [0.0,1.0] の赤成分
     * @returns {number}
     */
    get r(): number;
    /**
     * [0.0,1.0] の緑成分
     * @returns {number}
     */
    get g(): number;
    /**
     * [0.0,1.0] の青成分
     * @returns {number}
     */
    get b(): number;
    /**
     * [0.0,1.0] のアルファ成分
     * @returns {number}
     */
    get a(): number;
    /**
     * [0,255] の赤成分
     * @returns {number}
     */
    get ir(): number;
    /**
     * [0,255] の緑成分
     * @returns {number}
     */
    get ig(): number;
    /**
     * [0,255] の青成分
     * @returns {number}
     */
    get ib(): number;
    /**
     * [0,255] のアルファ成分
     * @returns {number}
     */
    get ia(): number;
    /**
     * [0,100] の赤成分
     * @returns {number}
     */
    get pr(): number;
    /**
     * [0,100] の緑成分
     * @returns {number}
     */
    get pg(): number;
    /**
     * [0,100] の青成分
     * @returns {number}
     */
    get pb(): number;
    /**
     * [0,100] のアルファ成分
     * @returns {number}
     */
    get pa(): number;
    /**
     * 明るい色を取得する
     * @returns {NTColor}
     */
    brighter(): NTColor;
    /**
     * 暗い色を取得する
     * @returns {NTColor}
     */
    darker(): NTColor;
    /**
     * CSSで使用できる16進数の色情報のテキストを取得する
     * @returns {string}
     */
    toCSSHex(): string;
    /**
     * CSSで使用できる `rgb()`/`rgba()` の色情報のテキストを取得する
     * @returns {string}
     */
    toCSS255(): string;
    /**
     * CSSで使用できるパーセンテージのrgb/rgbaの色情報のテキストを取得する
     * @returns {string}
     */
    toCSSPercent(): string;
    /**
     * 指定した透明度の色情報を作成して取得する
     * @param {number} a
     * @returns {NTColor}
     */
    setAlpha(a: number): NTColor;
}
/**
 * SColorPicker.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * @typedef {Object} SColorPickerDataElement
 * @property {HTMLDivElement} div - 各カラー要素の外枠
 * @property {number} split - 分割数（グラデーション用）
 * @property {number} value - 現在の値（0.0〜1.0）
 * @property {HTMLInputElement} input - 数値入力用のテキストボックス
 * @property {HTMLDivElement} gauge - ゲージ表示部分
 * @property {string[]} color_data - グラデーションカラー配列
 * @property {HTMLDivElement[]} color_node - カラーノードの配列
 * @property {boolean} is_press - 押下状態
 */
/**
 * @typedef {Object} SColorPickerData
 * @property {SColorPickerDataElement} H
 * @property {SColorPickerDataElement} S
 * @property {SColorPickerDataElement} L
 */
/**
 * HSLカラー形式に基づくカラーピッカーコンポーネント。
 * ユーザーは色相、彩度、輝度を個別に調整できます。
 */
declare class SColorPicker extends SBase {
    constructor();
    hls: SColorPickerData;
    /**
     * カラー変更時のリスナー関数群
     * @type {Function[]}
     */
    listener: Function[];
    /**
     * カラーを設定します。
     * @param {NTColor} color - 設定する色（NTColor型）
     * @throws {string} 型が不正な場合に例外をスロー
     */
    setColor(color: NTColor): void;
    /**
     * 現在設定されている色を取得します。
     * @returns {NTColor} 現在の色（NTColor型）
     */
    getColor(): NTColor;
    /**
     * カラーピッカーを再描画します。
     */
    redraw(): void;
    /**
     * 値が変化した際に呼び出すリスナーを登録します。
     * @param {Function} func - 変更時に実行する関数
     */
    addListener(func: Function): void;
}
/**
 * SComboBox.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * コンボボックス（ドロップダウンリスト）を表すUIコンポーネントクラス。
 * テキストのリスト表示と選択が可能です。
 */
declare class SComboBox extends SBase {
    /**
     * コンボボックスのインスタンスを生成します。
     * @param {string[]} item - 初期リスト項目
     */
    constructor(item: string[]);
    /**
     * select要素
     * @type {HTMLSelectElement}
     */
    select: HTMLSelectElement;
    /**
     * コンボボックスの選択変更時イベントリスナーを追加します。
     * @param {EventListenerOrEventListenerObject} func - コールバック関数
     */
    addListener(func: EventListenerOrEventListenerObject): void;
    /**
     * コンボボックスに登録されているテキスト一覧を取得します。
     * @returns {string[]} テキストの配列
     */
    getText(): string[];
    /**
     * 指定された値を選択状態に設定します。
     * @param {string} text - 選択したい項目の値
     */
    setSelectedItem(text: string): void;
    /**
     * 現在選択されている項目の値を取得します。
     * @returns {string} 選択された値。未選択の場合は空文字
     */
    getSelectedItem(): string;
}
/**
 * SFileLoadButton.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * ファイル読み込み用のボタンコンポーネント。
 * 非表示のinput要素を用いて、ユーザーがローカルファイルを選択できるようにします。
 * @extends SBase
 */
declare class SFileLoadButton extends SBase {
    /**
     * SFileLoadButtonのインスタンスを生成します。
     * @param {string} [title] - ボタンに表示するテキスト
     */
    constructor(title?: string);
    file: HTMLInputElement;
    /**
     * 現在設定されているファイルフィルタを取得します。
     * @returns {string} accept属性の値
     */
    getFileAccept(): string;
    /**
     * ファイルフィルタを設定します。
     * @param {string} filter - SFileLoadButton.FILE_ACCEPTで定義された文字列
     */
    setFileAccept(filter: string): void;
    /**
     * ファイルが選択された際に呼び出されるイベントリスナーを追加します。
     * @param {function(FileList): void} func - 選択されたファイルリストを受け取るコールバック
     */
    addListener(func: (arg0: FileList) => void): void;
}
declare namespace SFileLoadButton {
    namespace FILE_ACCEPT {
        let DEFAULT: string;
        let IMAGE: string;
        let AUDIO: string;
        let VIDEO: string;
        let TEXT: string;
        let PNG: string;
        let JPEG: string;
        let GIF: string;
    }
    /**
     * ファイルのaccept属性で使用するプリセット定数
     */
    type FILE_ACCEPT = string;
}
/**
 * SFileSaveButton.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * ファイル保存用のボタンコンポーネント。
 * ユーザーがダウンロードできるリンクボタンを提供します。
 */
declare class SFileSaveButton extends SBase {
    /**
     * SFileSaveButtonのインスタンスを生成します。
     * @param {string} [title] - ボタンに表示するテキスト
     */
    constructor(title?: string);
    /**
     * ダウンロード時のファイル名
     * @type {string}
     */
    filename: string;
    /**
     * ダウンロードするURL
     * @type {string}
     */
    url: string;
    /**
     * 保存時のファイル名を取得します。
     * @returns {string} ファイル名
     */
    getFileName(): string;
    /**
     * 保存時のファイル名を設定します。
     * @param {string} filename - 設定するファイル名
     */
    setFileName(filename: string): void;
    /**
     * ダウンロードするURLを設定します。
     * @param {string} url - ダウンロード対象のURL
     */
    setURL(url: string): void;
}
/**
 * SGroupBox.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * グループボックスを表すUIコンポーネントクラス。
 * 枠で囲まれたタイトル付きのコンテナを提供します。
 */
declare class SGroupBox extends SBase {
    /**
     * SGroupBoxのインスタンスを生成します。
     * @param {string} [title] - グループボックスのタイトル
     */
    constructor(title?: string);
    /**
     * グループのタイトル部分
     * @type {HTMLLegendElement}
     */
    legend: HTMLLegendElement;
    /**
     * グループ内のコンテンツを格納する要素
     * @type {HTMLDivElement}
     */
    body: HTMLDivElement;
    /**
     * コンテンツ配置用の要素を取得します。
     * @returns {HTMLDivElement} グループ内のコンテンツエリア
     */
    getContainerElement(): HTMLDivElement;
    /**
     * グループ内のすべての子要素を削除します。
     */
    clear(): void;
}
/**
 * SImagePanel.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * 画像を表示するためのパネルコンポーネント。
 * URL、ImageData、HTMLImageElement、Canvasなどを描画可能です。
 */
declare class SImagePanel extends SBase {
    /**
     * SImagePanelのインスタンスを生成します。
     */
    constructor();
    image: HTMLImageElement;
    /**
     * パネル内の全ての要素を削除します。
     * 画像をクリアする用途で使用します。
     */
    clear(): void;
    /**
     * 現在表示中の画像をデータURL形式で取得します。
     * @returns {string} データURL文字列
     */
    toDataURL(): string;
    /**
     * ImageDataを画像として表示します。
     * @param {ImageData} imagedata - 描画する画像データ
     */
    putImageData(imagedata: ImageData): void;
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
    putImage(data: string | ImageData | HTMLImageElement | SCanvas | HTMLCanvasElement | Blob | File, drawcallback?: Function): void;
}
/**
 * SLabel.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * ラベル表示用のUIコンポーネントクラス。
 * 単純なテキスト表示を行います。
 */
declare class SLabel extends SBase {
    /**
     * SLabelのインスタンスを生成します。
     * @param {string} [title] - ラベルに表示するテキスト
     */
    constructor(title?: string);
}
/**
 * SPanel.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * パネル要素を表すクラス。タイトル表示用の legend 部分と、
 * コンテンツ配置用の body 部分を持つ。
 * @extends SBase
 */
declare class SPanel extends SBase {
    /**
     * パネルを生成する
     * @param {string} [title] - パネルのタイトルテキスト。未指定または空文字の場合はタイトル非表示
     */
    constructor(title?: string);
    /**
     * パネルのタイトル表示領域 (legend 部分)
     * @type {HTMLSpanElement}
     */
    legend: HTMLSpanElement;
    /**
     * パネルのコンテンツ配置領域 (body 部分)
     * @type {HTMLDivElement}
     */
    body: HTMLDivElement;
    /**
     * パネル操作用ツールセット
     * @type {{ setText: function(string=): void }}
     */
    paneltool: {
        setText: (arg0: string | undefined) => void;
    };
    /**
     * パネルのタイトルを更新する
     * @param {string} [title] - 新しいタイトルテキスト。未指定または空文字の場合はタイトルを非表示
     * @returns {void}
     */
    setText(title?: string): void;
    /**
     * コンテンツ配置用の要素を取得する
     * @returns {HTMLDivElement} パネルのコンテンツ要素 (body 部分)
     */
    getContainerElement(): HTMLDivElement;
    /**
     * パネルのコンテンツ領域から全子ノードを削除する
     * @returns {void}
     */
    clear(): void;
}
/**
 * SProgressBar.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * プログレスバーを表すUIコンポーネントクラス。
 * 値の進捗状況を視覚的に表示します。
 */
declare class SProgressBar extends SBase {
    /**
     * SProgressBarのインスタンスを生成します。
     * @param {number} [min=0.0] - プログレスバーの最小値
     * @param {number} [max=1.0] - プログレスバーの最大値
     * @throws {string} 不正な引数が渡された場合に例外をスロー
     */
    constructor(min?: number, max?: number, ...args: any[]);
    min: number;
    max: number;
    value: number;
    is_indeterminate: boolean;
    /**
     * 表示用のprogress要素
     * @type {HTMLProgressElement}
     */
    progress: HTMLProgressElement;
    /**
     * プログレスバーの最大値を設定します。
     * @param {number} max - 最大値
     */
    setMaximum(max: number): void;
    /**
     * プログレスバーの最小値を設定します。
     * @param {number} min - 最小値
     */
    setMinimum(min: number): void;
    /**
     * プログレスバーの最大値を取得します。
     * @returns {number} 最大値
     */
    getMaximum(): number;
    /**
     * プログレスバーの最小値を取得します。
     * @returns {number} 最小値
     */
    getMinimum(): number;
    /**
     * プログレスバーの現在値を設定します。
     * @param {number} value - 現在値
     */
    setValue(value: number): void;
    /**
     * プログレスバーの現在値を取得します。
     * @returns {number} 現在値
     */
    getValue(): number;
    /**
     * プログレスバーの不確定状態を設定します。
     * @param {boolean} is_indeterminate - trueで不確定状態
     */
    setIndeterminate(is_indeterminate: boolean): void;
    /**
     * プログレスバーが不確定状態かどうかを取得します。
     * @returns {boolean} trueなら不確定状態
     */
    isIndeterminate(): boolean;
    /**
     * 進捗率を取得します。
     * @returns {number} 進捗率（0.0〜1.0）
     */
    getPercentComplete(): number;
}
/**
 * SSlidePanel.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * 開閉可能なスライド式のパネルコンポーネント。
 * タイトルをクリックすることで、表示/非表示を切り替えられます。
 */
declare class SSlidePanel extends SBase {
    /**
     * SSlidePanelのインスタンスを生成します。
     * @param {string} [title] - パネルのタイトル
     */
    constructor(title?: string);
    /**
     * タイトル用のテキストノード
     * @type {Text}
     */
    textnode: Text;
    /**
     * タイトル領域（クリック可能）
     * @type {HTMLSpanElement}
     */
    legend: HTMLSpanElement;
    /**
     * スライドする領域
     * @type {HTMLDivElement}
     */
    slide: HTMLDivElement;
    /**
     * コンテンツ配置用の領域
     * @type {HTMLDivElement}
     */
    body: HTMLDivElement;
    /**
     * パネルの開閉状態を設定します。
     * @param {boolean} is_open - trueで開く、falseで閉じる
     */
    setOpen(is_open: boolean): void;
    is_open: boolean;
    /**
     * 現在パネルが開いているかどうかを返します。
     * @returns {boolean} trueなら開いている状態
     */
    isOpen(): boolean;
    /**
     * タイトル部分のテキストノードを取得します。
     * @returns {Text} テキストノード
     */
    getTextNode(): Text;
    /**
     * コンテンツを配置する要素を取得します。
     * @returns {HTMLDivElement} コンテンツ領域
     */
    getContainerElement(): HTMLDivElement;
    /**
     * コンテンツ領域をクリアします。
     */
    clear(): void;
}
/**
 * SSlider.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * 数値入力に使用できるスライダーコンポーネント。
 * ステップ、目盛り、リスナー設定などが可能です。
 */
declare class SSlider extends SBase {
    /**
     * SSliderのインスタンスを生成します。
     * @param {number} min - スライダーの最小値
     * @param {number} max - スライダーの最大値
     * @throws {string} 不正な引数の場合に例外をスローします
     */
    constructor(min: number, max: number, ...args: any[]);
    /**
     * スライダーのinput要素
     * @type {HTMLInputElement}
     */
    slider: HTMLInputElement;
    /**
     * 目盛り表示用datalist
     * @type {HTMLDataListElement}
     */
    datalist: HTMLDataListElement;
    /**
     * 有効状態を管理するHTML要素を取得します。
     * @returns {HTMLInputElement} スライダー要素
     */
    getEnabledElement(): HTMLInputElement;
    /**
     * 最大値を設定します。
     * @param {number} max - 最大値
     */
    setMaximum(max: number): void;
    /**
     * 最小値を設定します。
     * @param {number} min - 最小値
     */
    setMinimum(min: number): void;
    /**
     * 最大値を取得します。
     * @returns {number} 最大値
     */
    getMaximum(): number;
    /**
     * 最小値を取得します。
     * @returns {number} 最小値
     */
    getMinimum(): number;
    /**
     * 現在の値を設定します。
     * @param {number} value - スライダーの値
     */
    setValue(value: number): void;
    /**
     * 現在の値を取得します。
     * @returns {number} 現在の値
     */
    getValue(): number;
    /**
     * ステップ（最小目盛り）を設定します。
     * @param {number} step - ステップ値
     */
    setMinorTickSpacing(step: number): void;
    /**
     * ステップ（最小目盛り）を取得します。
     * @returns {number} ステップ値
     */
    getMinorTickSpacing(): number;
    /**
     * 主要目盛り（datalist）を設定します。
     * @param {number} step - 主要目盛り間隔
     */
    setMajorTickSpacing(step: number): void;
    majortick: number;
    /**
     * 現在の主要目盛り間隔を取得します。
     * @returns {number} 間隔値
     */
    getMajorTickSpacing(): number;
    /**
     * すべての主要目盛りを削除します。
     */
    removeMajorTickSpacing(): void;
    /**
     * スライダーの変化を監視するイベントリスナーを追加します。
     * @param {Function} func - 変化時に呼び出されるコールバック
     */
    addListener(func: Function): void;
}
/**
 * SBase.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */
/**
 * 全UIコンポーネントの基本機能を提供する基底クラス。
 * HTML要素の生成、配置、表示/非表示、有効/無効化、スタイル操作などの基本的な機能を含む。
 */
declare class SBase {
    /**
     * 指定した要素にマウスイベント（タッチ・クリック）を登録します。
     * @param {HTMLElement} element イベントを追加する対象のHTML要素
     * @protected
     */
    protected static _attachMouseEvent(element: HTMLElement): void;
    /**
     * 指定したIDの要素をDOMツリーから削除します。
     * @param {string} id 削除対象の要素のID
     * @returns {HTMLElement|null} 削除された要素、または存在しない場合はnull
     * @protected
     */
    protected static _removeNodeForId(id: string): HTMLElement | null;
    /**
     * コンポーネントをターゲットに指定した方法で配置します。
     * @param {string|SBase} target 配置先のターゲット（IDまたはSBaseインスタンス）
     * @param {SBase} component 配置するコンポーネント
     * @param {number} type 配置タイプ（SBase.PUT_TYPE）
     * @throws {string} 不正な引数や配置先が見つからない場合に例外をスロー
     * @protected
     */
    protected static _AputB(target: string | SBase, component: SBase, type: number): void;
    /**
     * 指定した要素にブール属性を設定または削除します。
     * @param {HTMLElement} element 対象のHTML要素
     * @param {string} attribute 設定する属性名
     * @param {boolean} isset 属性を設定する場合はtrue、削除する場合はfalse
     * @throws {string} 不正な引数の場合に例外をスロー
     * @protected
     */
    protected static _setBooleanAttribute(element: HTMLElement, attribute: string, isset: boolean): void;
    /**
     * 指定した要素にブール属性が設定されているかを確認します。
     * @param {HTMLElement} element 対象のHTML要素
     * @param {string} attribute 確認する属性名
     * @returns {boolean} 属性が設定されている場合はtrue、設定されていない場合はfalse
     * @throws {string} 不正な引数の場合に例外をスロー
     * @protected
     */
    protected static _isBooleanAttribute(element: HTMLElement, attribute: string): boolean;
    /**
     * 指定した要素をDOMツリーから削除します。
     * @param {HTMLElement} element 削除対象のHTML要素
     * @returns {HTMLElement|null} 削除された要素、または存在しない場合はnull
     * @protected
     */
    protected static _removeNode(element: HTMLElement): HTMLElement | null;
    /**
     * 指定した要素のすべての子要素を削除します。
     * @param {HTMLElement} element 対象のHTML要素
     * @protected
     */
    protected static _removeChildNodes(element: HTMLElement): void;
    /**
     * 指定した要素に特定のクラスが設定されているかを判定します。
     * @param {HTMLElement} element 対象のHTML要素
     * @param {string} classname 確認するクラス名
     * @returns {boolean} クラスが設定されている場合はtrue、設定されていない場合はfalse
     * @protected
     */
    protected static _isSetClass(element: HTMLElement, classname: string): boolean;
    /**
     * 指定した要素にクラスを追加します。
     * 既に追加されている場合は無視されます。
     * @param {HTMLElement} element 対象のHTML要素
     * @param {string} classname 追加するクラス名
     */
    static _addClass(element: HTMLElement, classname: string): void;
    /**
     * 指定した要素からクラスを削除します。
     * @param {HTMLElement} element 対象のHTML要素
     * @param {string} classname 削除するクラス名
     */
    static _removeClass(element: HTMLElement, classname: string): void;
    /**
     * SBaseのインスタンスを生成します。
     * @param {string} elementtype 要素のタグ名
     * @param {string|string[]} [title] 初期テキスト
     */
    constructor(elementtype: string, title?: string | string[]);
    /**
     * 内部のエレメントのID
     * @type {string}
     */
    id: string;
    /**
     * エレメント同士を接続するエレメントのID
     * @type {string}
     */
    wallid: string;
    /**
     * 表示中かどうか
     * @type {boolean}
     */
    isshow: boolean;
    /**
     * 管理対象のエレメント
     * @type {HTMLElement}
     * @private
     */
    private _element;
    /**
     * 区切り用のエレメント
     * @type {HTMLElement}
     * @private
     */
    private _wall;
    /**
     * タグ名
     * @type {string}
     */
    elementtype: string;
    /**
     * 大きさのを表す数値の型
     * @type {string}
     */
    unit: string;
    /**
     * 現在の横幅（数値）を取得します。
     * @returns {number|null} 横幅の数値。設定されていない場合はnull
     */
    getWidth(): number | null;
    /**
     * 現在の縦幅（数値）を取得します。
     * @returns {number|null} 縦幅の数値。設定されていない場合はnull
     */
    getHeight(): number | null;
    /**
     * サイズ
     * @typedef {Object} SSizeData
     * @property {number} width 横幅
     * @property {number} height 縦幅
     */
    /**
     * 現在のサイズ（width/height）を取得します。
     * @returns {SSizeData} サイズ情報のオブジェクト
     */
    getSize(): {
        /**
         * 横幅
         */
        width: number;
        /**
         * 縦幅
         */
        height: number;
    };
    /**
     * 横幅を設定します。
     * @param {number} width 横幅（数値）
     */
    setWidth(width: number): void;
    /**
     * 縦幅を設定します。
     * @param {number} height 縦幅（数値）
     */
    setHeight(height: number): void;
    /**
     * 横幅・縦幅をまとめて設定します。
     * @param {number} width 横幅
     * @param {number} height 縦幅
     */
    setSize(width: number, height: number): void;
    /**
     * 自身のエレメントと区切りエレメントをDOMツリーから削除します。
     */
    removeMe(): void;
    /**
     * 要素がDOMに追加された際に呼ばれるコールバックです。（デフォルトでは何もしません）
     */
    onAdded(): void;
    /**
     * 区切り用のエレメントを取得します。
     * @param {number} [type=SBase.PUT_TYPE.IN] 区切りのタイプ
     * @returns {HTMLElement} 区切り用のHTML要素
     */
    getWall(type?: number): HTMLElement;
    /**
     * この要素がコンテナ要素かどうかを判定します。
     * @returns {boolean} コンテナ要素の場合はtrue、それ以外はfalse
     */
    isContainer(): boolean;
    /**
     * コンテナ要素（子要素を格納できるエレメント）を取得します。
     * @returns {HTMLElement|null} コンテナ要素。存在しない場合はnull
     */
    getContainerElement(): HTMLElement | null;
    /**
     * 内部のエレメントを初期化します。
     * @private
     */
    private _initElement;
    /**
     * 管理しているHTMLエレメントを取得します。
     * @returns {HTMLElement|HTMLInputElement}
     */
    get element(): HTMLElement | HTMLInputElement;
    /**
     * 指定したターゲットに自身を指定タイプで配置します。
     * @param {SBase} targetComponent 配置先
     * @param {number} type SBase.PUT_TYPE
     */
    put(targetComponent: SBase, type: number): void;
    /**
     * 指定したターゲット（IDまたはSBase）に自身を指定タイプで配置します。
     * @param {SBase|string} target 配置先
     * @param {number} type 配置タイプ
     */
    putMe(target: SBase | string, type: number): void;
    /**
     * 要素が可視状態かどうかを判定します。
     * @returns {boolean} 可視の場合はtrue
     */
    isVisible(): boolean;
    /**
     * 要素の可視状態を設定します。
     * @param {boolean} isvisible trueで表示、falseで非表示
     */
    setVisible(isvisible: boolean): void;
    /**
     * テキストノードを取得します。
     * @returns {Node|null} テキストノード。なければnull
     */
    getTextNode(): Node | null;
    /**
     * テキストノード以外の要素ノードを取得します。
     * @returns {Node|null} 最初の要素ノード。なければnull
     */
    getElementNode(): Node | null;
    /**
     * Value属性を持つ編集可能なノードを取得します。
     * （デフォルトではnull。継承先でオーバーライド）
     * @returns {HTMLInputElement|null} 編集可能ノード。なければnull
     */
    getEditableNodeForValue(): HTMLInputElement | null;
    /**
     * nodeValueを持つ編集可能なノードを取得します。
     * @returns {Node|null} 編集可能ノード。なければnull
     */
    getEditableNodeForNodeValue(): Node | null;
    /**
     * 内部のテキストを設定します。
     * @param {string|string[]} title 設定するテキスト
     */
    setText(title: string | string[]): void;
    /**
     * 内部のテキストを取得します。
     * @returns {string|string[]} テキスト
     */
    getText(): string | string[];
    /**
     * 有効状態を管理するHTML要素を取得します。
     * @returns {HTMLElement|null} 有効状態を管理するHTML要素、またはnull
     */
    getEnabledElement(): HTMLElement | null;
    /**
     * 要素の有効/無効状態を設定します。
     * @param {boolean} isenabled trueで有効、falseで無効
     */
    setEnabled(isenabled: boolean): void;
    /**
     * 要素が有効かどうかを判定します。
     * @returns {boolean} 有効な場合はtrue、無効な場合はfalse
     */
    isEnabled(): boolean;
    /**
     * 内部エレメントのIDを取得します。
     * @returns {string} ID文字列
     */
    getId(): string;
    /**
     * ユニットの型（px/em/%など）を取得します。
     * @returns {string} ユニット型
     */
    getUnit(): string;
    /**
     * ユニットの型を設定します。
     * @param {string} UNIT_TYPE 設定するユニット型
     */
    setUnit(UNIT_TYPE: string): void;
    /**
     * 要素に指定したクラスを追加します。
     * @param {string} classname 追加するクラス名
     */
    addClass(classname: string): void;
    /**
     * オブジェクトを文字列として返します。
     * @returns {string} 例: "div(SComponent_1)"
     */
    toString(): string;
}
declare namespace SBase {
    namespace PUT_TYPE {
        let IN: number;
        let RIGHT: number;
        let NEWLINE: number;
    }
    /**
     * 配置方法の定数
     */
    type PUT_TYPE = number;
    namespace UNIT_TYPE {
        let PX: string;
        let EM: string;
        let PERCENT: string;
    }
    /**
     * 単位の種類
     */
    type UNIT_TYPE = string;
    namespace LABEL_POSITION {
        export let LEFT: number;
        let RIGHT_1: number;
        export { RIGHT_1 as RIGHT };
    }
    /**
     * ラベルの位置指定
     */
    type LABEL_POSITION = number;
    namespace CLASS_NAME {
        export let MOUSEOVER: string;
        export let MOUSEDOWN: string;
        export let DISABLED: string;
        export let COMPONENT: string;
        let NEWLINE_1: string;
        export { NEWLINE_1 as NEWLINE };
        export let CLOSE: string;
        export let OPEN: string;
        export let SPACE: string;
        export let CONTENTSBOX: string;
        export let PANEL: string;
        export let PANEL_LEGEND: string;
        export let SLIDEPANEL: string;
        export let SLIDEPANEL_LEGEND: string;
        export let SLIDEPANEL_SLIDE: string;
        export let GROUPBOX: string;
        export let GROUPBOX_LEGEND: string;
        export let IMAGEPANEL: string;
        export let LABEL: string;
        export let SELECT: string;
        export let COMBOBOX: string;
        export let CHECKBOX: string;
        export let CHECKBOX_IMAGE: string;
        export let BUTTON: string;
        export let FILELOAD: string;
        export let FILESAVE: string;
        export let CANVAS: string;
        export let PROGRESSBAR: string;
        export let SLIDER: string;
        export let COLORPICKER: string;
    }
    /**
     * クラス名の定数群（CSSと連携）
     */
    type CLASS_NAME = string;
    let _counter: number;
}
