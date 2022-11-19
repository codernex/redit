import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:5000/graphql',
  documents: ['src/graphql/**/*.graphql'],
  generates: {
    './src/generated': {
      preset: 'client',
      plugins: ['typescript', 'typescript-operations', 'typescript-urql']
    }
  }
};

export default config;
