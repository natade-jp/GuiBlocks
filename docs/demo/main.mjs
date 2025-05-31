import Blocks from "./libs/GuiBlocks.min.js";

// メイン関数
const main = function () {
	// ---- 基本説明 ----
	console.log("GuiBlocks のサンプル");
	console.log("HTML での部品用のクラスです。");

	// ---- パネルの作成 ----
	// 「Panel」は他の部品を入れるためのコンテナです
	// "component_test" というIDを持つHTML要素の中にパネルを配置します
	const panel = new Blocks.Panel();
	panel.putMe("component_test", Blocks.PUT_TYPE.IN);

	// ---- ラベルの配置 ----
	// 「Label」は単純なテキスト表示用部品です
	const label1 = new Blocks.Label("PUT_TYPE.IN");
	panel.put(label1, Blocks.PUT_TYPE.IN); // パネルの中に配置

	// 2つめのラベル。1つめラベルの右側に配置
	const label2 = new Blocks.Label("PUT_TYPE.RIGHT");
	label1.put(label2, Blocks.PUT_TYPE.RIGHT);

	// 3つめのラベル。2つめラベルの下に配置
	const label3 = new Blocks.Label("PUT_TYPE.NEWLINE");
	label2.put(label3, Blocks.PUT_TYPE.NEWLINE);

	// ---- サイズ設定 ----
	// ラベルのサイズや単位（em/pxなど）を指定できます
	label3.setUnit(Blocks.UNIT_TYPE.EM);
	label3.setSize(30, 2); // 横30em, 縦2em
	console.log("width " + label3.getWidth() + label3.getUnit());
	console.log("height " + label3.getHeight() + label3.getUnit());

	// ---- テキスト変更 ----
	label1.setText("【" + label1.getText() + "】"); // ラベルのテキストを編集

	// ---- タイトル付きパネル ----
	const panel2 = new Blocks.Panel("タイトル付きパネル");
	panel.put(panel2, Blocks.PUT_TYPE.NEWLINE);
	panel2.put(new Blocks.Label("テスト"), Blocks.PUT_TYPE.IN);

	// ---- スライドパネル ----
	// ヘッダをクリックすると展開・折りたたみできるパネル
	const slidepanel = new Blocks.SlidePanel("スライドパネル");
	panel2.put(slidepanel, Blocks.PUT_TYPE.NEWLINE);

	// ---- ボタン ----
	// 「10回押す」ボタン。クリックでカウントダウン
	const button1 = new Blocks.Button("10回押す");
	slidepanel.put(button1, Blocks.PUT_TYPE.IN);

	let pushed1 = 10; // カウント用
	button1.addListener(function () {
		if (pushed1 > 0) {
			pushed1--;
		}
		progressbar.setValue(pushed1);
		if (pushed1 === 0) {
			// 残り0回で他の部品をまとめて非表示に
			fileloadbtn.setVisible(false);
			filesavebtn.setVisible(false);
			combobox.setVisible(false);
			checkbox.setVisible(false);
			label1.setVisible(false);
			label2.setVisible(false);
			label3.setVisible(false);
			canvas.setVisible(false);
			slider.setVisible(false);
			imagepanel.setVisible(false);
		}
		button1.setText("残り " + pushed1);
	});

	// ---- プログレスバー ----
	// 進捗表示用のバー
	const progressbar = new Blocks.ProgressBar(10, 0);
	button1.put(progressbar, Blocks.PUT_TYPE.RIGHT);

	// ---- ボタンで有効/無効の切り替え ----
	const button2 = new Blocks.Button("無効化");
	progressbar.put(button2, Blocks.PUT_TYPE.NEWLINE);
	let pushed2 = 0;
	button2.addListener(function () {
		pushed2++;
		button2.setText(pushed2 % 2 === 1 ? "有効化" : "無効化");

		// 部品の有効/無効切り替え（isEnabled()で状態取得・toggle可）
		progressbar.setIndeterminate(!progressbar.isIndeterminate());
		button1.setEnabled(!button1.isEnabled());
		fileloadbtn.setEnabled(!fileloadbtn.isEnabled());
		filesavebtn.setEnabled(!filesavebtn.isEnabled());
		combobox.setEnabled(!combobox.isEnabled());
		checkbox.setEnabled(!checkbox.isEnabled());
		label1.setEnabled(!label1.isEnabled());
		label2.setEnabled(!label2.isEnabled());
		label3.setEnabled(!label3.isEnabled());
		canvas.setEnabled(!canvas.isEnabled());
		slider.setEnabled(!slider.isEnabled());
		imagepanel.setEnabled(!imagepanel.isEnabled());
	});

	// ---- グループボックス ----
	// 枠付きの部品グループ
	const groupbox = new Blocks.GroupBox("グループボックス");
	slidepanel.put(groupbox, Blocks.PUT_TYPE.NEWLINE);

	// ---- ファイル読込ボタン ----
	// accept属性で「画像のみ」選択できるようにする
	const fileloadbtn = new Blocks.FileLoadButton("load");
	fileloadbtn.setFileAccept(Blocks.FILE_ACCEPT.IMAGE);
	groupbox.put(fileloadbtn, Blocks.PUT_TYPE.IN);
	fileloadbtn.addListener(function (file) {
		for (let i = 0; i < file.length; i++) {
			console.log(file[i].name + " " + file[i].size + "byte");
		}
	});

	// ---- ファイル保存ボタン ----
	const filesavebtn = new Blocks.FileSaveButton("save");
	fileloadbtn.put(filesavebtn, Blocks.PUT_TYPE.RIGHT);

	// ---- キャンバス ----
	// お絵かき、画像描画、ダウンロード用途にも
	const canvas = new Blocks.Canvas();
	canvas.setPixelSize(200, 20);
	canvas.setUnit(Blocks.UNIT_TYPE.PX);
	canvas.setSize(200, 20);
	filesavebtn.put(canvas, Blocks.PUT_TYPE.NEWLINE);

	// 2D描画
	canvas.getContext().fillText("canvas", 0, 20);
	canvas.getContext().strokeText("canvas", 100, 20);

	// 現在のキャンバス画像を保存ボタンのURLにセット
	filesavebtn.setURL(canvas.toDataURL());

	// ---- コンボボックス（ドロップダウン） ----
	const combobox = new Blocks.ComboBox(["test1", "test2"]);
	canvas.put(combobox, Blocks.PUT_TYPE.NEWLINE);
	combobox.setWidth(12); // 横幅
	// getText()で全項目取得
	const selectitem = combobox.getText();
	console.log(selectitem[0]);
	console.log(selectitem[1]);
	// 2番目を選択状態に
	combobox.setSelectedItem("test2");
	combobox.addListener(function () {
		console.log("ComboBox " + combobox.getSelectedItem());
	});

	// ---- チェックボックス ----
	const checkbox = new Blocks.CheckBox("チェックボックス");
	combobox.put(checkbox, Blocks.PUT_TYPE.NEWLINE);
	checkbox.addListener(function () {
		console.log("CheckBox " + checkbox.isChecked());
	});

	// ---- スライダー ----
	const slider = new Blocks.Slider(0, 100);
	checkbox.put(slider, Blocks.PUT_TYPE.NEWLINE);
	slider.setMinorTickSpacing(10); // 補助目盛
	slider.setMajorTickSpacing(50); // 主要目盛
	slider.addListener(function () {
		console.log("" + slider.getValue());
	});

	// ---- 画像パネル ----
	const imagepanel = new Blocks.ImagePanel();
	slider.put(imagepanel, Blocks.PUT_TYPE.NEWLINE);
	imagepanel.putImage("./image_test1.jpg");

	// ---- カラーピッカー ----
	const picker = new Blocks.ColorPicker();
	imagepanel.put(picker, Blocks.PUT_TYPE.NEWLINE);
	picker.addListener(function () {
		console.log("ColorPicker " + picker.getColor());
	});
};

// メイン関数を実行
main();
