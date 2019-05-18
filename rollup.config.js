import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";
import pkg from './package.json';

const banner = `/**!
 * Router plugin for single page applications with routes
 * Release under the MIT license
 * @name Silk router
 * @author Sachin Singh <ssingh.300889@gmail.com>
 * @version 3.0.0.beta.6
 * @license MIT
 */`;

export default [
    {
        input: "src/js/silkrouter.js",
        external: Object.keys(pkg.peerDependencies),
        output: {
            file: "dist/js/silkrouter.js",
            format: "umd",
            name: "silkrouter",
            sourcemap: true,
            globals: {
                'deparam.js': 'deparam',
                'lzstorage': 'LZStorage'
            },
            banner
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
        input: "src/js/silkrouter.js",
        external: Object.keys(pkg.peerDependencies),
        output: {
            file: "dist/js/silkrouter.min.js",
            format: "umd",
            name: "silkrouter",
            globals: {
                'deparam.js': 'deparam',
                'lzstorage': 'LZStorage'
            },
            banner
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
            uglify({
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
            uglify()
        ]
    }
]