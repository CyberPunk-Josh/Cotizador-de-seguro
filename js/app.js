//Constructor para seguro:
//Debe recolectar los datos del formulario:
function Seguro(marca,anio,tipo){
    this.marca = marca;
    this.anio = anio;
    this.tipo = tipo;
}

//Creando las fechas:
//"getFullYear" = año maximo actual
const max = new Date().getFullYear(),
    min = max - 20;
 

//Imprimiendo en el documento en la seccion de años:
const selectAnios = document.getElementById('anio');
for(let i = max; i >min; i--){
    let option = document.createElement('option');  //Option desplega la pantalla tipo lista
    option.value = i;
    option.innerHTML = i;
    selectAnios.appendChild(option);
}

//Interfaz de usuario:
function Interfaz() {}

//Event Listener:
const formulario = document.getElementById('cotizar-seguro');
formulario.addEventListener('submit', function(e){
    e.preventDefault();
    //Acceder a la marca selecionada:
    const marca = document.getElementById('marca');
    const marcaSeleccionada = marca.options[marca.selectedIndex].value;
    //Acceder al año seleccionado del <select>
    const anio = document.getElementById('anio');
    const anioSelecionado = anio.options[anio.selectedIndex].value;
    //Leer el valor del radio-button.
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    //Crear Instancia de Interfaz:
    const interfaz = new Interfaz();
    //Revisando que los campos no esten vacios:
    if(marcaSeleccionada === "" || anioSelecionado === "" || tipo === ""){
        //Interfza imprimiendo error:
        interfaz.mostrarError('Faltan datos, revisa el formulario', 'error'); //Esto se carga en la seccion de interfaz
    } else{
        //Limpiar resultados anteriores:
        const resultados = document.querySelector('#resultado div');
        if (resultados != null){
            resultados.remove();
        }
        //Instanciar seguro y mostrar interfaz:
        const seguro = new Seguro(marcaSeleccionada, anioSelecionado, tipo);
        //Cotizar el seguro:
        const cantidad = seguro.cotizaSeguro(seguro);
        //Mostrar el resultado:
        interfaz.mostrarResultado(seguro, cantidad);
    }
});

//Mensaje que se imprime en el HTML:
Interfaz.prototype.mostrarError = function(mensaje,tipo){
    const div = document.createElement('div');
    if(tipo === 'error'){
        div.classList.add('mensaje', 'error'); //Se crea una clase "mensaje"
    }else{
        div.classList.add('mensaje', 'correcto'); 
    }
    div.innerHTML = `${mensaje}`;
    formulario.insertBefore(div, document.querySelector('.form-group'));
    //Eliminar el error de mensaje:
    setTimeout(function(){
        document.querySelector('.mensaje').remove();
    }, 3000);
}

//Cotizar el seguro:
Seguro.prototype.cotizaSeguro = function(){
    /*
    1 = americano 1.15
    2 = asiatico 1.05
    3 = europeo 1.35
    */
   let cantidad;
   const base = 2000;
   switch(this.marca){
        case '1':
           cantidad = base*1.15;
           break;
        case '2':
           cantidad = base*1.05;
           break;
        case '3':
           cantidad = base*1.35;
           break;
   }
   //Leer el año
   const direfencia = new Date().getFullYear() - this.anio;
   //Cada año de diferencia hay que reducir 3% el valor del seguro:
   cantidad -= ((direfencia*3)*cantidad) / 100;
   /*
    Si el seguro es basico, se multiplica por 30% mas
    Si es completo 50% mas
   */ 
  if(this.tipo === 'basico'){
      cantidad *=1.30;
  }else{
      cantidad *=1.50;
  }
  return cantidad;
}

//Mostrar el Resultado:
Interfaz.prototype.mostrarResultado = function (seguro, total){
    const resultado = document.getElementById('resultado');
    let marca;
    switch(seguro.marca){
        case '1':
            marca = "Americano";
            break;
        case '2':
            marca = "Asiatico";
            break;
        case '3':
            marca = "Europeo";
            break;
    }
    //Crear un div:
    const div = document.createElement('div');
    //Insertar la informacion:
    div.innerHTML = `
       <p class='header'>Resumen:</p>
       <p>Marca: ${marca}</p>
       <p>Año: ${seguro.anio}</p>
       <p>Tipo: ${seguro.tipo}</p>
       <p>Total: $ ${total}</p>
    `
    //Cargar el spinner:
    const spinner = document.querySelector('#cargando img');
    spinner.style.display = 'block';
    setTimeout(function(){
        spinner.style.display = 'none';
        resultado.appendChild(div);
    }, 3000);
    
}