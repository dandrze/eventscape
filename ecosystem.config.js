module.exports = {
  apps: [
    {
      name: "primary",
      script: "./server.js",
      instances: "1",
      exec_mode: "cluster",
    },
    {
      name: "replica",
      script: "./server.js",
      instances: "1",
      exec_mode: "cluster",
    },
  ],
};
