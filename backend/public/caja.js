    let carrito=[];
    let total=0;
    let metodopago=null;
document.addEventListener("DOMContentLoaded",()=>{

    //validacion segura
    const usuario=sessionStorage.getItem("usuario");
    
    if(!usuario){
        window.location.href="index.html";
        return;
    }

    cargarventas();
    setInterval(cargarventas,5000);

    //abri y cerrar - deslisable
    const btnventas=document.getElementById("btnventas");
    const panelventas=document.getElementById("panelventas");

    btnventas.addEventListener("click",()=>{
        panelventas.classList.toggle("activo");
        if(panelventas.classList.contains("activo")){
            btnventas.textContent="Cerrar Ventas";
        }else{
            btnventas.textContent="Ver Ventas Del Día";
        }
    });
    //cerrar deslisable
    document.addEventListener("click",(e)=>{
        const panelventas=document.getElementById("panelventas");
        const btnventas=document.getElementById("btnventas");

        if(panelventas.classList.contains("activo")&&
            !panelventas.contains(e.target) &&
            !btnventas.contains(e.target)){
                panelventas.classList.remove("activo");
                btnventas.textContent="Ver Ventas Del Día";
        }
    });

    //llamar barra busqueda
    document.getElementById("buscarproducto").addEventListener("input",buscarproducto);
    
    ///Cerrar sesion caja
    document.getElementById("cerrarsesion").addEventListener("click",()=>{
        sessionStorage.clear();
        localStorage.clear();
        window.location.assign("index.html");
    });

    //cancelar venta
    document.getElementById("cancelar").addEventListener("click",()=>{
        
        if(confirm("¿Cancelar Venta?")){
            carrito=[];
            total=0;
            metodopago=null;
            actualizarcarrito();
        }
    });

    //seleccionar metodo pago
    document.querySelectorAll("[data-pago]").forEach(btn=>{
        btn.addEventListener("click",()=>{

            if(carrito.length === 0){
                mostrarmensaje("Agregue productos primero");
                return;
            }

            document.querySelectorAll("[data-pago]").forEach(b=>b.classList.remove("activo"));
            btn.classList.add("activo");

            metodopago=btn.dataset.pago;

            if(metodopago==="efectivo"){
                document.getElementById("pagoefectivo").style.display="block";
            }else{
                document.getElementById("pagoefectivo").style.display="none";
            }
            mostrarmensaje("Pago con " + metodopago.toUpperCase()+" seleccionado");
        });
    });

    // clic en categorias
    document.querySelectorAll("#categorias .producto").forEach(cat=>{
        cat.addEventListener("click",()=>{
            const categoriaId=cat.dataset.id;
            document.getElementById("categorias").style.display="none";
            
            cargarproductos(categoriaId);
        });
    });
    
    //llamar finalizar venta
    document.getElementById("finalizar").addEventListener("click",finalizarventa);

    console.log("script cargado");

    document.getElementById("dinerorecibido").addEventListener("input",calcularcambio);

    // generar ´pdf
    document.getElementById("generarreporte").addEventListener("click",()=>{
        const btn=document.getElementById("generarreporte");

        btn.textContent="Generando reporte...";
        btn.disabled=true;

        fetch("/reporte/hoy")
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                mostrarmensaje("Reporte generado correctamente");
            }
            btn.textContent="Generar Reporte Del Día";
            btn.disabled=false;
        });
    });
});


// agregar producto --- verificar que no se repita el producto seleccionado
function agregarproducto(id,nombre,precio,stock){
    precio=Number(precio); //comvierte a numero
    const productoexistente=carrito.find(p=>p.id===id);
    if(productoexistente){
        if(productoexistente.cantidad>=productoexistente.stock){
            alert("No hay más stock disponible");
            return;
        }
        productoexistente.cantidad++;
    }else{
        carrito.push({
            id:id,
            nombre:nombre,
            precio:precio,
            cantidad:1,
            stock:stock
        });
    }

    actualizarcarrito();
}

// funcion calcular cambio
function calcularcambio(){
    const recibido=Number(document.getElementById("dinerorecibido").value || 0);
    const cambio= recibido -total;

    document.getElementById("cambio").textContent=cambio>=0? cambio.toLocaleString():"0";
}

