
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/",
  documents: "./graphql/**/*.graphql",
  generates: {
    "graphql/types.ts": { plugins: ["typescript"] },
    // generate operations.ts
    "graphql/operations.ts": {
      preset: "import-types",
      plugins: ["typescript-operations", "typescript-urql"],
      presetConfig: {
        typesPath: "../graphql/types",
      },
      config: {
        withHooks: false,
      },
    },
    hooks: {
      overwrite: true,
      preset: "near-operation-file",
      presetConfig: {
        extension: ".hooks.tsx",
        baseTypesPath: "../graphql/types",
      },
      plugins: ['typescript-urql'],
      config: {
        withHooks: true,
        importOperationTypesFrom: "Operations",
        documentMode: "external",
        importDocumentNodeExternallyFrom: "@/graphql/operations.ts",
      },
    },
  },
};

export default config;