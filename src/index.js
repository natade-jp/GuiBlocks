/**
 * GuiBlocks.js
 *
 * @module GuiBlocks
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

/**
 * GuiBlocks モジュールを構成する様々な要素
 */
import SBase from "./components/SBase.js";
import SButton from "./components/SButton.js";
import SCanvas from "./components/SCanvas.js";
import SCheckBox from "./components/SCheckBox.js";
import SColorPicker from "./components/SColorPicker.js";
import SComboBox from "./components/SComboBox.js";
import SFileLoadButton from "./components/SFileLoadButton.js";
import SFileSaveButton from "./components/SFileSaveButton.js";
import SGroupBox from "./components/SGroupBox.js";
import SImagePanel from "./components/SImagePanel.js";
import SLabel from "./components/SLabel.js";
import SPanel from "./components/SPanel.js";
import SProgressBar from "./components/SProgressBar.js";
import SSlidePanel from "./components/SSlidePanel.js";
import SSlider from "./components/SSlider.js";
import NTColor from "ntcolor";

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

export default GuiBlocks;
