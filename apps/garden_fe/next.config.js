//@ts-check

const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    nx: {},

    /**
     * Explicitně nastavíme root monorepa,
     * aby Next nehledal lockfile mimo projekt
     */
    outputFileTracingRoot: path.join(__dirname, '../../'),
};

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
