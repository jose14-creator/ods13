document.addEventListener('DOMContentLoaded', function () {

  // =========================================================
  // PARTE 1: LÓGICA CALCULADORA POR PASOS
  // =========================================================
  const paso1 = document.getElementById('paso-1');
  const paso2 = document.getElementById('paso-2');
  const paso3 = document.getElementById('paso-3');

  const btnSiguiente = document.getElementById('btn-siguiente');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnCalcular = document.getElementById('btn-calcular');

  const textoPasoActual = document.getElementById('paso-actual-numero');
  const formHuellaPasos = document.getElementById('form-huella-pasos');
  const seccionResultado = document.getElementById('resultado-huella');
  const valorHuellaTexto = document.getElementById('valor-huella');

  let pasoActual = 1;

  function actualizarVistaPasos() {
    if (!paso1 || !paso2 || !paso3) return;

    paso1.classList.toggle('activo', pasoActual === 1);
    paso2.classList.toggle('activo', pasoActual === 2);
    paso3.classList.toggle('activo', pasoActual === 3);

    textoPasoActual.textContent = pasoActual;

    if (pasoActual === 1) {
      btnAnterior.style.display = 'none';
      btnSiguiente.style.display = 'inline-block';
      btnCalcular.style.display = 'none';
    } else if (pasoActual === 2) {
      btnAnterior.style.display = 'inline-block';
      btnSiguiente.style.display = 'inline-block';
      btnCalcular.style.display = 'none';
    } else if (pasoActual === 3) {
      btnAnterior.style.display = 'inline-block';
      btnSiguiente.style.display = 'none';
      btnCalcular.style.display = 'inline-block';
    }
  }

  if (btnSiguiente && btnAnterior && formHuellaPasos) {
    btnSiguiente.addEventListener('click', function () {
      if (pasoActual < 3) {
        pasoActual++;
        actualizarVistaPasos();
      }
    });

    btnAnterior.addEventListener('click', function () {
      if (pasoActual > 1) {
        pasoActual--;
        actualizarVistaPasos();
      }
    });

    formHuellaPasos.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const valTransporte = parseFloat(document.getElementById('transporte-pasos').value) || 0;
      const valEnergia = parseFloat(document.getElementById('energia-pasos').value) || 0;
      const valAlimentacion = parseFloat(document.getElementById('alimentacion-pasos').value) || 0;

      const totalHuella = valTransporte + valEnergia + valAlimentacion;

      valorHuellaTexto.textContent = totalHuella.toFixed(2);
      seccionResultado.removeAttribute('hidden');
      seccionResultado.style.display = 'block';
    });

    actualizarVistaPasos();
  }


  // =========================================================
  // PARTE 2: LÓGICA SIMULADOR GRÁFICO PORCENTUAL Y LOCALSTORAGE
  // =========================================================
  const formHuellaGrafica = document.querySelector('#form-huella-grafica');
  const inputTransporte = document.querySelector('#transporte');
  const inputEnergia = document.querySelector('#energia');
  const inputAlimentacion = document.querySelector('#alimentacion');
  const inputConsumo = document.querySelector('#consumo');
  const totalSumadoEl = document.querySelector('#total-sumado');

  const seg1 = document.querySelector('#seg-1');
  const seg2 = document.querySelector('#seg-2');
  const seg3 = document.querySelector('#seg-3');
  const seg4 = document.querySelector('#seg-4');

  const pct1 = document.querySelector('#pct-1');
  const pct2 = document.querySelector('#pct-2');
  const pct3 = document.querySelector('#pct-3');
  const pct4 = document.querySelector('#pct-4');

  const btnVerGrafica = document.querySelector('#btn-ver-grafica');
  const modalGrafica = document.querySelector('#modal-grafica');
  const btnCerrarModal = document.querySelector('#btn-cerrar-modal');
  const contenedorGuardados = document.querySelector('#contenedor-datos-guardados');

  function calcularYActualizarGrafica() {
    if (!inputTransporte || !inputEnergia) return;

    const v1 = parseFloat(inputTransporte.value) || 0;
    const v2 = parseFloat(inputEnergia.value) || 0;
    const v3 = parseFloat(inputAlimentacion.value) || 0;
    const v4 = parseFloat(inputConsumo.value) || 0;

    const total = v1 + v2 + v3 + v4;
    totalSumadoEl.textContent = total.toFixed(0);

    const divisor = total > 0 ? total : 1;

    const p1 = ((v1 / divisor) * 100).toFixed(1);
    const p2 = ((v2 / divisor) * 100).toFixed(1);
    const p3 = ((v3 / divisor) * 100).toFixed(1);
    const p4 = ((v4 / divisor) * 100).toFixed(1);

    seg1.style.width = `${p1}%`;
    seg2.style.width = `${p2}%`;
    seg3.style.width = `${p3}%`;
    seg4.style.width = `${p4}%`;

    pct1.textContent = `${p1}%`;
    pct2.textContent = `${p2}%`;
    pct3.textContent = `${p3}%`;
    pct4.textContent = `${p4}%`;
  }

  function guardarEnLocalStorage(event) {
    event.preventDefault();

    const datos = {
      transporte: parseFloat(inputTransporte.value) || 0,
      energia: parseFloat(inputEnergia.value) || 0,
      alimentacion: parseFloat(inputAlimentacion.value) || 0,
      consumo: parseFloat(inputConsumo.value) || 0,
      total: parseFloat(totalSumadoEl.textContent) || 0,
      fecha: new Date().toLocaleDateString()
    };

    localStorage.setItem('huellaCarbono', JSON.stringify(datos));
    alert('¡Datos guardados exitosamente en LocalStorage!');
  }

  function mostrarModalDatos() {
    const datosGuardados = localStorage.getItem('huellaCarbono');

    if (!datosGuardados) {
      contenedorGuardados.innerHTML = '<p>No hay datos guardados aún en LocalStorage.</p>';
    } else {
      const huella = JSON.parse(datosGuardados);
      contenedorGuardados.innerHTML = `
        <p><strong>Fecha de registro:</strong> ${huella.fecha}</p>
        <ul style="margin: 1rem 0; padding-left: 1.2rem;">
          <li>🚗 Transporte: ${huella.transporte} kg</li>
          <li>⚡ Energía: ${huella.energia} kg</li>
          <li>🥗 Alimentación: ${huella.alimentacion} kg</li>
          <li>📦 Consumo General: ${huella.consumo} kg</li>
        </ul>
        <p><strong>Total registrado:</strong> ${huella.total} kg CO₂</p>
      `;
    }

    modalGrafica.classList.remove('hidden');
  }

  function ocultarModal() {
    modalGrafica.classList.add('hidden');
  }

  if (formHuellaGrafica) {
    [inputTransporte, inputEnergia, inputAlimentacion, inputConsumo].forEach(input => {
      input.addEventListener('input', calcularYActualizarGrafica);
    });

    formHuellaGrafica.addEventListener('submit', guardarEnLocalStorage);
    btnVerGrafica.addEventListener('click', mostrarModalDatos);
    btnCerrarModal.addEventListener('click', ocultarModal);

    calcularYActualizarGrafica();
  }
});