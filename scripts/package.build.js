import NTFile from "ntfile";

NTFile.exec('npx rollup -c "./scripts/rollup.config.js"');
NTFile.copy("./src/GuiBlocks.css", "./build/cjs/GuiBlocks.css");
NTFile.copy("./src/GuiBlocks.css", "./build/umd/GuiBlocks.css");
NTFile.copy("./src/GuiBlocks.css", "./build/esm/GuiBlocks.css");
