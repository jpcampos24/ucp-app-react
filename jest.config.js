module.exports = {
  reporters: [
    'default',
    [ 'jest-junit', {
      outputDirectory: './reports/test',
      outputName: 'junit.xml'
    }]
  ]
};