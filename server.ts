import express from "express";
import { createConnection } from "typeorm";

const app = express();
const port = 3000;

createConnection().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
  });
});
