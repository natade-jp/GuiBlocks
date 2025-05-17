import NTFile from "ntfile";

NTFile.exec("npx tsc -p ./scripts/tsconfig.json");
NTFile.copy("./build/type/index.d.ts", "./build/cjs/index.min.d.ts");
NTFile.copy("./build/type/index.d.ts", "./build/umd/index.min.d.ts");
NTFile.copy("./build/type/index.d.ts", "./build/esm/index.min.d.ts");
