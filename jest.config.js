module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
