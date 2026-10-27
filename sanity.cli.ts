/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: { projectId, dataset },
  // `npm run typegen`: extracts the schema and generates sanity.types.ts with a
  // type for every document and for every query wrapped in defineQuery().
  typegen: {
    path: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
    schema: 'schema.json',
    generates: 'sanity.types.ts',
    // Register query result types so fetching a defineQuery() query is typed automatically.
    overloadClientMethods: true,
  },
})
