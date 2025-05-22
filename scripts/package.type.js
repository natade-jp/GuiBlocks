import NTFile from "ntfile";

NTFile.exec("npx tsc -p ./scripts/tsconfig.json");
NTFile.copy("./build/type/GuiBlocks.d.ts", "./build/cjs/GuiBlocks.min.d.ts");
NTFile.copy("./build/type/GuiBlocks.d.ts", "./build/umd/GuiBlocks.min.d.ts");
NTFile.copy("./build/type/GuiBlocks.d.ts", "./build/esm/GuiBlocks.min.d.ts");
