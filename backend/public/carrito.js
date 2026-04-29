document.addEventListener("DOMContentLoaded", () =>{
    //estado del carrito
    let carrito = [];
    
    // elementos
    const btnCheckout = document.getElementById("btnCheckout");
    const checkoutModal=document.getElementById("checkoutOverlay");
    const btncerrarCheckout=document.getElementById("btncerrarCheckout");
    const btnpresencial=document.getElementById("btnpresencial");
    const btndistancia=document.getElementById("btndistancia");
    const presencialmodal=document.getElementById("presencialModal");
    const distanciamodal=document.getElementById("distanciaModal");

    const carritocount =document.getElementById("carritocount");
    const btnvaciar= document.getElementById("btnvaciarcarrito");
    const cartDropdown= document.getElementById("cartDropdown");
    const cartItems=document.getElementById("cartItems");
    const carttotal=document.getElementById("carttotal");

    //agregar productos
    function agregaralcarrito(id, nombre, precio, cantidad){
        const productoexistente =carrito.find(p=>p.id === id);
        if(productoexistente){
            productoexistente.cantidad += cantidad;
        }else{
            carrito.push({
                id,
                nombre,
                precio,
                cantidad
            });
        }
        actualizarcarrito();
    }

    // actualizar
    function actualizarcarrito(){
        cartItems.innerHTML ="";
        let total=0;
        let totalItems =0;

        carrito.forEach(p=>{
            total += p.precio*p.cantidad;
            totalItems += p.cantidad;

            const div = document.createElement("div");
            div.classList.add("cart-item");

            div.innerHTML=`
            <span class="cart-nombre">${p.nombre}</span>
            <div class="cart-contador">
                <button class="btn-cantidad" onclick="restarproducto(${p.id})">-</button>
                <span>${p.cantidad}</span>
                <button class="btn-cantidad" onclick="sumarproducto(${p.id})">+</button>
            </div>
            <span class="cart-precio">$${(p.precio*p.cantidad).toLocaleString("es-CO")}</span>
            `;
            cartItems.appendChild(div);
        });
        carttotal.textContent = total.toLocaleString("es-CO");
        carritocount.textContent =totalItems;

        guardarcarrito();
    }

    //-------sumar/restar-----
    function sumarproducto(id){
        const producto = carrito.find(p=>p.id === id);
        if(!producto) return;
        producto.cantidad++;
        actualizarcarrito();
    }
    function restarproducto(id){
        const producto = carrito.find(p=>p.id === id);
        if(!producto) return;
        producto.cantidad--;

        if(producto.cantidad<=0){
            carrito =carrito.filter(p=>p.id !== id);
        }
        actualizarcarrito();
    }

    // guardar carrito
    function guardarcarrito(){
        localStorage.setItem("carrito",JSON.stringify(carrito));
    }
    // cargar carrito guardado
    function cargarcarrito(){
        const data =localStorage.getItem("carrito");
        if(data){
            carrito=JSON.parse(data);
            actualizarcarrito();
        }
    }

    //vaciar carro

        btnvaciar.addEventListener("click", ()=>{
            carrito=[];
            actualizarcarrito();
        });

    //abrir opciones de comprar
    btnCheckout.addEventListener("click", () =>{
        limpiarformulariodistancia();  //limpiar antes de abrir

        console.log("CLICK EN FINALIZAR COMPRA");
        if(carrito.length == 0){
            alert("Carro vacío");
            return;
        }
        let usuario=null;

        if(typeof obtenerusuario==="function"){
            usuario = obtenerusuario();
        }

        if(usuario){
            console.log("Usuario logueado", usuario.nombre);
        }else{
            console.log("Compra como invitado");
        }

        
        checkoutModal.classList.remove("hide");
        resetearCheckout();
    });

    //cerrar opciones de comprar
    btncerrarCheckout.addEventListener("click", () =>{
        checkoutModal.classList.add("hide");
        limpiarlogincompra();
        resetearCheckout();
    });

    //opcion en persona
    btnpresencial.addEventListener("click", () =>{
        checkoutModal.classList.add("hide");
        mostrarResumen("presencial");
        presencialmodal.classList.remove("hide");
    });

    // opcion distancia
    btndistancia.addEventListener("click", () =>{
        document.getElementById("datosinvitado").classList.add("hide");
        document.getElementById("seccionpagodistancia").classList.add("hide");
        document.getElementById("btnfinalizardistancia").disabled=true;

        //reset metodos pago
        document.querySelectorAll('input[name="pagodistancia"]').forEach(r=>{
            r.checked=false;
        });

        document.getElementById("formtarjeta").classList.add("hide");
        document.getElementById("formnequi").classList.add("hide");

        checkoutModal.classList.add("hide");
        mostrarResumen("distancia");
        distanciamodal.classList.remove("hide");

        const usuario=typeof obtenerusuario==="function"
        ? obtenerusuario() : null;

        if(!usuario){
            document.getElementById("opcionescompraonline").classList.remove("hide");
            
        }else{
            document.getElementById("datosinvitado").classList.remove("hide");

            //llenardatos automaticamente
            document.getElementById("invnombre").value=usuario.nombre ||"";
            document.getElementById("invdireccion").value=usuario.direccion ||"";
            document.getElementById("invtelefono").value=usuario.telefono ||"";

            verificarestadofinalizar(); ///////////////////////////

            //mostrar metodo de pago
            document.getElementById("seccionpagodistancia").classList.remove("hide");
        }
    });
   
        // evitar cierre clic dentro
    cartDropdown?.addEventListener("click", e => e.stopPropagation());

    // inicial
    cargarcarrito();

    window.agregaralcarrito = agregaralcarrito;
    window.sumarproducto=sumarproducto;
    window.restarproducto=restarproducto;

    //precencial
    document.querySelectorAll('input[name="pagopresencial"]').forEach(radio=>{
        radio.addEventListener("change",()=>{
            document.getElementById("btnfinalizarpresencial").disabled=false;
        });
    });

    //distancia
    document.querySelectorAll('input[name="pagodistancia"]').forEach(radio=>{
        radio.addEventListener("change",()=>{

            const btnfinal=document.getElementById("btnfinalizardistancia");

            //ocultar formularios siempre al cambiar
            document.getElementById("formtarjeta").classList.add("hide");
            document.getElementById("formnequi").classList.add("hide");
            
            btnfinal.disabled=true;

            //efectivo o contraentrega
            if(radio.value==="efectivo"){
                btnfinal.disabled=false;
            }

            //mostrar formulario tarjeta
            if(radio.value==="tarjeta"){
                document.getElementById("formtarjeta").classList.remove("hide");
            }

            //nequi
            if(radio.value==="nequi"){
                document.getElementById("formnequi").classList.remove("hide");
            }
            verificarestadofinalizar();
        });
    });
            ["nequinumero","numtarjeta","cvv","fecha","titular","invnombre","invdireccion","invtelefono"].forEach(id=>{
                const campo=document.getElementById(id);

                if(campo){
                    campo.addEventListener("input",verificarestadofinalizar);
                }
            });

    //finalizar presencial
    document.getElementById("btnfinalizarpresencial")
    .addEventListener("click",()=>{
        const metodoseleccionado=document.querySelector(
            'input[name="pagopresencial"]:checked'
        );
        if(!metodoseleccionado){
            alert("Seleccione un método de pago");
            return;
        }

        const metodo=metodoseleccionado.value;
        procesarCheckout("presencial", metodo);
    });

    //finalizar distancia
    document.getElementById("btnfinalizardistancia")
    .addEventListener("click",()=>{
        const metodoseleccionado=document.querySelector(
            'input[name="pagodistancia"]:checked'
        )

        if(!metodoseleccionado){
            alert("Seleccione un método de pago");
            return;
        }

        const metodo=metodoseleccionado.value;

        if(metodo==="nequi"){
            const numero=document.getElementById("nequinumero").value.trim();
            if(!validarnequi(numero)){
                mostrarerror("nequinumero","Número invalido");
                return;
            }else{
                limpiarerror("nequinumero");
            }
        }

        if(metodo==="tarjeta"){
            const numerotarjeta= document.getElementById("numtarjeta").value.trim();
            const cvv= document.getElementById("cvv").value.trim();
            const fecha= document.getElementById("fecha").value.trim();
            const titular= document.getElementById("titular").value.trim();

            if(!titular){
                alert("Debe ingresar el nombre del titular");
                return;
            }
            
            if(!validartarjeta(numerotarjeta, cvv, fecha)){
                alert("Datos de tarjeta inválidos");
                return;
            }
        }

        procesarCheckout("distancia",metodo);
    });

    document.getElementById("btncerrardistancia")
    .addEventListener("click",()=>{
        limpiarformulariodistancia();
        limpiarlogincompra();

        document.getElementById("formtarjeta").classList.add("hide");
        document.getElementById("formnequi").classList.add("hide");

        document.getElementById("distanciaModal").classList.add("hide");
    });

    document.getElementById("btncerrarpresencial")
    .addEventListener("click",()=>{
        document.getElementById("presencialModal").classList.add("hide");
    });

    // validavion invitado
        function verificarestadofinalizar(){
            const btn=document.getElementById("btnfinalizardistancia");
            const seccionpago=document.getElementById("seccionpagodistancia");

            const usuario=typeof obtenerusuario==="function"?obtenerusuario():null;

            let datosvalidos=false;

            if(usuario){
                // si usuario ya logueado no validar invitado
                datosvalidos =true;
            }else{
                const nombre=document.getElementById("invnombre").value.trim();
                const direccion=document.getElementById("invdireccion").value.trim();
                const telefono=document.getElementById("invtelefono").value.trim();

                const regextelefono=/^3\d{9}$/;

                if(nombre.length>=3 && direccion.length>=5 && regextelefono.test(telefono)){
                    datosvalidos=true;
                }
            }

            //mostrar u ocultar seccion pago
            if(datosvalidos){
                seccionpago.classList.remove("hide");
            }else{
                //seccionpago.classList.add("hide");
                btn.disabled=true;
                return;
            }
            
            //validar metodo de pago
            const metodo=document.querySelector('input[name="pagodistancia"]:checked');

            let pagovalido= false;
            
            if(metodo){
                if(metodo.value==="efectivo"){
                    pagovalido=true;
                }
                if(metodo.value=== "nequi"){
                    const numero=document.getElementById("nequinumero").value.trim();
                    
                    if(!validarnequi(numero)){
                        mostrarerror("nequinumero","Número inválido");
                        pagovalido=false;
                    }else{
                        limpiarerror("nequinumero");
                        pagovalido=true;
                    }
                }
                if(metodo.value==="tarjeta"){
                    const numero= document.getElementById("numtarjeta").value.trim();
                    const cvv= document.getElementById("cvv").value.trim();
                    const fecha= document.getElementById("fecha").value.trim();
                    const titular= document.getElementById("titular").value.trim();

                    if(numero.replace(/\s/g,"").length===16 && cvv.length===3 && fecha.length ===5 && titular.length >2){
                        pagovalido=validartarjeta(numero, cvv, fecha);
                    }else{
                        pagovalido=false;
                    }
                }
            }
            btn.disabled=!pagovalido;
        }

    // eventos de botones invitado o iniciar sesion
    document.getElementById("btncontinvitado")
    .addEventListener("click",()=>{
        document.getElementById("opcionescompraonline").classList.add("hide");
        document.getElementById("datosinvitado").classList.remove("hide");
    });
    
    document.getElementById("btnirlogin")
    .addEventListener("click",()=>{
    limpiarlogincompra();
    document.getElementById("opcionescompraonline").classList.add("hide");
    document.getElementById("logincompra").classList.remove("hide");
    });

    document.getElementById("opcionescompraonline").classList.add("hide");


});

    // limpiar campos de iniciar sesion compra
    function limpiarlogincompra(){
        const user=document.getElementById("loginusercompra");
        const pass=document.getElementById("loginpasscompra");
        const error=document.getElementById("loginerrorcompra");

        if(user) user.value="";
        if(pass) pass.value="";
        if(error) error.textContent="";
    }

