function terminate(server, options = { coredump: false, timeout: 500 }) {
  // Exit function
  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code);
  };

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, will use a proper logging library here soon
      console.log("err is " + err.message);
      console.log(err.message, err.stack);
    }

    // Attempt a graceful shutdown
    server.close(exit);
    setTimeout(exit, options.timeout).unref();
  };
}

module.exports = terminate;
