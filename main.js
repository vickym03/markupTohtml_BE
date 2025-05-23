const fastify = require("fastify")({ logger: true });
const helmet = require("@fastify/helmet");
const connectDB = require("./db"); // MongoDB connection

// Register helmet for security (with contentSecurityPolicy set to false)
fastify.register(helmet, { contentSecurityPolicy: false, global: true });
// Register the formbody plugin to parse form data
fastify.register(require("@fastify/formbody"));
fastify.register(connectDB);

// Root route
fastify.get("/", async (request, reply) => {
  return { status: "OK", message: "welcome" };
});

// Register your API routes with a prefix
fastify.register(require("./apis/index"), { prefix: "/API" });

// Start the server
fastify.listen({ port: 8080, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  console.log(`Successfully running on 8080`);
});
