import NTFile from "ntfile";

/**
 * 指定したビルドフォーマットごとにbuildディレクトリへコピーします。
 *
 * @param {string[]} formats - コピー先のフォーマットの配列（例: ['cjs', 'umd', 'esm']）。
 * @param {string} filename1 - コピー元ファイル名（srcディレクトリ内）。
 * @param {string} filename2 - コピー先ファイル名（buildディレクトリ内）。
 */
function copyTo(formats, filename1, filename2) {
	formats.forEach((format) => {
		NTFile.copy(`./build/type/${filename1}`, `./build/${format}/${filename2}`);
	});
}

NTFile.exec("npx tsc -p ./scripts/tsconfig.json");
copyTo(["cjs", "umd", "esm"], "GuiBlocks.d.ts", "GuiBlocks.min.d.ts");