/// poner / en fecha en tarjeta
const fechainput=document.getElementById("fecha");

if(fechainput){
    fechainput.addEventListener("input",e=>{
        let v=e.target.value.replace(/\D/g,"");

        if(v.length>2){
            v=v.slice(0,2)+"/" + v.slice(2,4);
        }
        e.target.value=v;
    });
}

///espacios para numero de tarjeta
const tarjetainput=document.getElementById("numtarjeta");

if(tarjetainput){
    tarjetainput.addEventListener("input",e=>{
        let v=e.target.value.replace(/\D/g,"");  ///solo numeros
        //limitar a 16
        v=v.substring(0,16);

        //agregar espacios cada 4
        v=v.replace(/(.{4})/g,"$1 ").trim();

        e.target.value=v;

        verificarestadofinalizar();
    });
}

//login compra
document.getElementById("btnlogincompra")?.addEventListener("click",async()=>{
    const correo=document.getElementById("loginusercompra").value.trim();
    const pass=document.getElementById("loginpasscompra").value.trim();
    const error=document.getElementById("loginerrorcompra");

    if(!correo || !pass){
        error.textContent="Todos los campos son obligatorios";
        return;
    }

    try{
        const res=await fetch("http://localhost:3000/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({correo,pass})
        });

        const result=await res.json();

        if(result.success){
            sessionStorage.setItem("usuario", JSON.stringify(result.user));

            //actualziar
            if(typeof actualizarmenuusuario==="function"){
                actualizarmenuusuario();
            }

            //cerrar login interno
            document.getElementById("logincompra").classList.add("hide");

            //rellenardatos auto.
            document.getElementById("datosinvitado").classList.remove("hide");
            document.getElementById("seccionpagodistancia").classList.remove("hide");

            document.getElementById("invnombre").value=result.user.nombre || "";
            document.getElementById("invdireccion").value=result.user.direccion || "";
            document.getElementById("invtelefono").value=result.user.telefono || "";
        }else{
            error.textContent=result.message;
        }
    }catch(err){
        console.error(err);
        error.textContent="Error de conexión"
    }
});

