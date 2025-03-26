module.exports = {
  apps: [
    {
        name: 'asterisk_calls',
        script: 'npm start',
        next_gen_js: true,
        watch: false,
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
