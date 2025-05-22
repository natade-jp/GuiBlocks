'use strict';

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
class SBase {
	/**
	 * SBaseのインスタンスを生成します。
	 * @param {string} elementtype 要素のタグ名
	 * @param {string|string[]} [title] 初期テキスト
	 */
	constructor(elementtype, title) {
		/**
		 * 内部のエレメントのID
		 * @type {string}
		 */
		this.id = "SComponent_" + (SBase._counter++).toString(16);

		/**
		 * エレメント同士を接続するエレメントのID
		 * @type {string}
		 */
		this.wallid = "SComponent_" + (SBase._counter++).toString(16);

		/**
		 * 表示中かどうか
		 * @type {boolean}
		 */
		this.isshow = false;

		/**
		 * 管理対象のエレメント
		 * @type {HTMLElement}
		 * @private
		 */
		this._element = null;

		/**
		 * 区切り用のエレメント
		 * @type {HTMLElement}
		 * @private
		 */
		this._wall = null;

		/**
		 * タグ名
		 * @type {string}
		 */
		this.elementtype = elementtype;

		/**
		 * 大きさのを表す数値の型
		 * @type {string}
		 */
		this.unit = SBase.UNIT_TYPE.EM;

		this._initElement();

		if (title) {
			this.setText(title);
		}
	}

	/**
	 * 指定した要素にマウスイベント（タッチ・クリック）を登録します。
	 * @param {HTMLElement} element イベントを追加する対象のHTML要素
	 * @protected
	 */
	static _attachMouseEvent(element) {
		const mouseevent = {
			over: function () {
				SBase._addClass(element, SBase.CLASS_NAME.MOUSEOVER);
			},
			out: function () {
				SBase._removeClass(element, SBase.CLASS_NAME.MOUSEOVER);
				SBase._removeClass(element, SBase.CLASS_NAME.MOUSEDOWN);
			},
			down: function () {
				SBase._addClass(element, SBase.CLASS_NAME.MOUSEDOWN);
			},
			up: function () {
				SBase._removeClass(element, SBase.CLASS_NAME.MOUSEDOWN);
			}
		};
		element.addEventListener("touchstart", mouseevent.over, false);
		element.addEventListener("touchend", mouseevent.up, false);
		element.addEventListener("mouseover", mouseevent.over, false);
		element.addEventListener("mouseout", mouseevent.out, false);
		element.addEventListener("mousedown", mouseevent.down, false);
		element.addEventListener("mouseup", mouseevent.up, false);
	}

	/**
	 * 指定したIDの要素をDOMツリーから削除します。
	 * @param {string} id 削除対象の要素のID
	 * @returns {HTMLElement|null} 削除された要素、または存在しない場合はnull
	 * @protected
	 */
	static _removeNodeForId(id) {
		const element = document.getElementById(id);
		SBase._removeNode(element);
		return element;
	}

	/**
	 * コンポーネントをターゲットに指定した方法で配置します。
	 * @param {string|SBase} target 配置先のターゲット（IDまたはSBaseインスタンス）
	 * @param {SBase} component 配置するコンポーネント
	 * @param {number} type 配置タイプ（SBase.PUT_TYPE）
	 * @throws {string} 不正な引数や配置先が見つからない場合に例外をスロー
	 * @protected
	 */
	static _AputB(target, component, type) {
		if (!target || !component || !(component instanceof SBase)) {
			throw "IllegalArgumentException";
		} else if (target === component) {
			throw "it referenced me";
		} else if (type !== SBase.PUT_TYPE.IN && type !== SBase.PUT_TYPE.RIGHT && type !== SBase.PUT_TYPE.NEWLINE) {
			throw "IllegalArgumentException";
		}
		let node = null;
		if (typeof target === "string") {
			node = document.getElementById(target);
		} else if (target instanceof SBase) {
			if (type === SBase.PUT_TYPE.IN) {
				if (target.isContainer()) {
					node = target.getContainerElement();
				} else {
					throw "not Container";
				}
			} else {
				node = target.element;
			}
		}
		if (node === null) {
			throw "Not Found " + target;
		}
		// この時点で
		// node は HTML要素 となる。
		// component は SBase となる。

		/**
		 * @param {HTMLElement} newNode
		 * @param {HTMLElement} referenceNode
		 */
		const insertNext = function (newNode, referenceNode) {
			if (referenceNode.nextSibling) {
				referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
			} else {
				referenceNode.parentNode.appendChild(newNode);
			}
		};

		// 移動前に自分を消去
		component.removeMe();

		if (type === SBase.PUT_TYPE.IN) {
			// 最後の行があるならば次の行へ
			component.onAdded();
			if (node.lastChild !== null) {
				component.getWall(SBase.PUT_TYPE.NEWLINE).style.display = "block";
				node.appendChild(component.getWall());
			}
			component.element.style.display = "inline-block";
			node.appendChild(component.element);
		} else {
			if (node.parentNode === null) {
				throw "not found element on the html";
			}
			component.onAdded();
			insertNext(component.getWall(type), node);
			insertNext(component.element, component.getWall(type));
			if (type === SBase.PUT_TYPE.RIGHT) {
				node.style.display = "inline-block";
				component.getWall(type).style.display = "inline-block";
				component.element.style.display = "inline-block";
			} else if (type === SBase.PUT_TYPE.NEWLINE) {
				node.style.display = "inline-block";
				component.getWall(type).style.display = "block";
				component.element.style.display = "inline-block";
			}
		}
	}

	/**
	 * 指定した要素にブール属性を設定または削除します。
	 * @param {HTMLElement} element 対象のHTML要素
	 * @param {string} attribute 設定する属性名
	 * @param {boolean} isset 属性を設定する場合はtrue、削除する場合はfalse
	 * @throws {string} 不正な引数の場合に例外をスロー
	 * @protected
	 */
	static _setBooleanAttribute(element, attribute, isset) {
		if (typeof attribute !== "string" || typeof isset !== "boolean") {
			throw "IllegalArgumentException";
		}
		const checked = element.getAttribute(attribute);
		if (!isset && checked === null) {
			// falseなので無効化させる。すでにチェック済みなら何もしなくてよい
			element.setAttribute(attribute, attribute);
		} else if (isset && checked !== null) {
			element.removeAttribute(attribute);
		}
	}

	/**
	 * 指定した要素にブール属性が設定されているかを確認します。
	 * @param {HTMLElement} element 対象のHTML要素
	 * @param {string} attribute 確認する属性名
	 * @returns {boolean} 属性が設定されている場合はtrue、設定されていない場合はfalse
	 * @throws {string} 不正な引数の場合に例外をスロー
	 * @protected
	 */
	static _isBooleanAttribute(element, attribute) {
		if (typeof attribute !== "string") {
			throw "IllegalArgumentException";
		}
		return element.getAttribute(attribute) === null;
	}

	/**
	 * 指定した要素をDOMツリーから削除します。
	 * @param {HTMLElement} element 削除対象のHTML要素
	 * @returns {HTMLElement|null} 削除された要素、または存在しない場合はnull
	 * @protected
	 */
	static _removeNode(element) {
		if (element) {
			if (element.parentNode) {
				element.parentNode.removeChild(element);
			}
		}
		return element;
	}

	/**
	 * 指定した要素のすべての子要素を削除します。
	 * @param {HTMLElement} element 対象のHTML要素
	 * @protected
	 */
	static _removeChildNodes(element) {
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		return;
	}

	/**
	 * 指定した要素に特定のクラスが設定されているかを判定します。
	 * @param {HTMLElement} element 対象のHTML要素
	 * @param {string} classname 確認するクラス名
	 * @returns {boolean} クラスが設定されている場合はtrue、設定されていない場合はfalse
	 * @protected
	 */
	static _isSetClass(element, classname) {
		const classdata = element.className;
		if (classdata === null) {
			return false;
		}
		const pattern = new RegExp("(^" + classname + "$)|( +" + classname + ")", "g");
		return pattern.test(classdata);
	}

	/**
	 * 指定した要素にクラスを追加します。
	 * 既に追加されている場合は無視されます。
	 * @param {HTMLElement} element 対象のHTML要素
	 * @param {string} classname 追加するクラス名
	 */
	static _addClass(element, classname) {
		const classdata = element.className;
		if (classdata === null) {
			element.className = classname;
			return;
		}
		const pattern = new RegExp("(^" + classname + "$)|( +" + classname + ")", "g");
		if (pattern.test(classdata)) {
			return;
		}
		element.className = classdata + " " + classname;
	}

	/**
	 * 指定した要素からクラスを削除します。
	 * @param {HTMLElement} element 対象のHTML要素
	 * @param {string} classname 削除するクラス名
	 */
	static _removeClass(element, classname) {
		const classdata = element.className;
		if (classdata === null) {
			return;
		}
		const pattern = new RegExp("(^" + classname + "$)|( +" + classname + ")", "g");
		if (!pattern.test(classdata)) {
			return;
		}
		element.className = classdata.replace(pattern, "");
	}

	/**
	 * 現在の横幅（数値）を取得します。
	 * @returns {number|null} 横幅の数値。設定されていない場合はnull
	 */
	getWidth() {
		let width = this.element.style.width;
		if (width === null) {
			return null;
		}
		width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(width);
	}

	/**
	 * 現在の縦幅（数値）を取得します。
	 * @returns {number|null} 縦幅の数値。設定されていない場合はnull
	 */
	getHeight() {
		let height = this.element.style.height;
		if (height === null) {
			return null;
		}
		height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(height);
	}

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
	getSize() {
		return {
			width: this.getWidth(),
			height: this.getHeight()
		};
	}

