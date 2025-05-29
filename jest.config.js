module.exports = {
    reporters: [
        'default',
        ['jest-junit', { outputDirectory: './', outputName: 'junit.xml' }]
    ]
    //this is a test
};