import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const reservas = await req.app.locals.db
    .collection("reservas")
    .find()
    .toArray();
  res.send({ data: reservas });
});

router.post("/check-in", async (req, res) => {
  const data = req.body;
  let response = { data: {}, message: "" };

  const clientFound = await req.app.locals.db
    .collection("clientes")
    .findOne({ dni: data.dni });
  const roomFound = await req.app.locals.db
    .collection("habitaciones")
    .findOne({ numero: data.habitacion });

  if (!clientFound && roomFound.estado == "ocupado") {
    response.message = "client doesnt exist and room not available";
  }

  if (clientFound && roomFound.estado == "disponible") {
    //
    const dataNewCheck_in = await req.app.locals.db
      .collection("reservas")
      .insertOne({
        cliente: data.dni,
        habitacion: data.habitacion,
        check_in: new Date(),
        check_out: "ya se vera",
      });

    const dataRoom = await req.app.locals.db
      .collection("habitaciones")
      .updateOne({ numero: roomFound.numero }, { $set: { estado: "ocupado" } });

    response.message = "client exists and room available";
    response.data = {
      check_in: dataNewCheck_in,
      room: dataRoom,
    };
  }

  if (clientFound && roomFound.estado == "ocupado") {
    response.message = "client exists but room not available";
  }

  if (!clientFound && roomFound.estado == "disponible") {
    response.message = "client doesnt exists but room available";
  }

  res.send(response);
});

router.put("/check-out", async (req, res) => {
  const data = req.body;
  let response = { data: {}, message: "" };

  const clientFound = await req.app.locals.db
    .collection("clientes")
    .findOne({ dni: data.dni });

  if (clientFound) {
    const dataReservation = await req.app.locals.db
      .collection("reservas")
      .updateOne(
        { cliente: data.dni, habitacion: data.habitacion },
        { $set: { check_out: new Date() } },
      );
    response.data = dataReservation;
    const dataRooms = await req.app.locals.db
      .collection("habitaciones")
      .updateOne(
        { habitacion: data.habitacion },
        { $set: { estado: "disponible" } },
      );
  } else {
    response.message = "client doesnt exist";
  }

  res.send(response);
});

export default router;