//actualizar carrito
function actualizarcarrito(){
    const contenedor=document.getElementById("carrito");
    contenedor.innerHTML="";
    let nuevototal=0;

    carrito.forEach((p,index)=>{
        const subtotal=p.precio*p.cantidad;
        const div=document.createElement("div");

        div.classList.add("item-carrito");

        nuevototal+=subtotal;

        div.innerHTML=`
        <span class="nombre">${index+1}. ${p.nombre}</span>

        <div class="controles">
            <button onclick="disminuircantidad(${index})">-</button>
            <span>${p.cantidad}</span>
            <button onclick="aumentarcantidad(${index})">+</button>
        </div>
        <span class="precio">$${subtotal.toLocaleString()}</span>
        <button class="eliminar" onclick="eliminarproducto(${index})">X</button>
        `;
        contenedor.appendChild(div);
    });

    total=nuevototal;

    document.getElementById("total").textContent=total.toLocaleString();
}

//eliminar producto
function eliminarproducto(index){

    carrito.splice(index,1);
    actualizarcarrito();
}

//aumentar cantidad
function aumentarcantidad(index){
    const producto=carrito[index];

    if(producto.cantidad>=producto.stock){
        alert("No hay más stock disponible");
        return;
    };
    producto.cantidad++;
    actualizarcarrito();
}

//disminuir cantidad
function disminuircantidad(index){
    const producto=carrito[index];

    producto.cantidad--;

    if(producto.cantidad<=0){
        carrito.splice(index,1);
    }

    actualizarcarrito();
}