// funcion reutilizable error
function mostrarerror(inputid, mensaje){
    const input=document.getElementById(inputid);
    const error=document.getElementById("error"+inputid.charAt(0).toUpperCase() + inputid.slice(1));

    if(input && error){
        input.classList.add("input-error");
        error.textContent=mensaje;
    }
}
function limpiarerror(inputid){
    const input=document.getElementById(inputid);
    const error=document.getElementById("error"+inputid.charAt(0).toUpperCase()+inputid.slice(1));

    if(input && error){
        input.classList.remove("input-error");
        error.textContent="";
    }
}

//opcion de compra presencial o distancia
function iniciarcomprapresencial(){
    procesarCheckout("presencial");
}

function iniciarcompradistancia(){
    procesarCheckout("distancia");
}

//validar nequi
function validarnequi(numero){
    const limpio=numero.replace(/\s/g,""); //limpiar espacios
    const regex=/^3\d{9}$/;
    return regex.test(limpio);
}

//validar tarjeta no bancaria real es solo visual
function validartarjeta(numero,cvv,fecha){
    numero=numero.replace(/\s/g,""); //limpiar espacios
    const regexnumero=/^\d{16}$/;  //solicita y verifica 16 digitos
    const regexcvv=/^\d{3}$/;  //solicita y verifica 3 digitos
    const regexfecha=/^(0[1-9]|1[0-2])\/\d{2}$/;  //solicita y verifica MM/AA
    
    if(!regexnumero.test(numero)) return false;
    if(!regexcvv.test(cvv)) return false;
    if(!regexfecha.test(fecha)) return false;

    // validar fecha vencimiento
    const [mes,an]=fecha.split("/");
    const fechaactual= new Date();
    const anactual=fechaactual.getFullYear()%100;
    const mesactual=fechaactual.getMonth() +1;

    const anint=parseInt(an);
    const mesint=parseInt(mes);

    if(anint< anactual) return false;
    if(anint===anactual && mesint<mesactual) return false;

    return true;
}

