import nextCoreWebVitalsConfig from "eslint-config-next/core-web-vitals";
import nextTypescriptConfig from "eslint-config-next/typescript";

const eslintConfig = [
    ...nextCoreWebVitalsConfig,
    ...nextTypescriptConfig,
];

export default eslintConfig;
