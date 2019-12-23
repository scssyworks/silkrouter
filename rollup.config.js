import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import pkg from './package.json';

const banner = `/**!
 * Router plugin for single page applications with routes
 * Released under MIT license
 * @name Silk router
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version ${pkg.version}
 * @license MIT
 */`;

const commonConfig = {
    input: 'src/js/silkrouter',
    output: {
        name: 'silkrouter',
        sourcemap: true,
        banner
    },
    plugins: [
        resolve({
            customResolveOptions: {
                moduleDirectory: "node_modules"
            }
        }),
        commonjs()
    ]
};

// Dev config
const devConfig = Object.assign({}, commonConfig);
devConfig.output = Object.assign({}, commonConfig.output, {
    file: 'dist/umd/index.js',
    format: 'umd'
});
devConfig.plugins = [
    ...commonConfig.plugins,
    babel({
        exclude: "node_modules/**"
    }),
    cleanup({
        maxEmptyLines: 0
    })
];

// Esm config
const esmConfig = Object.assign({}, commonConfig);
esmConfig.output = Object.assign({}, commonConfig.output, {
    file: 'dist/esm/index.esm.js',
    format: 'esm'
});
esmConfig.plugins = [
    ...commonConfig.plugins,
    cleanup({
        maxEmptyLines: 0
    })
];

// Prod configurations
const prodConfig = Object.assign({}, devConfig);
prodConfig.output = Object.assign({}, devConfig.output, {
    file: 'dist/umd/index.min.js',
    sourcemap: false
});
prodConfig.plugins = [
    ...commonConfig.plugins,
    babel({
        exclude: "node_modules/**"
    }),
    terser({
        output: {
            comments: function () {
                const [, comment] = arguments;
                if (comment.type === "comment2") {
                    return /@preserve|@license|@cc_on/i.test(comment.value);
                }
                return false;
            }
        }
    })
];

const prodEsmConfig = Object.assign({}, esmConfig);
prodEsmConfig.output = Object.assign({}, esmConfig.output, {
    file: 'dist/esm/index.esm.min.js',
    sourcemap: false
});
prodEsmConfig.plugins = [
    ...commonConfig.plugins,
    terser({
        output: {
            comments: function () {
                const [, comment] = arguments;
                if (comment.type === "comment2") {
                    return /@preserve|@license|@cc_on/i.test(comment.value);
                }
                return false;
            }
        }
    })
];

export default [
    devConfig,
    esmConfig,
    prodConfig,
    prodEsmConfig
];