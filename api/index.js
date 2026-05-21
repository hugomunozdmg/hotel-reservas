import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

import clientes from "./clientes.js"
import reservas from "./reservas.js"

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/api/clientes", clientes)
app.use("/api/reservas", reservas)


async function start() {
  const uri = `mongodb://admin:admin123@127.0.0.1:27017`;
  const client = await MongoClient.connect(uri);
  app.locals.db = client.db("hotel");
}

start();

app.listen(3000 || process.env.PORT);
