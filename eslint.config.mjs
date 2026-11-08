import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: [".next/**", "out/**", "node_modules/**"] },
  { rules: { "@next/next/no-img-element": "off" } },
];

export default config;
