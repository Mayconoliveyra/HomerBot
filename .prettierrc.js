module.exports = {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 160,
    tabWidth: 2,
    overrides: [
        {
            files: "src/server/routes/**.ts",
            options: {
                printWidth: 180
            }
        }
    ]
}