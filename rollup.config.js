import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default [
    {
        input: "src/js/jquery.router.js",
        external: Object.keys(pkg.peerDependencies),
        output: {
            file: "dist/js/jquery.router.js",
            format: "umd",
            name: "jqueryrouter",
            sourcemap: true,
            globals: {
                jquery: 'jQuery',
                'deparam.js': 'deparam'
            }
        },
        plugins: [
            resolve({
                customResolveOptions: {
                    moduleDirectory: "node_modules"
                }
            }),
            commonjs(),
            babel({
                exclude: "node_modules/**"
            })
        ]
    },
    {
        input: "src/js/jquery.router.js",
        external: Object.keys(pkg.peerDependencies),
        output: {
            file: "dist/js/jquery.router.min.js",
            format: "umd",
            name: "jqueryrouter",
            globals: {
                jquery: 'jQuery',
                'deparam.js': 'deparam'
            }
        },
        plugins: [
            resolve({
                customResolveOptions: {
                    moduleDirectory: "node_modules"
                }
            }),
            commonjs(),
            babel({
                exclude: "node_modules/**"
            }),
            terser()
        ]
    },
    {
        input: "src/js/demo/demo.js",
        output: {
            file: "dist/demo/demo.js",
            format: "iife",
            sourcemap: true
        },
        plugins: [
            postcss({
                extensions: ['.css'],
                minimize: true,
                sourceMap: true,
                extract: true
            }),
            resolve({
                customResolveOptions: {
                    moduleDirectory: "node_modules"
                }
            }),
            commonjs(),
            babel({
                exclude: "node_modules/**"
            }),
            terser()
        ]
    }
]