	/**
	 * 横幅を設定します。
	 * @param {number} width 横幅（数値）
	 */
	setWidth(width) {
		if (typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.element.style.width = width.toString() + this.unit;
	}

	/**
	 * 縦幅を設定します。
	 * @param {number} height 縦幅（数値）
	 */
	setHeight(height) {
		if (typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.element.style.height = height.toString() + this.unit;
	}

	/**
	 * 横幅・縦幅をまとめて設定します。
	 * @param {number} width 横幅
	 * @param {number} height 縦幅
	 */
	setSize(width, height) {
		this.setWidth(width);
		this.setHeight(height);
	}
	/**
	 * 自身のエレメントと区切りエレメントをDOMツリーから削除します。
	 */
	removeMe() {
		SBase._removeNodeForId(this.id);
		SBase._removeNodeForId(this.wallid);
	}

	/**
	 * 要素がDOMに追加された際に呼ばれるコールバックです。（デフォルトでは何もしません）
	 */
	onAdded() {}

	/**
	 * 区切り用のエレメントを取得します。
	 * @param {number} [type=SBase.PUT_TYPE.IN] 区切りのタイプ
	 * @returns {HTMLElement} 区切り用のHTML要素
	 */
	getWall(type) {
		// すでに作成済みならそれを返して、作っていないければ作る
		if (this._wall) {
			return this._wall;
		}
		const wall = document.createElement("span");
		wall.id = this.wallid;
		if (type === SBase.PUT_TYPE.RIGHT) {
			wall.className = SBase.CLASS_NAME.SPACE;
		} else if (type === SBase.PUT_TYPE.NEWLINE) {
			wall.className = SBase.CLASS_NAME.NEWLINE;
		}
		wall.style.display = "inline-block";
		this._wall = wall;
		return wall;
	}

	/**
	 * この要素がコンテナ要素かどうかを判定します。
	 * @returns {boolean} コンテナ要素の場合はtrue、それ以外はfalse
	 */
	isContainer() {
		return this.getContainerElement() !== null;
	}

	/**
	 * コンテナ要素（子要素を格納できるエレメント）を取得します。
	 * @returns {HTMLElement|null} コンテナ要素。存在しない場合はnull
	 */
	getContainerElement() {
		return null;
	}

	/**
	 * 内部のエレメントを初期化します。
	 * @private
	 */
	_initElement() {
		if (this._element) {
			return;
		}

		/**
		 * @type {HTMLElement}
		 */
		const new_element = document.createElement(this.elementtype);
		new_element.id = this.id;
		new_element.className = SBase.CLASS_NAME.COMPONENT;
		new_element.style.display = "inline-block";
		this._element = new_element;
		SBase._attachMouseEvent(new_element);
	}

	/**
	 * 管理しているHTMLエレメントを取得します。
	 * @returns {HTMLElement|HTMLInputElement}
	 */
	get element() {
		return this._element;
	}

	/**
	 * 指定したターゲットに自身を指定タイプで配置します。
	 * @param {SBase} targetComponent 配置先
	 * @param {number} type SBase.PUT_TYPE
	 */
	put(targetComponent, type) {
		SBase._AputB(this, targetComponent, type);
		return;
	}

	/**
	 * 指定したターゲット（IDまたはSBase）に自身を指定タイプで配置します。
	 * @param {SBase|string} target 配置先
	 * @param {number} type 配置タイプ
	 */
	putMe(target, type) {
		SBase._AputB(target, this, type);
		return;
	}

	/**
	 * 要素が可視状態かどうかを判定します。
	 * @returns {boolean} 可視の場合はtrue
	 */
	isVisible() {
		if (this.element.style.visibility === null) {
			return true;
		}
		return this.element.style.visibility !== "hidden";
	}

	/**
	 * 要素の可視状態を設定します。
	 * @param {boolean} isvisible trueで表示、falseで非表示
	 */
	setVisible(isvisible) {
		if (isvisible) {
			this.element.style.visibility = "visible";
			this.getWall().style.visibility = "visible";
		} else {
			this.element.style.visibility = "hidden";
			this.getWall().style.visibility = "hidden";
		}
		return;
	}

	/**
	 * テキストノードを取得します。
	 * @returns {Node|null} テキストノード。なければnull
	 */
	getTextNode() {
		const element = this.element;
		// childNodes でテキストノードまで取得する
		const childnodes = element.childNodes;
		let textnode = null;
		let i = 0;
		for (i = 0; i < childnodes.length; i++) {
			if (childnodes[i] instanceof Text) {
				textnode = childnodes[i];
				break;
			}
		}
		// テキストノードがない場合は null をかえす
		return textnode;
	}

	/**
	 * テキストノード以外の要素ノードを取得します。
	 * @returns {Node|null} 最初の要素ノード。なければnull
	 */
	getElementNode() {
		const element = this.element;
		// children でテキストノード以外を取得する
		const childnodes = element.children;
		let node = null;
		let i = 0;
		for (i = 0; i < childnodes.length; i++) {
			if (!(childnodes[i] instanceof Text)) {
				node = childnodes[i];
				break;
			}
		}
		return node;
	}

	/**
	 * Value属性を持つ編集可能なノードを取得します。
	 * （デフォルトではnull。継承先でオーバーライド）
	 * @returns {HTMLInputElement|null} 編集可能ノード。なければnull
	 */
	getEditableNodeForValue() {
		// Value要素をもつもの
		return null;
	}

	/**
	 * nodeValueを持つ編集可能なノードを取得します。
	 * @returns {Node|null} 編集可能ノード。なければnull
	 */
	getEditableNodeForNodeValue() {
		// Value要素をもつなら、このメソッドは利用不可とする
		if (this.getEditableNodeForValue() !== null) {
			return null;
		}
		// nodeValue 要素をもつもの
		let textnode = this.getTextNode();
		// 見つからなかったら作成する
		if (textnode === null) {
			const element = this.element;
			textnode = document.createTextNode("");
			element.appendChild(textnode);
		}
		return textnode;
	}

	/**
	 * 内部のテキストを設定します。
	 * @param {string|string[]} title 設定するテキスト
	 */
	setText(title) {
		if (!title) {
			return;
		}
		let title_array = title instanceof Array ? title : [title];
		let node = null;
		node = this.getEditableNodeForValue();
		if (node) {
			node.value = title_array[0];
			return;
		}
		node = this.getEditableNodeForNodeValue();
		if (node) {
			node.nodeValue = title_array[0];
			return;
		}
	}

	/**
	 * 内部のテキストを取得します。
	 * @returns {string|string[]} テキスト
	 */
	getText() {
		let title = null;
		let node = null;
		node = this.getEditableNodeForValue();
		if (node) {
			title = node.value;
		}
		node = this.getEditableNodeForNodeValue();
		if (node) {
			title = node.nodeValue.trim();
		}
		return title === null ? "" : title;
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLElement|null} 有効状態を管理するHTML要素、またはnull
	 */
	getEnabledElement() {
		return null;
	}

	/**
	 * 要素の有効/無効状態を設定します。
	 * @param {boolean} isenabled trueで有効、falseで無効
	 */
	setEnabled(isenabled) {
		if (isenabled) {
			SBase._removeClass(this.element, SBase.CLASS_NAME.DISABLED);
		} else {
			SBase._addClass(this.element, SBase.CLASS_NAME.DISABLED);
		}
		const element = this.getEnabledElement();
		// disabled属性が利用可能ならつける
		if (element !== null) {
			SBase._setBooleanAttribute(element, "disabled", isenabled);
		}
	}

	/**
	 * 要素が有効かどうかを判定します。
	 * @returns {boolean} 有効な場合はtrue、無効な場合はfalse
	 */
	isEnabled() {
		return !SBase._isSetClass(this.element, SBase.CLASS_NAME.DISABLED);
	}

	/**
	 * 内部エレメントのIDを取得します。
	 * @returns {string} ID文字列
	 */
	getId() {
		return this.id;
	}

	/**
	 * ユニットの型（px/em/%など）を取得します。
	 * @returns {string} ユニット型
	 */
	getUnit() {
		return this.unit;
	}

	/**
	 * ユニットの型を設定します。
	 * @param {string} UNIT_TYPE 設定するユニット型
	 */
	setUnit(UNIT_TYPE) {
		this.unit = UNIT_TYPE;
	}

	/**
	 * 要素に指定したクラスを追加します。
	 * @param {string} classname 追加するクラス名
	 */
	addClass(classname) {
		return SBase._addClass(this.element, classname);
	}

	/**
	 * オブジェクトを文字列として返します。
	 * @returns {string} 例: "div(SComponent_1)"
	 */
	toString() {
		return this.elementtype + "(" + this.id + ")";
	}
}

/**
 * 配置方法の定数
 * @enum {number}
 */
SBase.PUT_TYPE = {
	IN: 0,
	RIGHT: 1,
	NEWLINE: 2
};

/**
 * 単位の種類
 * @enum {string}
 */
SBase.UNIT_TYPE = {
	PX: "px",
	EM: "em",
	PERCENT: "%"
};

/**
 * ラベルの位置指定
 * @enum {number}
 */
SBase.LABEL_POSITION = {
	LEFT: 0,
	RIGHT: 1
};

/**
 * クラス名の定数群（CSSと連携）
 * @enum {string}
 */
SBase.CLASS_NAME = {
	MOUSEOVER: "SCOMPONENT_MouseOver",
	MOUSEDOWN: "SCOMPONENT_MouseDown",
	DISABLED: "SCOMPONENT_Disabled",
	COMPONENT: "SCOMPONENT_Component",
	NEWLINE: "SCOMPONENT_Newline",
	CLOSE: "SCOMPONENT_Close",
	OPEN: "SCOMPONENT_Open",
	SPACE: "SCOMPONENT_Space",
	CONTENTSBOX: "SCOMPONENT_ContentsBox",
	PANEL: "SCOMPONENT_Panel",
	PANEL_LEGEND: "SCOMPONENT_PanelLegend",
	SLIDEPANEL: "SCOMPONENT_SlidePanel",
	SLIDEPANEL_LEGEND: "SCOMPONENT_SlidePanelLegend",
	SLIDEPANEL_SLIDE: "SCOMPONENT_SlidePanelSlide",
	GROUPBOX: "SCOMPONENT_GroupBox",
	GROUPBOX_LEGEND: "SCOMPONENT_GroupBoxLegend",
	IMAGEPANEL: "SCOMPONENT_ImagePanel",
	LABEL: "SCOMPONENT_Label",
	SELECT: "SCOMPONENT_Select",
	COMBOBOX: "SCOMPONENT_ComboBox",
	CHECKBOX: "SCOMPONENT_CheckBox",
	CHECKBOX_IMAGE: "SCOMPONENT_CheckBoxImage",
	BUTTON: "SCOMPONENT_Button",
	FILELOAD: "SCOMPONENT_FileLoad",
	FILESAVE: "SCOMPONENT_FileSave",
	CANVAS: "SCOMPONENT_Canvas",
	PROGRESSBAR: "SCOMPONENT_ProgressBar",
	SLIDER: "SCOMPONENT_Slider",
	COLORPICKER: "SCOMPONENT_ColorPicker"
};

SBase._counter = 0;

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
class SButton extends SBase {
	/**
	 * SButtonのインスタンスを生成します。
	 * @param {string} [title] ボタンに表示するテキスト
	 */
	constructor(title) {
		super("input", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);

		/**
		 * @type {HTMLInputElement}
		 */
		// @ts-ignore
		const element = this.element;

		element.type = "button";
	}

	/**
	 * Value属性を持つ編集可能なノードを取得します。
	 * @returns {HTMLInputElement} ボタン要素
	 */
	getEditableNodeForValue() {
		return /** @type {HTMLInputElement} */ (this.element);
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLElement} ボタン要素
	 */
	getEnabledElement() {
		return this.element;
	}

	/**
	 * ボタンのクリックイベントリスナーを追加します。
	 * @param {EventListenerOrEventListenerObject} func クリック時に呼び出される関数
	 */
	addListener(func) {
		this.element.addEventListener("click", func, false);
	}
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
class SCanvas extends SBase {
	constructor() {
		super("canvas");
		this.addClass(SBase.CLASS_NAME.CANVAS);

		/**
		 * @type {HTMLCanvasElement}
		 */
		// @ts-ignore
		this.canvas = this.element;

		this.setPixelSize(300, 150); // canvas のデフォルト値を設定する
	}

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
	 * @throws {string} 引数が不正な場合に例外をスローします
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
	 * 2D描画用コンテキストを取得します。
	 * @returns {CanvasRenderingContext2D} コンテキストオブジェクト
	 */
	getContext() {
		if (this.context === undefined) {
			this.context = this.canvas.getContext("2d");
		}
		return this.context;
	}

	/**
	 * キャンバスをクリアします。
	 * @returns {void}
	 */
	clear() {
		this.getContext().clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * 現在のキャンバス画像をImageDataとして取得します。
	 * @returns {ImageData} 画像データ
	 */
	getImageData() {
		return this.getContext().getImageData(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * ImageDataをキャンバスに描画します。
	 * @param {ImageData} imagedata - 描画する画像データ
	 */
	putImageData(imagedata) {
		this.getContext().putImageData(imagedata, 0, 0);
	}

	/**
	 * 内部的な画像描画関数（位置やサイズ調整）
	 * @param {CanvasImageSource|ImageData} image
	 * @param {boolean} isresizecanvas
	 * @param {number} drawsize
	 * @private
	 */
	_putImage(image, isresizecanvas, drawsize) {
		const pixelsize = this.canvas;
		let dx = 0,
			dy = 0;
		let width = pixelsize.width;
		let height = pixelsize.height;

		// @ts-ignore
		if (image.width === undefined || image.height === undefined) {
			return;
		}

		/**
		 * @type {number}
		 */
		// @ts-ignore
		const image_width = image.width;

		/**
		 * @type {number}
		 */
		// @ts-ignore
		const image_height = image.height;

		if (SCanvas.drawtype.ORIGINAL === drawsize) {
			width = image_width;
			height = image_height;
		} else if (SCanvas.drawtype.STRETCH === drawsize) {
			width = pixelsize.width;
			height = pixelsize.height;
		} else if (SCanvas.drawtype.FILL_ASPECT_RATIO === drawsize) {
			width = pixelsize.width;
			height = pixelsize.height;
		} else {
			width = image_width;
			height = image_height;
			if (SCanvas.drawtype.ASPECT_RATIO === drawsize) {
				if (width > pixelsize.width) {
					width = pixelsize.width;
					height = Math.floor(height * (width / image_width));
				}
				if (height > pixelsize.height) {
					width = Math.floor(width * (pixelsize.height / height));
					height = pixelsize.height;
				}
			}
			if (SCanvas.drawtype.LETTER_BOX === drawsize) {
				width = pixelsize.width;
				height = Math.floor(height * (width / image_width));
				if (height > pixelsize.height) {
					width = Math.floor(width * (pixelsize.height / height));
					height = pixelsize.height;
				}
				dx = Math.floor((pixelsize.width - width) / 2);
				dy = Math.floor((pixelsize.height - height) / 2);
				isresizecanvas = false;
			}
		}
		if (isresizecanvas) {
			this.setUnit(SBase.UNIT_TYPE.PX);
			this.setSize(width, height);
			this.setPixelSize(width, height);
		}
		this.clear();

		if (image instanceof ImageData) {
			this.context.putImageData(image, 0, 0, dx, dy, width, height);
		} else {
			this.context.drawImage(image, 0, 0, image_width, image_height, dx, dy, width, height);
		}
	}

	/**
	 * 多様な画像ソースを受け取りキャンバスに描画します。
	 * @param {ImageData|string|SCanvas|HTMLCanvasElement|HTMLImageElement|Blob|File} data
	 * @param {boolean} [isresizecanvas=false] - キャンバスサイズを変更するかどうか
	 * @param {number} [drawsize=SCanvas.drawtype.LETTER_BOX] - 描画サイズモード
	 * @param {Function} [drawcallback] - 描画完了時のコールバック
	 * @throws {string} 不正なデータ型が渡された場合
	 */
	putImage(data, isresizecanvas, drawsize, drawcallback) {
		if (!drawcallback) {
			drawcallback = null;
		}
		if (drawsize === undefined) {
			drawsize = SCanvas.drawtype.LETTER_BOX;
		}
		if (isresizecanvas === undefined) {
			isresizecanvas = false;
		}
		if (data instanceof Image || data instanceof ImageData) {
			// Image -> canvas, ImageData -> canvas
			this._putImage(data, isresizecanvas, drawsize);
			if (typeof drawcallback === "function") {
				drawcallback();
			}
		} else if (typeof data === "string") {
			const _this = this;
			const image = new Image();
			// URL(string) -> Image
			image.onload = function () {
				_this.putImage(image, isresizecanvas, drawsize, drawcallback);
			};
			image.src = data;
		} else if (data instanceof SCanvas) {
			// SCanvas -> canvas
			this.putImage(data.canvas, isresizecanvas, drawsize, drawcallback);
		} else if (data instanceof HTMLCanvasElement && data.tagName === "CANVAS") {
			// canvas -> URL(string)
			this.putImage(data.toDataURL(), isresizecanvas, drawsize, drawcallback);
		} else if (data instanceof Blob || data instanceof File) {
			const _this = this;
			const reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function () {
				// @ts-ignore
				_this.putImage(reader.result, isresizecanvas, drawsize, drawcallback);
			};
			reader.readAsDataURL(data);
		} else {
			throw "IllegalArgumentException";
		}
	}

	/**
	 * 現在のキャンバスをデータURLとして取得します。
	 * @param {string} [mime_type="image/png"] - 出力する画像のMIMEタイプ
	 * @returns {string} データURL
	 */
	toDataURL(mime_type) {
		if (!mime_type) {
			mime_type = "image/png";
		}
		return this.canvas.toDataURL(mime_type);
	}
}

/**
 * 描画サイズのモード定数
 * @enum {number}
 */
SCanvas.drawtype = {
	ORIGINAL: 0,
	ASPECT_RATIO: 1,
	STRETCH: 2,
	LETTER_BOX: 3,
	FILL_ASPECT_RATIO: 4
};

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
class SCheckBox extends SBase {
	/**
	 * SCheckBoxのインスタンスを生成します。
	 * @param {string} [title] - チェックボックスに表示するテキスト
	 */
	constructor(title) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.CHECKBOX);

		/**
		 * チェックボックスのinput要素
		 * @type {HTMLInputElement}
		 */
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = this.getId() + "_checkbox";
		checkbox.className = SBase.CLASS_NAME.CHECKBOX_IMAGE;
		this.checkbox = checkbox;

		/**
		 * チェックボックスに表示するテキストノード
		 * @type {Text}
		 */
		this.textnode = document.createTextNode(title ? title : "");

		const element = this.element;
		element.appendChild(this.checkbox);
		element.appendChild(this.textnode);
	}

	/**
	 * 有効状態を管理するHTML要素を取得します。
	 * @returns {HTMLElement} チェックボックス要素
	 */
	getEnabledElement() {
		return this.checkbox;
	}

	/**
	 * テキストノードを取得します。
	 * @returns {Text} ラベル用のテキストノード
	 */
	getTextNode() {
		return this.textnode;
	}

	/**
	 * input要素ノードを取得します。
	 * @returns {HTMLInputElement} チェックボックスのinput要素
	 */
	getElementNode() {
		return this.checkbox;
	}

	/**
	 * ラベルの位置を設定します。
	 * @param {number} LABEL_POSITION - ラベル位置定数（SBase.LABEL_POSITION）
	 */
	setLabelPosition(LABEL_POSITION) {
		// ラベルかどうか確認
		const element = this.element;
		const textnode = this.getTextNode();
		const elementnode = this.getElementNode();
		// 中身を一旦消去する
		SBase._removeChildNodes(element);
		// 配置を設定する
		if (LABEL_POSITION === SBase.LABEL_POSITION.LEFT) {
			// ラベル内のテキストは左側
			element.appendChild(textnode);
			element.appendChild(elementnode);
		} else {
			// ラベルのテキストは右側
			element.appendChild(elementnode);
			element.appendChild(textnode);
		}
		return;
	}

	/**
	 * チェックボックスのサイズを設定します。
	 * @param {number} size - サイズ（pxなど）
	 * @throws {string} 数値以外が指定された場合に例外をスロー
	 */
	setCheckBoxImageSize(size) {
		if (typeof size !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.checkbox.style.height = size.toString() + this.unit;
		this.checkbox.style.width = size.toString() + this.unit;
	}

	/**
	 * チェック状態変更時のイベントリスナーを追加します。
	 * @param {EventListenerOrEventListenerObject} func - コールバック関数
	 */
	addListener(func) {
		this.checkbox.addEventListener("change", func, false);
	}

	/**
	 * チェック状態を設定します。
	 * @param {boolean} ischecked - trueでチェック状態、falseで非チェック
	 */
	setChecked(ischecked) {
		this.checkbox.checked = ischecked;
	}

	/**
	 * 現在のチェック状態を取得します。
	 * @returns {boolean} チェックされていればtrue
	 */
	isChecked() {
		return this.checkbox.checked;
	}
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
class NTColor {
	/**
	 * コンストラクタ
	 */
	constructor() {
		// 中身は 0 ~ 1に正規化した値とする

		/**
		 * 赤色成分 [0.0,1.0]
		 * @types {number}
		 */
		this._r = 0.0;

		/**
		 * 緑色成分 [0.0,1.0]
		 * @types {number}
		 */
		this._g = 0.0;

		/**
		 * 青色成分 [0.0,1.0]
		 * @types {number}
		 */
		this._b = 0.0;

		/**
		 * 透明度成分 [0.0,1.0]
		 * @types {number}
		 */
		this._a = 1.0;
	}

	/**
	 * 色を表示できる範囲内 [0.0,1.0] に収める
	 * @returns {NTColor}
	 */
	limit() {
		const color = new NTColor();
		color._r = NTColor._limit(this._r);
		color._g = NTColor._limit(this._g);
		color._b = NTColor._limit(this._b);
		color._a = NTColor._limit(this._a);
		return color;
	}

	/**
	 * 色をアルファ値で焼きこむ
	 * @returns {NTColor}
	 */
	bake() {
		const color = new NTColor();
		color._r = this._r * this._a;
		color._g = this._g * this._a;
		color._b = this._b * this._a;
		color._a = 1.0;
		return color.limit();
	}

	/**
	 * 各色成分に加法混色を行う
	 * @param {NTColor} x
	 * @returns {NTColor}
	 */
	addColorMixture(x) {
		// 加法混色
		if (!(x instanceof NTColor)) {
			throw "IllegalArgumentException";
		}
		return NTColor.newColorNormalizedRGB(
			this._r + x._r * x._a,
			this._g + x._g * x._a,
			this._b + x._b * x._a,
			this._a
		);
	}

	/**
	 * 各色成分に減法混色を行う
	 * @param {NTColor} x
	 * @returns {NTColor}
	 */
	subColorMixture(x) {
		// 減法混色
		if (!(x instanceof NTColor)) {
			throw "IllegalArgumentException";
		}
		const r = Math.min(this._r, x._r);
		const g = Math.min(this._g, x._g);
		const b = Math.min(this._b, x._b);
		return NTColor.newColorNormalizedRGB(
			NTColor._mix(this._r, r, x._a),
			NTColor._mix(this._g, g, x._a),
			NTColor._mix(this._b, b, x._a),
			this._a
		);
	}

	/**
	 * 各色成分に掛け算を行う
	 * @param {NTColor|number} x
	 * @returns {NTColor}
	 */
	mul(x) {
		if (x instanceof NTColor) {
			return NTColor.newColorNormalizedRGB(this._r * x._r, this._g * x._g, this._b * x._b, this._a * x._a);
		} else if (typeof x === "number") {
			return NTColor.newColorNormalizedRGB(this._r * x, this._g * x, this._b * x, this._a);
		} else {
			throw "IllegalArgumentException";
		}
	}

	/**
	 * オブジェクトを複製する
	 * @returns {NTColor}
	 */
	clone() {
		const color = new NTColor();
		color._r = this._r;
		color._g = this._g;
		color._b = this._b;
		color._a = this._a;
		return color;
	}

	/**
	 * オブジェクトを比較する
	 * @param {NTColor} x
	 * @returns {boolean}
	 */
	equals(x) {
		return (
			NTColor._equals(this._r, x._r) &&
			NTColor._equals(this._g, x._g) &&
			NTColor._equals(this._b, x._b) &&
			NTColor._equals(this._a, x._a)
		);
	}

	/**
	 * 文字列化する
	 * @returns {string}
	 */
	toString() {
		return "NTColor[" + this.toCSSHex() + ", " + this.toCSS255() + ", " + this.toCSSPercent() + "]";
	}

	/**
	 * `v0 + (v1 - v0) * x` で線形補間する
	 * @param {number} v0
	 * @param {number} v1
	 * @param {number} x
	 * @returns {number}
	 * @private
	 */
	static _mix(v0, v1, x) {
		return v0 + (v1 - v0) * x;
	}

	/**
	 * 指定した値を [0.0,1.0] の範囲にする
	 * @param {number} x
	 * @returns {number}
	 * @private
	 */
	static _limit(x) {
		return Math.max(Math.min(x, 1.0), 0.0);
	}

	/**
	 * 指定した値を比較する
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 * @private
	 */
	static _equals(x, y) {
		const tolerance = Number.EPSILON;
		return Math.abs(x - y) < tolerance;
	}

	/**
	 * 指定した値を負の値へ整数化する
	 * @param {number} x
	 * @returns {number}
	 * @private
	 */
	static _flact(x) {
		return x - Math.floor(x);
	}

	/**
	 * 16進数の文字列化する
	 * @param {number} x
	 * @returns {string}
	 * @private
	 */
	static _hex(x) {
		const str = Math.round(x * 255.0).toString(16);
		if (str.length === 1) {
			return "0" + str;
		} else {
			return str;
		}
	}

	/**
	 * 少数3桁程度の固定小数点文字列を取得する
	 * @param {number} x
	 * @returns {string}
	 * @private
	 */
	static _ftos(x) {
		const i = Math.trunc(x);
		return i.toString() + "." + Math.round((x - i) * 1000);
	}

	/**
	 * 内部のデータを RGBA で書き換える
	 * @param {number} r [0.0,1.0]
	 * @param {number} g [0.0,1.0]
	 * @param {number} b [0.0,1.0]
	 * @param {number} [a] [0.0,1.0]
	 * @returns {NTColor}
	 * @private
	 */
	_setRGB(r, g, b, a) {
		this._r = r;
		this._g = g;
		this._b = b;
		if (a !== undefined) this._a = a;
		return this;
	}

	/**
	 * 内部のデータを HSVA で書き換える
	 * @param {number} h [0.0,1.0]
	 * @param {number} s [0.0,1.0]
	 * @param {number} v [0.0,1.0]
	 * @param {number} [a] [0.0,1.0]
	 * @returns {NTColor}
	 * @private
	 */
	_setHSV(h, s, v, a) {
		let i, f;

		this._r = v;
		this._g = v;
		this._b = v;
		if (a) this._a = a;

		if (s > 0.0) {
			h *= 6.0;
			i = ~~Math.floor(h);
			f = h - i;
			if (i === 0) {
				this._g *= 1.0 - s * (1.0 - f);
				this._b *= 1.0 - s;
			} else if (i === 1) {
				this._r *= 1.0 - s * f;
				this._b *= 1.0 - s;
			} else if (i === 2) {
				this._r *= 1.0 - s;
				this._b *= 1.0 - s * (1.0 - f);
			} else if (i === 3) {
				this._r *= 1.0 - s;
				this._g *= 1.0 - s * f;
			} else if (i === 4) {
				this._r *= 1.0 - s * (1.0 - f);
				this._g *= 1.0 - s;
			} else if (i === 5) {
				this._g *= 1.0 - s;
				this._b *= 1.0 - s * f;
			}
		}
		return this;
	}

	/**
	 * 内部のデータを HSLA で書き換える
	 * @param {number} h [0.0,1.0]
	 * @param {number} s [0.0,1.0]
	 * @param {number} l [0.0,1.0]
	 * @param {number} [a] [0.0,1.0]
	 * @returns {NTColor}
	 * @private
	 */
	_setHSL(h, s, l, a) {
		if (a) this._a = a;

		if (s === 0.0) {
			this._r = 0.0;
			this._g = 0.0;
			this._b = 0.0;
			return this;
		}

		let max;
		if (l < 0.5) {
			max = l * (1.0 + s);
		} else {
			max = l * (1.0 - s) + s;
		}
		const min = 2.0 * l - max;
		const delta = max - min;

		h *= 6.0;
		const i = ~~Math.floor(h);
		const f = h - i;

		if (i === 0) {
			this._r = max;
			this._g = max - delta * (1.0 - f);
			this._b = min;
		} else if (i === 1) {
			this._r = min + delta * (1.0 - f);
			this._g = max;
			this._b = min;
		} else if (i === 2) {
			this._r = min;
			this._g = max;
			this._b = max - delta * (1.0 - f);
		} else if (i === 3) {
			this._r = min;
			this._g = min + delta * (1.0 - f);
			this._b = max;
		} else if (i === 4) {
			this._r = max - delta * (1.0 - f);
			this._g = min;
			this._b = max;
		} else if (i === 5) {
			this._r = max;
			this._g = min;
			this._b = min + delta * (1.0 - f);
		}

		return this;
	}

	/**
	 * 内部のデータを RGBA の値で取得する
	 * @returns {{r: number, g: number, b: number, a: number}}
	 * @private
	 */
	_getRGB() {
		return {
			r: this._r,
			g: this._g,
			b: this._b,
			a: this._a
		};
	}

	/**
	 * 内部のデータを HSVA の値で取得する
	 * @returns {{h: number, s: number, v: number, a: number}}
	 * @private
	 */
	_getHSV() {
		const max = Math.max(this._r, this._g, this._b);
		const min = Math.min(this._r, this._g, this._b);
		const delta = max - min;

		let h = 0;
		let s = max - min;
		const v = max;

		if (max !== 0.0) {
			s /= max;
		}

		if (delta === 0.0) {
			return { h: h, s: s, v: v, a: this._a };
		}

		if (max === this._r) {
			h = (this._g - this._b) / delta;
			if (h < 0.0) {
				h += 6.0;
			}
		} else if (max === this._g) {
			h = 2.0 + (this._b - this._r) / delta;
		} else {
			h = 4.0 + (this._r - this._g) / delta;
		}
		h /= 6.0;

		return {
			h: h,
			s: s,
			v: v,
			a: this._a
		};
	}

	/**
	 * 内部のデータを HSLA の値で取得する
	 * @returns {{h: number, s: number, l: number, a: number}}
	 * @private
	 */
	_getHSL() {
		const max = Math.max(this._r, this._g, this._b);
		const min = Math.min(this._r, this._g, this._b);

		const l = (max + min) * 0.5;
		const delta = max - min;

		if (delta === 0) {
			return { h: 0, l: l, s: 0, a: this._a };
		}

		let s;
		if (l < 0.5) {
			s = delta / (max + min);
		} else {
			s = delta / (2.0 - max - min);
		}

		let h;
		if (max === this._r) {
			h = (this._g - this._b) / delta;
			if (h < 0.0) {
				h += 6.0;
			}
		} else if (max === this._g) {
			h = 2.0 + (this._b - this._r) / delta;
		} else {
			h = 4.0 + (this._r - this._g) / delta;
		}
		h /= 6.0;

		return {
			h: h,
			s: s,
			l: l,
			a: this._a
		};
	}

	/**
	 * [0.0,1.0] に正規化された ARGB の値を取得する
	 * @returns {{r: number, g: number, b: number, a: number}}
	 */
	toNormalizedRGB() {
		return this._getRGB();
	}

	/**
	 * [0,255] の ARGB の値を取得する
	 * @returns {{r: number, g: number, b: number, a: number}}
	 */
	toRGB() {
		return {
			r: Math.round(this._r * 255.0),
			g: Math.round(this._g * 255.0),
			b: Math.round(this._b * 255.0),
			a: Math.round(this._a * 255.0)
		};
	}

	/**
	 * 0x00RRGGBB の値を取得する
	 * @returns {number}
	 */
	toRRGGBB() {
		return (
			(Math.round(255.0 * NTColor._limit(this._r)) << 16) |
			(Math.round(255.0 * NTColor._limit(this._g)) << 8) |
			Math.round(255.0 * NTColor._limit(this._b))
		);
	}

	/**
	 * 0xAARRGGBB の値を取得する
	 * @returns {number}
	 */
	toAARRGGBB() {
		return (
			Math.round(255.0 * NTColor._limit(this._a)) * 0x1000000 +
			(Math.round(255.0 * NTColor._limit(this._r)) << 16) +
			(Math.round(255.0 * NTColor._limit(this._g)) << 8) +
			Math.round(255.0 * NTColor._limit(this._b))
		);
	}

	/**
	 * [0.0,1.0] に正規化された HSV の値を取得する
	 * @returns {{h: number, s: number, v: number, a: number}}
	 */
	toNormalizedHSV() {
		return this._getHSV();
	}

	/**
	 * [0,255] の HSV の値を取得する。ただし色相は [0,359] とする。
	 * @returns {{h: number, s: number, v: number, a: number}}
	 */
	toHSV() {
		const color = this.toNormalizedHSV();
		color.h = Math.round(color.h * 360.0);
		color.s = Math.round(color.s * 255.0);
		color.v = Math.round(color.v * 255.0);
		color.a = Math.round(color.a * 255.0);
		return color;
	}

	/**
	 * [0.0,1.0] に正規化された HSL の値を取得する
	 * @returns {{h: number, s: number, l: number, a: number}}
	 */
	toNormalizedHSL() {
		return this._getHSL();
	}

	/**
	 * [0,255] の HSL の値を取得する。ただし色相は [0,359] とする。
	 * @returns {{h: number, s: number, l: number, a: number}}
	 */
	toHSL() {
		const color = this.toNormalizedHSL();
		color.h = Math.round(color.h * 360.0);
		color.s = Math.round(color.s * 255.0);
		color.l = Math.round(color.l * 255.0);
		color.a = Math.round(color.a * 255.0);
		return color;
	}

	/**
	 * [0.0,1.0] の赤成分
	 * @returns {number}
	 */
	get r() {
		return this._r;
	}

	/**
	 * [0.0,1.0] の緑成分
	 * @returns {number}
	 */
	get g() {
		return this._g;
	}

	/**
	 * [0.0,1.0] の青成分
	 * @returns {number}
	 */
	get b() {
		return this._b;
	}

	/**
	 * [0.0,1.0] のアルファ成分
	 * @returns {number}
	 */
	get a() {
		return this._a;
	}

	/**
	 * [0,255] の赤成分
	 * @returns {number}
	 */
	get ir() {
		return Math.round(this._r * 255.0);
	}

	/**
	 * [0,255] の緑成分
	 * @returns {number}
	 */
	get ig() {
		return Math.round(this._g * 255.0);
	}

	/**
	 * [0,255] の青成分
	 * @returns {number}
	 */
	get ib() {
		return Math.round(this._b * 255.0);
	}

	/**
	 * [0,255] のアルファ成分
	 * @returns {number}
	 */
	get ia() {
		return Math.round(this._a * 255.0);
	}

	/**
	 * [0,100] の赤成分
	 * @returns {number}
	 */
	get pr() {
		return this._r * 100.0;
	}

	/**
	 * [0,100] の緑成分
	 * @returns {number}
	 */
	get pg() {
		return this._g * 100.0;
	}

	/**
	 * [0,100] の青成分
	 * @returns {number}
	 */
	get pb() {
		return this._b * 100.0;
	}

	/**
	 * [0,100] のアルファ成分
	 * @returns {number}
	 */
	get pa() {
		return this._a * 100.0;
	}

	/**
	 * 明るい色を取得する
	 * @returns {NTColor}
	 */
	brighter() {
		const FACTOR = 1.0 / 0.7;
		return this.mul(FACTOR).limit();
	}

	/**
	 * 暗い色を取得する
	 * @returns {NTColor}
	 */
	darker() {
		const FACTOR = 0.7;
		return this.mul(FACTOR).limit();
	}

	/**
	 * CSSで使用できる16進数の色情報のテキストを取得する
	 * @returns {string}
	 */
	toCSSHex() {
		const out = this.limit();
		if (NTColor._equals(this.a, 1.0)) {
			return "#" + NTColor._hex(out.r) + NTColor._hex(out.g) + NTColor._hex(out.b);
		} else {
			return "#" + NTColor._hex(out.a) + NTColor._hex(out.r) + NTColor._hex(out.g) + NTColor._hex(out.b);
		}
	}

	/**
	 * CSSで使用できる `rgb()`/`rgba()` の色情報のテキストを取得する
	 * @returns {string}
	 */
	toCSS255() {
		const out = this.limit();
		if (NTColor._equals(out.a, 1.0)) {
			return "rgb(" + out.ir + "," + out.ig + "," + out.ib + ")";
		} else {
			return "rgba(" + out.ir + "," + out.ig + "," + out.ib + "," + NTColor._ftos(out.a) + ")";
		}
	}

	/**
	 * CSSで使用できるパーセンテージのrgb/rgbaの色情報のテキストを取得する
	 * @returns {string}
	 */
	toCSSPercent() {
		const out = this.limit();
		if (NTColor._equals(out.a, 1.0)) {
			return "rgb(" + Math.round(out.pr) + "%," + Math.round(out.pg) + "%," + Math.round(out.pb) + "%)";
		} else {
			return (
				"rgba(" +
				Math.round(out.pr) +
				"%," +
				Math.round(out.pg) +
				"%," +
				Math.round(out.pb) +
				"%," +
				Math.round(out.pa) +
				"%)"
			);
		}
	}

	/**
	 * 指定した透明度の色情報を作成して取得する
	 * @param {number} a
	 * @returns {NTColor}
	 */
	setAlpha(a) {
		const color = this.clone();
		color._a = a;
		return color;
	}

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
	static newColorNormalizedRGB(color_or_r, g, b, a) {
		let in_r = 0.0;
		let in_g = 0.0;
		let in_b = 0.0;
		let in_a = 1.0;
		if (arguments.length === 1) {
			if (typeof color_or_r === "object") {
				if (!Array.isArray(color_or_r)) {
					if (color_or_r.r !== undefined) in_r = color_or_r.r;
					if (color_or_r.g !== undefined) in_g = color_or_r.g;
					if (color_or_r.b !== undefined) in_b = color_or_r.b;
					if (color_or_r.a !== undefined) in_a = color_or_r.a;
				} else {
					if (color_or_r.length >= 3) {
						in_r = color_or_r[0];
						in_g = color_or_r[1];
						in_b = color_or_r[2];
					}
					if (color_or_r.length >= 4) {
						in_a = color_or_r[3];
					}
				}
			} else {
				throw "newColorNormalizedRGB";
			}
		} else {
			if (arguments.length >= 3) {
				in_r = arguments[0];
				in_g = g;
				in_b = b;
			}
			if (arguments.length >= 4) {
				in_a = a;
			}
		}
		// 出力時にLimitする。入力時にはLimitしない。
		const color = new NTColor();
		color._setRGB(in_r, in_g, in_b, in_a);
		return color;
	}

	/**
	 * 指定した 0...255 の色情報からオブジェクトを作成する
	 * @param {number|NTColorInputColorRGBA|number[]} color_or_aarrggbb
	 * @param {number|boolean} [g_or_is_load_alpha = false]
	 * @param {number} [b]
	 * @param {number} [a=255.0]
	 * @returns {NTColor}
	 */
	static newColorRGB(color_or_aarrggbb, g_or_is_load_alpha, b, a) {
		let in_r = 0.0;
		let in_g = 0.0;
		let in_b = 0.0;
		let in_a = 255.0;
		if (arguments.length <= 2) {
			if (typeof color_or_aarrggbb === "number") {
				in_r = (color_or_aarrggbb >> 16) & 0xff;
				in_g = (color_or_aarrggbb >> 8) & 0xff;
				in_b = color_or_aarrggbb & 0xff;
				if (color_or_aarrggbb > 0xffffff || g_or_is_load_alpha) {
					in_a = (color_or_aarrggbb >> 24) & 0xff;
				}
			} else if (typeof color_or_aarrggbb === "object") {
				if (!Array.isArray(color_or_aarrggbb)) {
					if (color_or_aarrggbb.r !== undefined) in_r = color_or_aarrggbb.r;
					if (color_or_aarrggbb.g !== undefined) in_g = color_or_aarrggbb.g;
					if (color_or_aarrggbb.b !== undefined) in_b = color_or_aarrggbb.b;
					if (color_or_aarrggbb.a !== undefined) in_a = color_or_aarrggbb.a;
				} else {
					if (color_or_aarrggbb.length >= 3) {
						in_r = color_or_aarrggbb[0];
						in_g = color_or_aarrggbb[1];
						in_b = color_or_aarrggbb[2];
					}
					if (color_or_aarrggbb.length >= 4) {
						in_a = color_or_aarrggbb[3];
					}
				}
			} else {
				throw "newColorNormalizedRGB";
			}
		} else if (arguments.length >= 3) {
			in_r = arguments[0];
			in_g = arguments[1];
			in_b = arguments[2];
			if (arguments.length >= 4) {
				in_a = arguments[3];
			}
		}
		// 出力時にLimitする。入力時にはLimitしない。
		const color = new NTColor();
		color._setRGB(in_r / 255.0, in_g / 255.0, in_b / 255.0, in_a / 255.0);
		return color;
	}

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
	static newColorNormalizedHSV(color_or_h, s, v, a) {
		let in_h = 0.0;
		let in_s = 0.0;
		let in_v = 0.0;
		let in_a = 1.0;
		if (arguments.length === 1) {
			if (typeof color_or_h === "object") {
				if (!Array.isArray(color_or_h)) {
					if (color_or_h.h !== undefined) in_h = color_or_h.h;
					if (color_or_h.s !== undefined) in_s = color_or_h.s;
					if (color_or_h.v !== undefined) in_v = color_or_h.v;
					if (color_or_h.a !== undefined) in_a = color_or_h.a;
				} else {
					if (color_or_h.length >= 3) {
						in_h = color_or_h[0];
						in_s = color_or_h[1];
						in_v = color_or_h[2];
					}
					if (color_or_h.length >= 4) {
						in_a = color_or_h[3];
					}
				}
			} else {
				throw "newColorNormalizedHSV";
			}
		} else {
			if (arguments.length >= 3) {
				in_h = arguments[0];
				in_s = s;
				in_v = v;
			}
			if (arguments.length >= 4) {
				in_a = a;
			}
		}
		// HSVの計算上この時点でLimitさせる
		in_s = NTColor._limit(in_s);
		in_v = NTColor._limit(in_v);
		const color = new NTColor();
		color._setHSV(NTColor._flact(in_h), in_s, in_v, in_a);
		return color;
	}

	/**
	 * 指定した 0...360, 0...255 の色情報からオブジェクトを作成する
	 * @param {number|NTColorInputColorHSVA|number[]} color_or_h
	 * @param {number} [s]
	 * @param {number} [v]
	 * @param {number} [a=255.0]
	 * @returns {NTColor}
	 */
	static newColorHSV(color_or_h, s, v, a) {
		let in_h = 0.0;
		let in_s = 0.0;
		let in_v = 0.0;
		let in_a = 255.0;
		if (arguments.length <= 2) {
			if (typeof color_or_h === "object") {
				if (!Array.isArray(color_or_h)) {
					if (color_or_h.h !== undefined) in_h = color_or_h.h;
					if (color_or_h.s !== undefined) in_s = color_or_h.s;
					if (color_or_h.v !== undefined) in_v = color_or_h.v;
					if (color_or_h.a !== undefined) in_a = color_or_h.a;
				} else {
					if (color_or_h.length >= 3) {
						in_h = color_or_h[0];
						in_s = color_or_h[1];
						in_v = color_or_h[2];
					}
					if (color_or_h.length >= 4) {
						in_a = color_or_h[3];
					}
				}
			} else {
				throw "newColorNormalizedRGB";
			}
		} else if (arguments.length >= 3) {
			in_h = arguments[0];
			in_s = s;
			in_v = v;
			if (arguments.length >= 4) {
				in_a = a;
			}
		}
		return NTColor.newColorNormalizedHSV(in_h / 360.0, in_s / 255.0, in_v / 255.0, in_a / 255.0);
	}

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
	static newColorNormalizedHSL(color_or_h, s, l, a) {
		let in_h = 0.0;
		let in_s = 0.0;
		let in_l = 0.0;
		let in_a = 1.0;
		if (arguments.length === 1) {
			if (typeof color_or_h === "object") {
				if (!Array.isArray(color_or_h)) {
					if (color_or_h.h !== undefined) in_h = color_or_h.h;
					if (color_or_h.s !== undefined) in_s = color_or_h.s;
					if (color_or_h.l !== undefined) in_l = color_or_h.l;
					if (color_or_h.a !== undefined) in_a = color_or_h.a;
				} else {
					if (color_or_h.length >= 3) {
						in_h = color_or_h[0];
						in_s = color_or_h[1];
						in_l = color_or_h[2];
					}
					if (color_or_h.length >= 4) {
						in_a = color_or_h[3];
					}
				}
			} else {
				throw "newColorNormalizedHSL";
			}
		} else {
			if (arguments.length >= 3) {
				in_h = arguments[0];
				in_s = s;
				in_l = l;
			}
			if (arguments.length >= 4) {
				in_a = a;
			}
		}
		// HLSの計算上この時点でLimitさせる
		in_s = NTColor._limit(in_s);
		in_l = NTColor._limit(in_l);
		const color = new NTColor();
		color._setHSL(NTColor._flact(in_h), in_s, in_l, in_a);
		return color;
	}

	/**
	 * 指定した 0...360, 0...255 の色情報からオブジェクトを作成する
	 * @param {number|NTColorInputColorHSLA|number[]} color_or_h
	 * @param {number} s
	 * @param {number} l
	 * @param {number} [a=255.0]
	 * @returns {NTColor}
	 */
	static newColorHSL(color_or_h, s, l, a) {
		let in_h = 0.0;
		let in_s = 0.0;
		let in_l = 0.0;
		let in_a = 255.0;
		if (arguments.length <= 2) {
			if (typeof color_or_h === "object") {
				if (!Array.isArray(color_or_h)) {
					if (color_or_h.h !== undefined) in_h = color_or_h.h;
					if (color_or_h.s !== undefined) in_s = color_or_h.s;
					if (color_or_h.l !== undefined) in_l = color_or_h.l;
					if (color_or_h.a !== undefined) in_a = color_or_h.a;
				} else {
					if (color_or_h.length >= 3) {
						in_h = color_or_h[0];
						in_s = color_or_h[1];
						in_l = color_or_h[2];
					}
					if (color_or_h.length >= 4) {
						in_a = color_or_h[3];
					}
				}
			} else {
				throw "newColorNormalizedRGB";
			}
		} else if (arguments.length >= 3) {
			in_h = arguments[0];
			in_s = s;
			in_l = l;
			if (arguments.length >= 4) {
				in_a = a;
			}
		}
		return NTColor.newColorNormalizedHSL(in_h / 360.0, in_s / 255.0, in_l / 255.0, in_a / 255.0);
	}

	/**
	 * white
	 * @returns {NTColor}
	 */
	static get WHITE() {
		return NTColor.newColorRGB(0xffffff);
	}

	/**
	 * lightGray
	 * @returns {NTColor}
	 */
	static get LIGHT_GRAY() {
		return NTColor.newColorRGB(0xd3d3d3);
	}

	/**
	 * gray
	 * @returns {NTColor}
	 */
	static get GRAY() {
		return NTColor.newColorRGB(0x808080);
	}

	/**
	 * darkGray
	 * @returns {NTColor}
	 */
	static get DARK_GRAY() {
		return NTColor.newColorRGB(0xa9a9a9);
	}

	/**
	 * black
	 * @returns {NTColor}
	 */
	static get BLACK() {
		return NTColor.newColorRGB(0x000000);
	}

	/**
	 * red
	 * @returns {NTColor}
	 */
	static get RED() {
		return NTColor.newColorRGB(0xff0000);
	}

	/**
	 * pink
	 * @returns {NTColor}
	 */
	static get PINK() {
		return NTColor.newColorRGB(0xffc0cb);
	}

	/**
	 * orange
	 * @returns {NTColor}
	 */
	static get ORANGE() {
		return NTColor.newColorRGB(0xffa500);
	}

	/**
	 * yellow
	 * @returns {NTColor}
	 */
	static get YELLOW() {
		return NTColor.newColorRGB(0xffff00);
	}

	/**
	 * green
	 * @returns {NTColor}
	 */
	static get GREEN() {
		return NTColor.newColorRGB(0x008000);
	}

	/**
	 * magenta
	 * @returns {NTColor}
	 */
	static get MAGENTA() {
		return NTColor.newColorRGB(0xff00ff);
	}

	/**
	 * cyan
	 * @returns {NTColor}
	 */
	static get CYAN() {
		return NTColor.newColorRGB(0x00ffff);
	}

	/**
	 * blue
	 * @returns {NTColor}
	 */
	static get BLUE() {
		return NTColor.newColorRGB(0x0000ff);
	}
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
class SColorPicker extends SBase {
	constructor() {
		super("div");
		this.addClass(SBase.CLASS_NAME.COLORPICKER);

		const element = this.element;
		const that = this;

		/**
		 * HSLデータを管理するオブジェクト
		 * @type {SColorPickerData}
		 */
		const hls = {
			H: {
				div: document.createElement("div"),
				split: 6,
				value: 0.0,
				input: null,
				gauge: null,
				color_data: [],
				color_node: [],
				is_press: false
			},
			S: {
				div: document.createElement("div"),
				split: 1,
				value: 0.5,
				input: null,
				gauge: null,
				color_data: [],
				color_node: [],
				is_press: false
			},
			L: {
				div: document.createElement("div"),
				split: 2,
				value: 0.5,
				input: null,
				gauge: null,
				color_data: [],
				color_node: [],
				is_press: false
			}
		};

		for (let i = 0; i <= hls.H.split; i++) {
			const x = (1.0 / hls.H.split) * i;
			hls.H.color_data.push(NTColor.newColorNormalizedHSL([x, 1.0, 0.5]).toCSSHex());
		}

		// イベントをどこで発生させたか分かるように、
		// 関数を戻り値としてもどし、戻り値として戻した関数を
		// イベント発生時に呼び出すようにしています。

		/**
		 * 押したときにマウスの位置を取得して更新する
		 * @param {string} name
		 * @returns {EventListenerOrEventListenerObject}
		 */
		const pushevent = function (name) {
			if (name !== "H" && name !== "L" && name !== "S") {
				return;
			}

			/**
			 * @param {MouseEvent} event
			 * @type {EventListenerOrEventListenerObject}
			 */
			const func = function (event) {
				if (Array.isArray(event)) event = event[0];
				if (hls[name].is_press) {
					const node = event.target;
					const element =
						node instanceof HTMLElement
							? node
							: event.currentTarget instanceof HTMLElement
							? event.currentTarget
							: null;
					if (!element) return;
					if (name === "H" || name === "L" || name === "S") {
						hls[name].value = event.offsetX / element.clientWidth;
					}
					that.redraw();
				}
			};
			return func;
		};

		/**
		 * 押した・離したの管理
		 * @param {string} name
		 * @param {boolean} is_press
		 * @returns {EventListenerOrEventListenerObject}
		 */
		const pressevent = function (name, is_press) {
			if (name !== "H" && name !== "L" && name !== "S") {
				return;
			}
			/**
			 * @type {EventListenerOrEventListenerObject}
			 */
			const func = function (event) {
				if (Array.isArray(event)) event = event[0];
				hls[name].is_press = is_press;
				if (is_press) {
					const myfunc = pushevent(name);
					if (typeof myfunc === "function") {
						myfunc(event);
					}
				}
			};
			return func;
		};

		/**
		 *インプットボックスの変更
		 * @param {string} name
		 * @returns {EventListenerOrEventListenerObject}
		 */
		const inputevent = function (name) {
			if (name !== "H" && name !== "L" && name !== "S") {
				return;
			}
			/**
			 * @type {EventListenerOrEventListenerObject}
			 */
			const func = function (event) {
				if (Array.isArray(event)) event = event[0];
				// イベントが発生したノードの取得
				let node = event.target;
				/**
				 * @type {HTMLInputElement}
				 */
				const inputbox =
					node instanceof HTMLInputElement
						? node
						: event.currentTarget instanceof HTMLInputElement
						? event.currentTarget
						: null;
				if (!inputbox) return;
				hls[name].value = parseFloat(inputbox.value) / 100.0;
				that.redraw();
			};
			return func;
		};

		/**
		 * 内部のカラーバーを作成
		 * @param {HTMLDivElement} target
		 * @param {string} name
		 */
		const createSelectBar = function (target, name) {
			if (name !== "H" && name !== "L" && name !== "S") {
				return;
			}

			const element_cover = document.createElement("div"); // クリック検出
			const element_gauge = document.createElement("div"); // ゲージ表示用
			const element_gradient = document.createElement("div"); // グラデーション作成用

			// レイヤーの初期設定
			target.style.position = "relative";
			element_cover.style.position = "absolute";
			element_gauge.style.position = "absolute";
			element_gradient.style.position = "absolute";
			element_cover.style.margin = "0px";
			element_cover.style.padding = "0px";
			element_gauge.style.margin = "0px";
			element_gauge.style.padding = "0px";
			element_gradient.style.margin = "0px";
			element_gradient.style.padding = "0px";

			// 上にかぶせるカバー
			element_cover.addEventListener("mousedown", pressevent(name, true), false);
			element_cover.addEventListener("mouseup", pressevent(name, false), false);
			element_cover.addEventListener("mouseout", pressevent(name, false), false);
			element_cover.addEventListener("mousemove", pushevent(name), false);
			element_cover.addEventListener("touchstart", pressevent(name, true), false);
			element_cover.addEventListener("touchend", pressevent(name, false), false);
			element_cover.addEventListener("touchcancel", pressevent(name, false), false);
			element_cover.dataset.name = name;
			element_cover.style.width = "100%";
			element_cover.style.height = "100%";
			element_cover.style.bottom = "0px";

			// ゲージ（横幅で｜を表す）
			element_gauge.style.width = "33%";
			element_gauge.style.height = "100%";
			element_gauge.style.bottom = "0px";
			element_gauge.style.borderStyle = "ridge";
			element_gauge.style.borderWidth = "0px 2px 0px 0px";
			hls[name].gauge = element_gauge;

			// グラデーション部分
			const split = hls[name].split;
			element_gradient.style.width = "100%";
			element_gradient.style.height = "100%";
			element_gradient.style.overflow = "hidden";
			for (let i = 0; i < split; i++) {
				const element_color = document.createElement("div");
				element_color.style.display = "inline-block";
				element_color.style.margin = "0px";
				element_color.style.padding = "0px";
				element_color.style.height = "100%";
				element_color.style.width = 100.0 / split + "%";
				element_color.style.background = "linear-gradient(to right, #000, #FFF)";
				hls[name].color_node.push(element_color);
				element_gradient.appendChild(element_color);
			}

			// 3つのレイヤーを結合
			target.appendChild(element_gradient);
			target.appendChild(element_gauge);
			target.appendChild(element_cover);
		};

		/**
		 * 1行を作成
		 * @param {string} name
		 */
		const createColorBar = function (name) {
			if (name !== "H" && name !== "L" && name !== "S") {
				return;
			}

			const element_text = document.createElement("span");
			const element_colorbar = document.createElement("div");
			const element_inputbox = document.createElement("input");

			// 位置の基本設定
			element_text.style.display = "inline-block";
			element_colorbar.style.display = "inline-block";
			element_inputbox.style.display = "inline-block";
			element_text.style.verticalAlign = "top";
			element_colorbar.style.verticalAlign = "top";
			element_inputbox.style.verticalAlign = "top";
			element_text.style.height = "100%";
			element_colorbar.style.height = "100%";
			element_inputbox.style.height = "100%";

			// 文字
			element_text.style.margin = "0px";
			element_text.style.padding = "0px";
			element_text.style.textAlign = "center";

			// 中央のバー
			element_colorbar.style.margin = "0px 0.5em 0px 0.5em";
			element_colorbar.style.padding = "0px";
			element_colorbar.style.borderStyle = "solid";
			element_colorbar.style.borderWidth = "1px";

			// 入力ボックス
			element_inputbox.addEventListener("input", inputevent(name), false);
			element_inputbox.type = "number";
			element_inputbox.style.margin = "0px";
			element_inputbox.style.padding = "0px";
			element_inputbox.style.borderStyle = "none";
			element_inputbox.min = "0.0";
			element_inputbox.max = "100.0";
			element_inputbox.step = "1.0";
			hls[name].input = element_inputbox;

			// 横幅調整
			element_text.style.width = "1.5em";
			element_colorbar.style.width = "calc(100% - 6.0em)";
			element_inputbox.style.width = "3.5em";

			// バーの内部を作成
			createSelectBar(element_colorbar, name);

			// バーのサイズ調整
			const target = hls[name].div;
			target.style.height = "1.2em";
			target.style.margin = "0.5em 0px 0.5em 0px";

			element_text.appendChild(document.createTextNode(name));
			target.appendChild(element_text);
			target.appendChild(element_colorbar);
			target.appendChild(element_inputbox);
		};

		// HSLの3つを作成する
		for (const key in hls) {
			createColorBar(key);
		}

		this.hls = hls;

		/**
		 * カラー変更時のリスナー関数群
		 * @type {Function[]}
		 */
		this.listener = [];

		// Elementを更新後にくっつける
		this.redraw();
		element.appendChild(this.hls.H.div);
		element.appendChild(this.hls.S.div);
		element.appendChild(this.hls.L.div);
	}

	/**
	 * カラーを設定します。
	 * @param {NTColor} color - 設定する色（NTColor型）
	 * @throws {string} 型が不正な場合に例外をスロー
	 */
	setColor(color) {
		if (!(color instanceof NTColor)) {
			throw "ArithmeticException";
		}
		const hls = this.hls;
		const c = color.toNormalizedHSL();
		hls.H.value = c.h;
		hls.S.value = c.s;
		hls.L.value = c.l;
		this.redraw();
	}

	/**
	 * 現在設定されている色を取得します。
	 * @returns {NTColor} 現在の色（NTColor型）
	 */
	getColor() {
		const hls = this.hls;
		const h = hls.H.value;
		const s = hls.S.value;
		const l = hls.L.value;
		return NTColor.newColorNormalizedHSL([h, s, l]);
	}

	/**
	 * カラーピッカーを再描画します。
	 */
	redraw() {
		const hls = this.hls;
		const h = hls.H.value;
		const s = hls.S.value;
		const l = hls.L.value;
		hls.S.color_data = [
			NTColor.newColorNormalizedHSL([h, 0.0, l]).toCSSHex(),
			NTColor.newColorNormalizedHSL([h, 1.0, l]).toCSSHex()
		];
		hls.L.color_data = [
			NTColor.newColorNormalizedHSL([h, s, 0.0]).toCSSHex(),
			NTColor.newColorNormalizedHSL([h, s, 0.5]).toCSSHex(),
			NTColor.newColorNormalizedHSL([h, s, 1.0]).toCSSHex()
		];
		for (const key in hls) {
			if (key !== "H" && key !== "L" && key !== "S") {
				return;
			}

			const data = hls[key].color_data;
			const node = hls[key].color_node;
			for (let i = 0; i < node.length; i++) {
				node[i].style.background = "linear-gradient(to right, " + data[i] + ", " + data[i + 1] + ")";
			}
			const value = Math.round(100.0 * hls[key].value);
			hls[key].gauge.style.width = value + "%";
			hls[key].input.value = value.toString();
		}
		for (let i = 0; i < this.listener.length; i++) {
			this.listener[i]();
		}
	}

	/**
	 * 値が変化した際に呼び出すリスナーを登録します。
	 * @param {Function} func - 変更時に実行する関数
	 */
	addListener(func) {
		this.listener.push(func);
	}
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
class SComboBox extends SBase {
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
class SFileLoadButton extends SBase {
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
class SFileSaveButton extends SBase {
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
class SGroupBox extends SBase {
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
	 * @returns {void}
	 */
	clear() {
		SBase._removeChildNodes(this.body);
	}
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
class SImagePanel extends SBase {
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
	 * @returns {void}
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
class SLabel extends SBase {
	/**
	 * SLabelのインスタンスを生成します。
	 * @param {string} [title] - ラベルに表示するテキスト
	 */
	constructor(title) {
		super("div", title);
		this.addClass(SBase.CLASS_NAME.LABEL);
	}

	/**
	 * コンテンツ配置用の要素を取得します。
	 * 通常は自身のdiv要素を返します。
	 * @returns {HTMLElement} ラベルの要素
	 */
	getContainerElement() {
		return this.element;
	}
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
class SPanel extends SBase {
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
class SProgressBar extends SBase {
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
class SSlidePanel extends SBase {
	/**
	 * SSlidePanelのインスタンスを生成します。
	 * @param {string} [title] - パネルのタイトル
	 */
	constructor(title) {
		super("div");
		this.addClass(SBase.CLASS_NAME.SLIDEPANEL);

		/**
		 * タイトル用のテキストノード
		 * @type {Text}
		 */
		this.textnode = document.createTextNode(title ? title : "");

		/**
		 * タイトル領域（クリック可能）
		 * @type {HTMLSpanElement}
		 */
		this.legend = document.createElement("span");
		SBase._addClass(this.legend, SBase.CLASS_NAME.SLIDEPANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.appendChild(this.textnode);

		/**
		 * スライドする領域
		 * @type {HTMLDivElement}
		 */
		this.slide = document.createElement("div");
		SBase._addClass(this.slide, SBase.CLASS_NAME.SLIDEPANEL_SLIDE);
		this.slide.id = this.getId() + "_slide";

		/**
		 * コンテンツ配置用の領域
		 * @type {HTMLDivElement}
		 */
		this.body = document.createElement("div");
		SBase._addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";

		// クリックイベントで開閉を切り替える
		const that = this;
		const clickfunc = function () {
			that.setOpen(!that.isOpen());
		};
		this.legend.addEventListener("click", clickfunc);

		// 初期状態は閉じた状態
		this.setOpen(false);

		// スライド部分に内容コンテナを追加
		this.slide.appendChild(this.body);

		// 全体構造を構築
		const element = super.element;
		element.appendChild(this.legend);
		element.appendChild(this.slide);
	}

	/**
	 * パネルの開閉状態を設定します。
	 * @param {boolean} is_open - trueで開く、falseで閉じる
	 */
	setOpen(is_open) {
		this.is_open = is_open;
		if (this.is_open) {
			this.slide.style.maxHeight = this.body.scrollHeight + "px";
			SBase._addClass(this.legend, SBase.CLASS_NAME.OPEN);
			SBase._removeClass(this.legend, SBase.CLASS_NAME.CLOSE);
		} else {
			this.slide.style.maxHeight = null;
			SBase._addClass(this.legend, SBase.CLASS_NAME.CLOSE);
			SBase._removeClass(this.legend, SBase.CLASS_NAME.OPEN);
		}
	}

	/**
	 * 現在パネルが開いているかどうかを返します。
	 * @returns {boolean} trueなら開いている状態
	 */
	isOpen() {
		return this.is_open;
	}

	/**
	 * タイトル部分のテキストノードを取得します。
	 * @returns {Text} テキストノード
	 */
	getTextNode() {
		return this.textnode;
	}

	/**
	 * コンテンツを配置する要素を取得します。
	 * @returns {HTMLDivElement} コンテンツ領域
	 */
	getContainerElement() {
		return this.body;
	}

	/**
	 * コンテンツ領域をクリアします。
	 * @returns {void}
	 */
	clear() {
		SBase._removeChildNodes(this.body);
	}
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
class SSlider extends SBase {
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

/**
 * GuiBlocks.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */


/**
 * UIコンポーネントを集約したモジュールオブジェクト。
 * 各コンポーネントを一括でインポート可能にするエントリポイント。
 */
const GuiBlocks = {
	SButton: SButton,
	SCanvas: SCanvas,
	SCheckBox: SCheckBox,
	Color: NTColor,
	SColorPicker: SColorPicker,
	SComboBox: SComboBox,
	SFileLoadButton: SFileLoadButton,
	SFileSaveButton: SFileSaveButton,
	SGroupBox: SGroupBox,
	SImagePanel: SImagePanel,
	SLabel: SLabel,
	SPanel: SPanel,
	SProgressBar: SProgressBar,
	SSlidePanel: SSlidePanel,
	SSlider: SSlider,

	// 共通定数のエクスポート
	PUT_TYPE: SBase.PUT_TYPE,
	UNIT_TYPE: SBase.UNIT_TYPE,
	LABEL_POSITION: SBase.LABEL_POSITION,
	FILE_ACCEPT: SFileLoadButton.FILE_ACCEPT
};

module.exports = GuiBlocks;
