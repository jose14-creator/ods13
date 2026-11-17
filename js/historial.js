// ==========================================
// PASO 1. Selección de elementos del DOM
// ==========================================
const formRegistro = document.querySelector('#form-registro');
const inputMes = document.querySelector('#input-mes');
const inputEmision = document.querySelector('#input-emision');
const tablaCuerpo = document.querySelector('#tabla-cuerpo');
const contenedorGrafico = document.querySelector('#contenedor-grafico');
const contenedorResultado = document.querySelector('#contenedor-resultado');

// Datos iniciales de prueba (en caso de que el localStorage esté vacío)
const datosIniciales = [
  { mes: 'Julio', emision: 120 },
  { mes: 'Agosto', emision: 100 },
  { mes: 'Septiembre', emision: 80 }
];

// ==========================================
// PASO 2. Gestión de Almacenamiento (CA01)
// ==========================================
// Carga registros almacenados o inicializa con los datos base
function obtenerRegistros() {
  const guardados = localStorage.getItem('historialHuella');
  if (guardados) {
    return JSON.parse(guardados);
  } else {
    localStorage.setItem('historialHuella', JSON.stringify(datosIniciales));
    return datosIniciales;
  }
}

// Guarda un nuevo registro en localStorage
function guardarRegistro(mes, emision) {
  const registros = obtenerRegistros();
  registros.push({ mes, emision });
  localStorage.setItem('historialHuella', JSON.stringify(registros));
}

// ==========================================
// PASO 3. Renderizado de Interfaz (CA02 y CA03)
// ==========================================
function renderizarHistorial() {
  const registros = obtenerRegistros();

  // Limpiar contenedores
  tablaCuerpo.innerHTML = '';
  contenedorGrafico.innerHTML = '';

  if (registros.length === 0) return;

  // Calcular emisión máxima para escalar el gráfico porcentualmente (CA02)
  const maxEmision = Math.max(...registros.map(r => r.emision), 1);

  // Recorrer los registros para construir la Tabla y la Gráfica
  registros.forEach((registro, index) => {
    let variacionTexto = 'Mes de referencia';
    let claseIndicador = 'neutro';
    let claseBadge = '';

    // PASO 3.1 Criterio CA03: Calcular indicador visual respecto al mes anterior
    if (index > 0) {
      const emisionAnterior = registros[index - 1].emision;
      const diferencia = registro.emision - emisionAnterior;

      if (diferencia < 0) {
        // Reducción / Mejora ambiental
        variacionTexto = `↓ ${Math.abs(diferencia)} kg`;
        claseIndicador = 'disminucion';
        claseBadge = 'badge-disminucion';
      } else if (diferencia > 0) {
        // Aumento / Alerta
        variacionTexto = `↑ ${diferencia} kg`;
        claseIndicador = 'aumento';
        claseBadge = 'badge-aumento';
      } else {
        variacionTexto = '= 0 kg';
        claseIndicador = 'neutro';
      }
    }

    // 1. Construir fila de la Tabla
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${registro.mes}</td>
      <td>${registro.emision} kg</td>
      <td class="${claseIndicador}">
        <span class="badge-indicador ${claseBadge}">${variacionTexto}</span>
      </td>
    `;
    tablaCuerpo.appendChild(tr);

    // 2. Construir barra para el Gráfico Temporal (CA02)
    const porcentajeAncho = (registro.emision / maxEmision) * 100;
    const filaGrafico = document.createElement('div');
    filaGrafico.className = 'fila-grafico';
    filaGrafico.innerHTML = `
      <span class="etiqueta">${registro.mes}: ${registro.emision} kg de CO₂</span>
      <div class="barra-fondo">
        <div class="barra" style="width: ${porcentajeAncho}%; background-color: ${index % 2 === 0 ? '#43a047' : '#2e7d32'};">
          ${registro.emision} kg
        </div>
      </div>
    `;
    contenedorGrafico.appendChild(filaGrafico);
  });

  // PASO 3.2 Actualizar panel de resumen/resultado del último mes
  actualizarResumenComparativo(registros);
}

// Función auxiliar para actualizar la caja de resultados finales
function actualizarResumenComparativo(registros) {
  if (registros.length < 2) {
    contenedorResultado.innerHTML = `
      <h3>Resultado de la comparación</h3>
      <p>Registra al menos dos meses para ver la comparativa.</p>
    `;
    return;
  }

  const ultimo = registros[registros.length - 1];
  const penultimo = registros[registros.length - 2];
  const dif = ultimo.emision - penultimo.emision;

  if (dif < 0) {
    contenedorResultado.innerHTML = `
      <h3>Resultado de la comparación</h3>
      <p class="disminucion">↓ ¡Las emisiones de CO₂ han disminuido respecto al mes anterior!</p>
      <p>Entre ${penultimo.mes} y ${ultimo.mes}, tus emisiones cambiaron de ${penultimo.emision} kg a ${ultimo.emision} kg de CO₂.</p>
      <p><strong>Reducción de este mes: ${Math.abs(dif)} kg de CO₂.</strong></p>
    `;
  } else if (dif > 0) {
    contenedorResultado.innerHTML = `
      <h3>Resultado de la comparación</h3>
      <p class="aumento">↑ Las emisiones de CO₂ han aumentado respecto al mes anterior.</p>
      <p>Entre ${penultimo.mes} y ${ultimo.mes}, tus emisiones pasaron de ${penultimo.emision} kg a ${ultimo.emision} kg de CO₂.</p>
      <p><strong>Incremento de este mes: ${dif} kg de CO₂. Revisa tus hábitos.</strong></p>
    `;
  } else {
    contenedorResultado.innerHTML = `
      <h3>Resultado de la comparación</h3>
      <p class="neutro">= Las emisiones se mantuvieron iguales que el mes anterior (${ultimo.emision} kg).</p>
    `;
  }
}

// ==========================================
// PASO 4. Escuchar Eventos (Formulario)
// ==========================================
formRegistro.addEventListener('submit', function (e) {
  e.preventDefault(); // Evita recargar la página

  const mesTexto = inputMes.value.trim();
  const emisionValor = parseFloat(inputEmision.value);

  if (mesTexto && !isNaN(emisionValor)) {
    // Guardar nuevo registro en LocalStorage
    guardarRegistro(mesTexto, emisionValor);
    
    // Volver a renderizar la UI con la información nueva
    renderizarHistorial();

    // Limpiar campos del formulario
    inputMes.value = '';
    inputEmision.value = '';
  }
});

// Inicializar la vista en la primera carga
document.addEventListener('DOMContentLoaded', renderizarHistorial);