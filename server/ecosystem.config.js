module.exports = {
  apps: [{
    name: 'inspectpractice',
    script: './dist/src/index.js',
    cwd: '/home/chuck/projects/inspectpractice/server',
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: '4000',
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    rotateModule: true,
    pmx: true,
  }],
};
