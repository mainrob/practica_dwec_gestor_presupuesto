// TODO: Crear las funciones, objetos y variables indicadas en el enunciado
"use strict";


var presupuesto = 0;
var gastos = [];
var idGasto = 0;

function actualizarPresupuesto(cant) {
    let cant2;

    if (cant >= 0) {
        presupuesto = cant;
        cant2 = presupuesto;
    }
    else {
        console.log("ERROR. El valor introducido no es válido.");
        cant2 = -1;
    }
    return cant2;
}

function mostrarPresupuesto() {

    let x = presupuesto;
    return (`Tu presupuesto actual es de ${x} €`);
}

function CrearGasto(descrip, valor = 0, fecha = Date.now(), ...etiquetas) {
    this.valor = parseFloat(valor);

    if (isNaN(valor) || valor < 0) {
        valor = 0;
    }

    this.valor = valor,
        this.descripcion = descrip,
        this.etiquetas = [...etiquetas],
        this.fecha = (typeof fecha === 'string') ? Date.parse(fecha) : fecha,

        this.mostrarGasto = function () {
            return (`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`);
        };
    this.actualizarDescripcion = function (newDescrip) {
        this.descripcion = newDescrip;
    };
    this.actualizarValor = function (newValor) {
        if (newValor >= 0) {
            this.valor = newValor;
        }
    };
    this.mostrarGastoCompleto = function () {
        let fecha1;
        if (typeof this.fecha === 'string') {
            fecha1 = Date.parse(this.fecha);
        }
        else {
            fecha1 = this.fecha;
        }
        let aux = "";
        for (let etiqueta of this.etiquetas) {
            aux = aux + `- ${etiqueta}\n`;
        };
        let fecha2 = new Date(fecha1);
        let texto = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${(fecha2.toLocaleString())}\nEtiquetas:\n`;
        return texto + aux;
    };
    this.actualizarFecha = function (newFecha) {
        let isValidDate = Date.parse(newFecha);
        if (!isNaN(isValidDate)) {
            this.fecha = Date.parse(newFecha);
        }
    };
    this.anyadirEtiquetas = function(...etiquetas){
        for(let etiqueta of etiquetas){
            if(this.etiquetas.includes(etiqueta) == false){
                this.etiquetas.push(etiqueta);
            }
        }
    }
    this.anyadirEtiquetas(...etiquetas);

    this.borrarEtiquetas = function(...etiquetas){
        for(let etiqueta of etiquetas){
            let index = this.etiquetas.indexOf(etiqueta);
            if(index != -1){
                this.etiquetas.splice(index,1);
                }
            }
    };
    this.obtenerPeriodoAgrupacion = function (periodo) {
        let validarFech = new Date(this.fecha);
        switch (periodo) {
            case "dia": {
                if (validarFech.getDate() < 10) {
                    if (validarFech.getMonth() < 9) {
                        return `${validarFech.getFullYear()}-0${validarFech.getMonth() + 1}-0${validarFech.getDate()}`;
                    }
                    else {
                        return `${validarFech.getFullYear()}-${validarFech.getMonth() + 1}-0${validarFech.getDate()}`;
                    }
                }
                else {
                    if (validarFech.getMonth() < 9) {
                        return `${validarFech.getFullYear()}-0${validarFech.getMonth() + 1}-${validarFech.getDate()}`;
                    }
                    else {
                        return `${validarFech.getFullYear()}-${validarFech.getMonth() + 1}-${validarFech.getDate()}`;
                    }
                }
                break;
            }
            case "mes": {
                if (validarFech.getMonth() < 9) {
                    return `${validarFech.getFullYear()}-0${validarFech.getMonth() + 1}`;
                }
                else {
                    return `${validarFech.getFullYear()}-${validarFech.getMonth() + 1}`;
                }
                break;
            }
            case "anyo": {
                return `${validarFech.getFullYear()}`
                break;
            }
            default: {
                return `EL PERIODO NO ES VÁLIDO`;
            }
        }
    }
}

function listarGastos() {
    return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = idGasto;
    idGasto++;
    gastos.push(gasto);
}

function borrarGasto(id) {
    for (let i = 0; i < gastos.length; i++) {
        if (gastos[i].id === id) {
            gastos.splice(i, 1);
        }
    }
}

function calcularTotalGastos() {
    let resul = 0;
    gastos.forEach((x) => {
        resul = resul + x.valor;
    })
    return resul;
}

function calcularBalance() {
    let resul = calcularTotalGastos();
    let balance = presupuesto - resul;
    return balance;
}

function filtrarGastos(filtro){

    let gastosFiltro = gastos;

    if(typeof(filtro) == "object"){

        if(Object.keys(filtro).length != 0){

            gastosFiltro = gastos.filter(function(gasto){

                let existe = true;

                if(filtro.fechaDesde){
                    let fDesde = Date.parse(filtro.fechaDesde);
                    if(gasto.fecha < fDesde){
                        existe = false;
                    }
                }

                if(filtro.fechaHasta){
                    let fHasta = Date.parse(filtro.fechaHasta);
                    if(gasto.fecha > fHasta){
                        existe = false;
                    }
                }

                if(filtro.valorMinimo){
                    if(gasto.valor < filtro.valorMinimo){
                        existe = false;
                    }
                }

                if(filtro.valorMaximo){
                    if(gasto.valor > filtro.valorMaximo){
                        existe = false;
                    }
                }

                if(filtro.descripcionContiene){
                    if(!gasto.descripcion.includes(filtro.descripcionContiene)){
                        existe = false;
                    }
                }
                
                if(filtro.etiquetasTiene){
                    let eTiene = filtro.etiquetasTiene;

                    let contiene = false;
                    for(let gast of gasto.etiquetas){
                        for(let tiene of eTiene){
                            if(gast == tiene){
                                    contiene = true;
                            }
                        }
                    }
                    if(contiene == false){
                        existe = false;
                    }                                          
                }
                return existe;
            });
        }
    }
    return gastosFiltro;
}

function agruparGastos(periodo, etiquetas, fechaDesde, fechaHasta) {
    let etiquetasTiene = etiquetas;

    if (!fechaDesde)
        fechaDesde = "2000-01-01";

    if (!fechaHasta)
        fechaHasta = new Date(Date.now()).toISOString().substr(0,10);

    let grupoGastos = filtrarGastos({fechaDesde, fechaHasta, etiquetasTiene})
    let resul = grupoGastos.reduce((acc, grupo) => { 
        
        acc[grupo.obtenerPeriodoAgrupacion(periodo)] = (acc[grupo.obtenerPeriodoAgrupacion(periodo)] || 0) + grupo.valor; 
        return acc;
    
    }, {});
    return resul;
}

function transformarListadoEtiquetas (etiquetasTiene) {
    let etiquetasFiltradas = etiquetasTiene.match(/[a-z0-9]+/gi);
    return etiquetasFiltradas;
}

function cargarGastos(nGastos) {
        // gastosAlmacenamiento es un array de objetos "planos"
        // No tienen acceso a los métodos creados con "CrearGasto":
        // "anyadirEtiquetas", "actualizarValor",...
        // Solo tienen guardadas sus propiedades: descripcion, valor, fecha y etiquetas
      
        // Reseteamos la variable global "gastos"
        gastos = [];
        // Procesamos cada gasto del listado pasado a la función
        for (let g of nGastos) {
            // Creamos un nuevo objeto mediante el constructor
            // Este objeto tiene acceso a los métodos "anyadirEtiquetas", "actualizarValor",...
            // Pero sus propiedades (descripcion, valor, fecha y etiquetas) están sin asignar
            let gastoRehidratado = new CrearGasto();
            // Copiamos los datos del objeto guardado en el almacenamiento
            // al gasto rehidratado
            // https://es.javascript.info/object-copy#cloning-and-merging-object-assign
            Object.assign(gastoRehidratado, g);
            // Ahora "gastoRehidratado" tiene las propiedades del gasto
            // almacenado y además tiene acceso a los métodos de "CrearGasto"
              
            // Añadimos el gasto rehidratado a "gastos"
            gastos.push(gastoRehidratado)
        }
    //gastos = nGastos;
}

// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombresul que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos,
    transformarListadoEtiquetas,
    cargarGastos
}