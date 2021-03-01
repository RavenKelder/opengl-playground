import handler from "serve-handler";
import { createServer } from "http";
const port = process.env.PORT || 5000;

const server = createServer((request, response) => {
  return handler(request, response, {
    public: "./build",
  });
});

server.listen(port, () => {
  console.log(`Running at port ${port}`);
});
