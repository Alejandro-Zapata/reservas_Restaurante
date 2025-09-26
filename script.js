let allTables = [
  { number: 1 }, { number: 2 },  { number: 3 }, { number: 4 },
  { number: 5 }, { number: 6 }, { number: 7 }, { number: 8 },
  { number: 9 }, { number: 10 }, { number: 11 }, { number: 12 },
];

let reservations = [];

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById('reservationDate').addEventListener('change', renderTables);
    document.getElementById('reservationTime').addEventListener('change', renderTables);
        
    document.getElementById('reservarButton').addEventListener('click', reserveTable);
    document.getElementById('reporteButton').addEventListener('click', generateReport);

  renderTables();
  
});

// function isTableAvailable(tableNumber, proposedStartTime) {
//     const proposedEndTime = new Date(proposedStartTime.getTime() + 2 * 60 * 60 * 1000); 

//     for (const reservation of occupiedTables) {
//         if (reservation.number === tableNumber) {
//             const existingStartTime = reservation.reservationTime;
//             const existingEndTime = new Date(existingStartTime.getTime() + 2 * 60 * 60 * 1000);

//             if (proposedStartTime < existingEndTime && proposedEndTime > existingStartTime) {
//                 return false; 
//             }
//         }
//     }
//     return true; 
// }



function renderTables() {
  const availableTablesDiv = document.getElementById("availableTables");
  const occupiedTablesDiv = document.getElementById("occupiedTables");

  availableTablesDiv.innerHTML = '';
  occupiedTablesDiv.innerHTML = "";

  const selectedDate = document.getElementById('reservationDate').value;
  const selectedTime = document.getElementById('reservationTime').value;

  
  if (!selectedDate || !selectedTime) {
    availableTablesDiv.innerHTML = '<h3>Por favor, selecciona una fecha y hora para ver la disponibilidad.</h3>';

    return;
  }

  const viewTime = new Date(`${selectedDate}T${selectedTime}`);




  allTables.forEach((table) => {
    const tableDiv = document.createElement("div");
    tableDiv.className = "table";

    const reservation = reservations.find(r => 
            r.number === table.number && r.reservationTime.getTime() === viewTime.getTime()
    );

    if (reservation) {
            // --- MESA OCUPADA ---
            tableDiv.innerHTML = `<img src="img/mesa.jpg" alt="Mesa ${table.number}" > <div class="table-name">Mesa ${table.number}<br><small>Por: ${reservation.customerName}</small></div>`;
            const releaseButton = document.createElement('button');
            releaseButton.className = 'button release';
            releaseButton.textContent = 'Liberar';
            releaseButton.onclick = () => releaseReservation(table.number, viewTime);
            tableDiv.appendChild(releaseButton);
            occupiedTablesDiv.appendChild(tableDiv);
        } else {
            // --- MESA DISPONIBLE ---
            tableDiv.innerHTML = `<img src="img/mesa.jpg" alt="Mesa ${table.number}" > <div class="table-name">Mesa ${table.number}</div>`;
            const reserveButton = document.createElement('button');
            reserveButton.className = 'button';
            reserveButton.textContent = 'Reservar';
            reserveButton.onclick = () => reserveTableByNumber(table.number);
            tableDiv.appendChild(reserveButton);
            availableTablesDiv.appendChild(tableDiv);
        } 
  });

}

function reserveTable() {
  const customerName = document.getElementById("customerName").value.trim();
  const tableNumber = parseInt(document.getElementById("tableNumber").value);
  const date = document.getElementById('reservationDate').value;
  const time = document.getElementById('reservationTime').value;

  if (!customerName || isNaN(tableNumber) || !date || !time) {
    alert(
      'Por favor, complete todos los campos: nombre, número de mesa, fecha y hora.'
    );
    return;
  }

  if (tableNumber < 1 || tableNumber > allTables.length) {
        alert(`Número de mesa inválido. Por favor, ingrese un número entre 1 y ${allTables.length}.`);
        return;
    }

  const proposedStartTime = new Date(`${date}T${time}`);

  

  if (hour < 10 || hour >= 22){

    alert('Lo sentimos, el horario de reservas es de 10:00 A.M hasta las 10:00 P.M.');
    return;
  }

  

  if(isTableAvailable( tableNumber, proposedStartTime)) {
    reservations.push({
        number: tableNumber,
        customerName: customerName,
        reservationTime: proposedStartTime
    });
    alert(`¡Mesa ${tableNumber} reservado para ${customerName} con fecha ${date} a las ${time}!`);
    renderTables();
  }
  else{
    alert('La mesa seleccionada no está disponible en este horario. \n Por favor, elija otra hora.');
  }

}

