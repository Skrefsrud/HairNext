import { createClient } from "redis";

const client = createClient({
  password: "JKwq0g3epi8rPaxnHkonKThwzAdhevPX",
  socket: {
    host: "redis-10997.c327.europe-west1-2.gce.cloud.redislabs.com",
    port: 10997,
  },
});
