module.exports = {
  apps: [
    {
        name: 'asterisk_calls',
        script: 'npm start:dev',
        next_gen_js: true,
        watch: true,
            ignore_watch: ['node_modules'],
            watch_delay: 1000,
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        },
    },
],
};