function reserveTableByNumber(tableNumber) {

  const date = document.getElementById('reservationDate').value;
  const time = document.getElementById('reservationTime').value;

    const customerName = prompt(`Ingrese el nombre del cliente para la mesa ${tableNumber}:`);

    if (!customerName || customerName.trim() === "") {
        alert("Debe ingresar un nombre para reservar.");
        return;
    }


  const proposedStartTime = new Date(`${date}T${time}`);

  reservations.push({
        number: tableNumber,
        customerName: customerName.trim(),
        reservationTime: proposedStartTime
    });

    alert(`Mesa ${tableNumber} reservada para ${customerName.trim()} el ${date} a las ${time}`);
    renderTables();
  
  // const tableIndex = availableTables.findIndex((t) => t.number === tableNumber);

  // if (tableIndex === -1) {
  //   alert("Error inesperado: La mesa no se encontró.");
  //   return;
  // }

  // const tableToReserve = availableTables.splice(tableIndex, 1)[0];
  // tableToReserve.reserved = true;
  // occupiedTables.push({ ...tableToReserve, customerName: customerName.trim() });

  // alert(`Mesa ${tableNumber} reservada para ${customerName.trim()}`);
  // renderTables();

}

function releaseTableByNumber(tableNumber) {
  const date = document.getElementById('reservationDate').value;
  const time = document.getElementById('reservationTime').value;

  if (tableIndex === -1) {
    alert("Error: La mesa no se encontró en la lista de ocupadas.");
    return;
  }

  const tableToRelease = occupiedTables.splice(tableIndex, 1)[0];
  tableToRelease.reserved = false;
  delete tableToRelease.customerName;
  availableTables.push(tableToRelease);

  availableTables.sort((a, b) => a.number - b.number);

  alert(`Mesa ${tableNumber} ha sido liberada.`);
  renderTables();
}

function releaseReservation(tableNumber, reservationTime){

    const reservationIndex = reservations.findIndex(r => 
        r.number === tableNumber && r.reservationTime.getTime() === reservationTime.getTime()
    );

    if (reservationIndex > -1) {
        if (confirm(`¿Está seguro de que desea liberar la mesa ${tableNumber} para este horario?`)) {
            reservations.splice(reservationIndex, 1);
            alert(`La reserva para la mesa ${tableNumber} ha sido eliminada.`);
            renderTables();
        }
    } else {
        alert("Error: No se encontró la reserva para liberar.");
    }
}

function isTableAvailable(tableNumber, proposedStartTime) {
    const proposedEndTime = new Date(proposedStartTime.getTime() + 3 * 60 * 60 * 1000);
    for (const reservation of reservations) {
        if (reservation.number === tableNumber) {
            const existingStartTime = reservation.reservationTime;
            const existingEndTime = new Date(existingStartTime.getTime() + 3 * 60 * 60 * 1000);
            if (proposedStartTime < existingEndTime && proposedEndTime > existingStartTime) {
                return false;
            }
        }
    }
    return true;
}


function generateReport() {
  const reportOutput = document.getElementById("reportOutput");

  if (reservations.length === 0) {
    reportOutput.textContent = "No hay mesas reservadas en este momento.";
    return;
  }

  reservations.sort((a, b) => a.reservationTime - b.reservationTime);

  let reportText = "--- Reporte de Mesas Ocupadas ---\n\n";
    reservations.forEach(res => {
        const dateStr = res.reservationTime.toLocaleDateString('es-ES');
        const timeStr = res.reservationTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        reportText += `Mesa #${res.number} por ${res.customerName} -> ${dateStr} a las ${timeStr}\n`;
    });

  reportOutput.textContent = reportText;
}
