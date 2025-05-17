import NTFile from "ntfile";

NTFile.exec('npx rollup -c "./scripts/rollup.config.js"');
NTFile.copy("./src/main.css", "./build/cjs/main.css");
NTFile.copy("./src/main.css", "./build/umd/main.css");
NTFile.copy("./src/main.css", "./build/esm/main.css");
