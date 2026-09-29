module.exports = {
  apps: [
    {
      name: "immoinbox-ai-dev",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "dev --turbopack --hostname 127.0.0.1 --port 3016",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