function procesarCheckout(tipo, metodo_pago){
    const usuario = typeof obtenerusuario === "function" 
    ? obtenerusuario(): null;

    if(tipo==="distancia" && !usuario){
        const nombre=document.getElementById("invnombre").value.trim();
        const direccion=document.getElementById("invdireccion").value.trim();
        const telefono=document.getElementById("invtelefono").value.trim();
        const regextelefono =/^3\d{9}$/;

        if(!nombre || !direccion || !regextelefono.test(telefono)){
            alert("Datos de entrega invalido. Verifique nombre, dirección y teléfono.");
            return;
        }
    }

    if(tipo=== "distancia"){
        tipo="domicilio";
    }
    
    const carrito =JSON.parse(localStorage.getItem("carrito")) || [];
    
    if(carrito.length === 0){
        alert("Carrito vacío");
        return;
    }
    const total = carrito.reduce(
        (acc,p) => acc + (p.precio*p.cantidad), 0
    );

    fetch("http://localhost:3000/checkout",{
        method:"POST",
        headers:{

            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            tipo,
            usuario: usuario ? usuario.id: null,
            carrito,
            total,
            metodo_pago,
            estado_pago: tipo ==="presencial"?"pendiente_confirmacion" : "pendiente_envio"
        })
    })
    .then(res =>{
        if(!res.ok) throw new Error("Respuesta servidor inválida");
        return res.json();
    })
    .then(data =>{
        if(data.success){
            document.getElementById("successModal").classList.remove("hide");
            document.getElementById("btncerrarsuccess").onclick=()=>{
                localStorage.removeItem("carrito");
                location.reload();
            };
        }else{
            alert("Error al procesar pedido");
        }
    })
    .catch(err=>{
        console.error(err);
        alert("Error de conexión");
    });
}

