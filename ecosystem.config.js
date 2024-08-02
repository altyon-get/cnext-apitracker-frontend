module.exports = {
    apps: [
      {
        name: "cnext_frontend",
        script: "src/index.js",
        instances: 2,
        exec_mode: "cluster",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  