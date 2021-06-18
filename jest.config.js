module.exports = {
  //  these settings allow us to write jest unit tests in es6 (import/export) and with typescript

  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
}
