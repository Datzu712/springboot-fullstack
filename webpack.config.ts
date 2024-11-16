import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import { inspect } from 'util';

const isProduction = process.env.NODE_ENV == 'production';
const SOURCE_FOLDER = './frontend';

const excludedFolders = ['components', 'interfaces', 'utils'];

function getEntries() {
    const files = fs.globSync(SOURCE_FOLDER + '/**/*.ts');

    const entries: webpack.Entry = {};
    for (const file of files) {
        if (excludedFolders.some((folder) => new RegExp(folder).test(file))) {
            continue;
        }
        const entryFile = file.replace('frontend/public/', '').replace('frontend/private/', '').replace('.ts', '.js');
        const entryName = entryFile.replace('.ts', '').replace(/\//g, '_');

        entries[entryName] = {
            import: path.resolve(__dirname, file),
            filename: entryFile,
        };
    }
    console.debug(`Entries: ${inspect(entries)}`);
    return entries;
}
const config: webpack.Configuration = {
    entry: () => getEntries(),
    context: path.resolve(__dirname, SOURCE_FOLDER),
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'src/main/resources/static/js'),
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@components': path.resolve(__dirname, SOURCE_FOLDER, '/components'),
            '@interfaces': path.resolve(__dirname, SOURCE_FOLDER, '/interfaces'),
            '@utils': path.resolve(__dirname, SOURCE_FOLDER, '/utils'),
        },
    },
};

export default () => {
    console.debug(`Webpack is in ${isProduction ? 'production' : 'development'} mode`);
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
