module.exports = {
  root: true,
  extends: "@react-native-community",
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.js"],
      rules: {
        "@typescript-eslint/no-shadow": ["error"],
        "no-shadow": "off",
        "no-undef": "off",
        "prettier/prettier": 0,
        "no-trailing-spaces": 0,
        "no-unused-vars": 0,
        "quotes": [0, "double"],
        "yoda": 0,
      },
    },
  ],
};
