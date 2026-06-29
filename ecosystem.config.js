// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'diy-store',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/diy-store',   // <-- adjust to your actual path on droplet
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
}
