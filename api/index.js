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


app.get("/api/mesas", async (req, res) => {
  const mesas = await db.collection("mesas").find().toArray();
  res.send(mesas);
});

app.post("/api/anadir", async (req, res) => {
  const nuevaMesa = {
    tamano_cm: parseInt(req.body.tamano_cm),
    color: req.body.color,
    material: req.body.material,
    patas: parseInt(req.body.patas),
  };
  const response = await db.collection("mesas").insertOne(nuevaMesa);
  console.log(response)
  res.redirect("http://127.0.0.1:5500/app/index.html");
});

app.put("/api/modificar/:color", async (req, res) => {
  let color = req.params.color;
  const response = await db
    .collection("mesas")
    .updateMany({}, { $set: { color: color } });
  res.send(response);
});

app.delete("/api/borrar/:patas", async (req, res) => {
  let patas = parseInt(req.params.patas);
  const response = await db.collection("mesas").deleteMany({patas:patas})
  res.send(response);
});

app.listen(3000 || process.env.PORT);
