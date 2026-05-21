getRooms();

document.getElementById("clients-search").addEventListener("input", (event) => {
  console.log(event.target.value);
  searchClients(event.target.value);
});

function getRooms() {
  fetch("http://localhost:3000/api/habitaciones")
    .then((res) => res.json())
    .then((data) => {
      data.data.forEach((room) => {
        document.getElementById("rooms-list").innerHTML += `
            <div class='room'>
            <p class='room-number'>Número: ${room.numero}</p>
            <strong>
            <p class=${room.estado == "ocupado" ? "not-available" : "available"}>Estado: ${room.estado}</p>
            </strong>
            </div>
           `;
      });
    });
}

function searchClients(name) {
  document.getElementById("clients-list").innerHTML = "";
  if (name != "") {
    fetch(`http://localhost:3000/api/clientes/buscar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.data.forEach((client) => {
          document.getElementById("clients-list").innerHTML += `
            <div class='client'>
            <p class='client-name'>Nombre: ${client.nombre}</p>
            <strong>
            <p>DNI: ${client.dni}</p>
            </strong>
            </div>
           `;
        });
      });
  }
}

function registerClient() {
  const name = document.getElementById("input-name").value;
  const surname = document.getElementById("input-surname").value;
  const dni = document.getElementById("input-dni").value;

  fetch(`http://localhost:3000/api/clientes/registrar-cliente`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre: name, apellido: surname, dni: dni }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.data.insertedId) {
        document.getElementById("register-message").innerText =
          "usuario registrado";
        setTimeout(() => {
          document.getElementById("register-message").innerText = "";
        }, 2000);
      }
    });
}
