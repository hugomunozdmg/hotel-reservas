import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const clients = await req.app.locals.db
    .collection("clientes")
    .find()
    .toArray();
  res.send({ data: clients });
});

router.post("/registrar-cliente", async (req, res) => {
  let newClient = req.body;
  let response;
  const clientFound = await req.app.locals.db
    .collection("clientes")
    .findOne({ dni: newClient.dni });

  if (!clientFound) {
    response = await req.app.locals.db
      .collection("clientes")
      .insertOne(newClient);
  }

  if (clientFound) {
    response = "client already exists";
  }

  res.send({ data: response });
});

router.put("/actualizar-cliente", async (req, res) => {
  let clientDataUpdate = req.body;
  let response;
  const clientFound = await req.app.locals.db
    .collection("clientes")
    .findOne({ dni: clientDataUpdate.dni });

  if (clientFound) {
    response = await req.app.locals.db
      .collection("clientes")
      .updateOne(
        { dni: clientDataUpdate.dni },
        {
          $set: 
            { nombre: clientDataUpdate.nombre, apellido: clientDataUpdate.apellido },
          
        },
      );
  }

  if (!clientFound) {
    response = "client doesnt exist"
  }

  res.send({ data: response });
});



export default router;
