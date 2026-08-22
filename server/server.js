const app = require("./app");

const connectDB = require("./config/db");
const { PORT } = require("./config/env");

const startServer = async () => {
  try {
    /*
     * Connect to MongoDB first
     */
    await connectDB();

    /*
     * Start Express server
     */
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();