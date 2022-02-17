// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  "transform": {
    "^.+\\.[t|j]sx?$": "babel-jest"
  }
};

export default config;