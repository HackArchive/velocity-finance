import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
    './sway-programs/contract'
  ],
  output: './src/sway-api',
});

/**
 * Check the docs:
 * https://docs.fuel.network/docs/fuels-ts/fuels-cli/config-file/
 */