// mostrar resumen
function mostrarResumen(tipo){
    const carrito=JSON.parse(localStorage.getItem("carrito")) || [];
    const resumendiv=document.getElementById(
        tipo==="presencial"?"presencialresumen":"distanciaresumen"
    );
    const totalSpan=document.getElementById(
        tipo==="presencial"?"presencialtotal":"distanciatotal"
    );

    resumendiv.innerHTML="";
    let total=0;
    carrito.forEach(p=>{
        const item=document.createElement("div");
        item.textContent=`${p.nombre} x${p.cantidad} - $${(p.precio*p.cantidad).toLocaleString("es-CO")}`;
        resumendiv.appendChild(item);
        total+=p.precio*p.cantidad;
    });
    if(totalSpan){
        totalSpan.textContent="$"+total.toLocaleString("es-CO");
    }
}

//funcionpara limpiar
function limpiarformulariodistancia(){
    const ids=["invnombre","invdireccion","invtelefono","nequinumero","numtarjeta","cvv","fecha","titular"];

    ids.forEach(id=>{
        const campo=document.getElementById(id);
        if(campo)campo.value="";
    });

    //limpiar errores
    document.querySelectorAll(".input-error").forEach(i=>{
        i.classList.remove("input-error");
    });

    //reset radios
    document.querySelectorAll('input[name="pagodistancia"]').forEach(r=>{
        r.checked=false;
    });

    document.getElementById("seccionpagodistancia").classList.add("hide");
    document.getElementById("datosinvitado").classList.add("hide");

    document.getElementById("btnfinalizardistancia").disabled=true;
}

// funcion para resetear completo el checkout
function resetearCheckout(){
    const opciones=document.getElementById("opcionescompraonline");
    const login=document.getElementById("logincompra");
    const datosinvitado=document.getElementById("datosinvitado");
    const seccionpago=document.getElementById("seccionpagodistancia");

    const usuario=typeof obtenerusuario==="function"? obtenerusuario() : null;
    
    if(usuario){
        // usuario logueado
        if(opciones) opciones.classList.add("hide");
        if(datosinvitado) datosinvitado.classList.remove("hide");
        if(seccionpago) seccionpago.classList.remove("hide");
    }else{
        //invitado
        if(opciones) opciones.classList.remove("hide");
        if(datosinvitado) datosinvitado.classList.add("hide");
        if(seccionpago) seccionpago.classList.add("hide");
    }
    
    if(login) login.classList.add("hide");
    
    limpiarlogincompra();
    
}