import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import { eslint } from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import pkg from './package.json';

const rxjs = 'rxjs';

const commonConfig = {
    input: 'src/js/index.js',
    output: {
        name: 'silkrouter',
        sourcemap: true
    },
    plugins: [
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            },
            preferBuiltins: true
        }),
        commonjs({
            namedExports: {
                uuid: ['v4']
            }
        })
    ]
};

// ESM config
const esmConfig = Object.assign({}, commonConfig);
esmConfig.external = [...Object.keys(pkg.peerDependencies)];
esmConfig.output = Object.assign({}, commonConfig.output, {
    file: 'dist/esm/silkrouter.esm.js',
    format: 'esm',
    globals: { rxjs }
});

// ESM prod config
const esmProdConfig = Object.assign({}, esmConfig);
esmProdConfig.output = Object.assign({}, esmConfig.output, {
    file: 'dist/esm/silkrouter.esm.min.js',
    sourcemap: false
});
esmProdConfig.plugins = [
    ...esmConfig.plugins,
    terser()
];

// UMD config
const umdConfig = Object.assign({}, commonConfig);
umdConfig.external = [...Object.keys(pkg.peerDependencies)];
umdConfig.output = Object.assign({}, commonConfig.output, {
    file: 'dist/umd/silkrouter.js',
    format: 'umd',
    globals: { rxjs }
});
umdConfig.plugins = [
    ...commonConfig.plugins,
    babel({
        exclude: 'node_modules/**'
    })
];

// Production config
const umdProdConfig = Object.assign({}, umdConfig);
umdProdConfig.output = Object.assign({}, umdConfig.output, {
    file: 'dist/umd/silkrouter.min.js',
    sourcemap: false
});
umdProdConfig.plugins = [
    ...umdConfig.plugins,
    terser()
];

let configurations = [];
if (process.env.SERVE) {
    const serveConfig = Object.assign({}, commonConfig);
    serveConfig.input = 'render/index.js';
    serveConfig.output = Object.assign({}, commonConfig.output, {
        file: 'dist/render/silkrouter.iife.js',
        format: 'iife'
    });
    serveConfig.plugins = [
        eslint({
            exclude: [
                'node_modules/**',
                'json/**'
            ],
            throwOnError: true
        }),
        ...umdConfig.plugins
    ];
    serveConfig.plugins.push(
        serve({
            open: true,
            contentBase: ['dist'],
            host: 'localhost',
            port: '3030',
            historyApiFallback: true
        }),
        livereload({
            watch: 'dist',
            verbose: false
        })
    );
    configurations.push(serveConfig);
} else {
    configurations.push(
        esmConfig,
        esmProdConfig,
        umdConfig,
        umdProdConfig
    )
}

export default configurations;