//guardar ventas - finalizar venta
function finalizarventa(){

    if(carrito.length === 0){
        alert("No hay productos en el carrito");
        return;
    }
    if(!metodopago){
        alert("Seleccione método de pago");
        return;
    }
    if(metodopago==="efectivo"){
        const recibido=Number(document.getElementById("dinerorecibido").value);
        if(recibido<total){
            alert("El dinero recibido es menor al total");
            return;
        }
    }
    fetch("/checkout",{
        method:"POST",
        headers:{
            "content-Type":"application/json"
        },
        body:JSON.stringify({
            tipo:"presencial",
            usuario:null,
            carrito:carrito,
            total:total,
            metodo_pago:metodopago
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success){

            if(metodopago==="efectivo"){
                mostrarmensaje("Venta Registrada Correctamente");
            }
            if(metodopago==="nequi"){
                mostrarmensaje("Venta Registrada Correctamente");
            }
            if(metodopago==="tarjeta"){
                mostrarmensaje("Venta Registrada Correctamente");
            }

            mostrarrecibo(carrito,total,metodopago);

            carrito=[];
            total=0;
            metodopago=null;

            document.getElementById("dinerorecibido").value="";
            document.getElementById("cambio").textContent="0";
            document.getElementById("pagoefectivo").style.display="none";

            actualizarcarrito();
            cargarventas();
            
            const noti=document.getElementById("notificacionventa");
            if(noti){
                noti.style.display="flex";
                setTimeout(()=>{
                    noti.style.display="none";
                },4000);
            }
        }
    });
};

//cargar productos
async function cargarproductos(categoriaId) {
    const res=await fetch(`/producto/categoria/${categoriaId}`);
    const producto=await res.json();
    const contenedor=document.getElementById("productos");

    contenedor.innerHTML="";

    //boton volver
    const btnvolver=document.createElement("button");
    btnvolver.textContent="Volver a Categorías";
    btnvolver.classList.add("btn-volver");
    btnvolver.onclick=()=>{
        document.getElementById("categorias").style.display="grid";
        contenedor.innerHTML="";
    };

    contenedor.appendChild(btnvolver);

    producto.forEach(p=>{
        const div=document.createElement("div");

        div.classList.add("producto");
        div.onclick=()=>agregarproducto(p.id,p.nombre,p.precio,p.stock);

        div.innerHTML=`
        <img src="/${p.imagen}">
        <h4>${p.nombre}</h4> 
        <p>$${p.precio}</p>
        <small>Stock: ${p.stock}</small>
        `;
        contenedor.appendChild(div);
    });
}

async function buscarproducto(e) {
    const texto=e.target.value.trim();
    const contenedor=document.getElementById("productos");

    //limpiar resultados
    if(texto.length <2){
        document.getElementById("categorias").style.display="grid";
        contenedor.innerHTML="";
        return;
    }

    document.getElementById("categorias").style.display="none";

    //conectar con productos para busqueda
    const res=await fetch(`/producto/buscar/${texto}`);
    const producto=await res.json();
    
    contenedor.innerHTML="";

    producto.forEach(p=>{
        const div=document.createElement("div");

        div.classList.add("producto");

        if(p.stock <=0){
            div.style.opacity="0.5";
            div.innerHTML+=`<p style="color:red;">Sin Stock</p>`;
        }else{
            div.onclick=()=>agregarproducto(p.id,p.nombre,p.precio,p.stock);
        }
        
        if(p.stock<=5){
            div.innerHTML+=`<p style="color:orange;">Stock Bajo</p>`;
        }

        div.innerHTML=`
        <img src="/${p.imagen}">
        <h4>${p.nombre}</h4>
        <p>$${p.precio}</p>`;

        if(p.stock<=0){
            div.style.opacity="0.5";
            div.innerHTML+=`<p style="color:red;">Sin Stock</p>`;
        }else{
            div.onclick=()=>agregarproducto(p.id,p.nombre,p.precio,p.stock);
        }
        if(p.stock<=5 && p.stock>0){
            div.innerHTML+=`<p style="color:orange;">Stock Bajo</p>`;
        }
        contenedor.appendChild(div);
    });
}

//mostrar mensaje compra realizada
function mostrarmensaje(texto){
    const modal=document.getElementById("mensaje");
    document.getElementById("textoMensaje").textContent=texto;
    modal.style.display="flex";

    //cerrar solo
    setTimeout(()=>{
        modal.style.display="none"
    },4000);
}

// resumen de compra del dia
async function cargarventas() {
    const res=await fetch("/ventas/hoy");
    const ventas=await res.json();
    const tabla=document.getElementById("tablaventas");

    tabla.innerHTML="";

    let totalefectivo=0;
    let totalnequi=0;
    let totaltarjeta=0;

    ventas.forEach((v,index)=>{
        const fila=document.createElement("tr");

        fila.innerHTML=`
        <td>${index+1}</td>
        <td>Venta #${v.id}</td>
        <td>${v.total.toLocaleString()}</td>
        <td>${v.metodo_pago}</td>
        <td>${new Date(v.fecha).toLocaleTimeString()}</td>`;

        tabla.appendChild(fila);
        const metodo=v.metodo_pago.toLowerCase();
        if(metodo==="efectivo"){
            totalefectivo+=Number(v.total);
        }
        if(metodo==="nequi"){
            totalnequi+=Number(v.total);
        }
        if(metodo==="tarjeta"){
            totaltarjeta+=Number(v.total);
        }
    });

    document.getElementById("totalefectivo").textContent="$"+totalefectivo.toLocaleString();
    document.getElementById("totalnequi").textContent="$"+totalnequi.toLocaleString();
    document.getElementById("totaltarjeta").textContent="$"+totaltarjeta.toLocaleString();
    document.getElementById("totaldia").textContent="$"+(totalefectivo+totalnequi+totaltarjeta).toLocaleString();
}

/// imprimir recibo
function mostrarrecibo(carrito,total,metodo){
    const contenedor=document.getElementById("recibocontenido");
    let html="";
    html+="<hr>";

    carrito.forEach((p,i)=>{
        html+=`
        <div> ${i+1}. ${p.nombre}<br> ${p.cantidad} x $${p.precio}</div>`;
    });

    html+=`
    <hr>
    <strong>Total: $${total.toLocaleString()}</strong><br>
    Pago: ${metodo.toUpperCase()}<br>
    Hora: ${new Date().toLocaleTimeString()}
    <hr>`;

    contenedor.innerHTML=html;
    const modal=document.getElementById("reciboModal");
    modal.style.display="flex";
    //cerrar automaticamente
    setTimeout(()=>{
        modal.style.display="none";
    },4000);
}
function imprimirrecibo(){
    window.print();

    setTimeout(()=>{
        document.getElementById("reciboModal").style.display="none" 
    },1000);
}
function cerrarrecibo(){
    document.getElementById("reciboModal").style.display="none";
}
