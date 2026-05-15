 document.addEventListener("DOMContentLoaded",()=>{

    //validacion segura
    const usuario=sessionStorage.getItem("usuario");
    
    if(!usuario){
        window.location.href="index.html";
        return;
    }

        ///Cerrar sesion
    document.getElementById("cerrarsesion").addEventListener("click",()=>{
        sessionStorage.clear();
        localStorage.clear();
        window.location.assign("index.html");
    });
 });   
    
    //admin - agregarproducto
async function agregarproducto() {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const stock = document.getElementById("stock").value;
    const categoria = document.getElementById("categoria").value;
    const imagenInput = document.getElementById("imagenproducto");
    const imagenArchivo = imagenInput.files[0];

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("stock", stock);
    formData.append("categoria_id", categoria);
    if (imagenArchivo) {
        formData.append("imagen", imagenArchivo);
    }

    const res = await fetch("/admin/producto", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    if (data.success) {
        alert("Producto Agregado");
        cargarproducto();
        document.getElementById("nombre").value = "";
        document.getElementById("precio").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("imagenproducto").value = "";
    } else {
        alert("Error al agregar producto");
    }
}

    //adim funcion agregar
    async function editarproducto(id) {
        const nombre=document.getElementById("nombre").value;
        const precio=document.getElementById("precio").value;
        const stock=document.getElementById("stock").value;
        const categoria=document.getElementById("categoria").value;

        const imagenInput=document.getElementById("imagenproducto");
        const imagenArchivo=imagenInput.files[0];

        const formData=new FormData();

        formData.append("nombre",nombre);
        formData.append("precio",precio);
        formData.append("stock",stock);
        formData.append("categoria_id",categoria);

        if(imagenArchivo){
            formData.append("imagen",imagenArchivo);
        }

        const res=await fetch(`/admin/producto/${id}`,{
            method:"PUT",
            body: formData
        });

        const data=await res.json();

        if(data.success){
            alert("Producto Actualizado");
            productoeditado=null;
            limpiarFormulario();
            cargarproducto();   
        }else{
            alert("Error al actualizar");
        }
    }

//funcion eliminarproducto - admin
    async function eliminarproducto(id) {
        if(!confirm("¿Eliminar producto?")) return;
            const res= await fetch(`/admin/producto/${id}`,{
            method:"DELETE"
        });
        const data=await res.json();

        if(data.success){
            alert("Producto Eliminado");
            cargarproducto();
        }
    }

 //ajustar stock - admins
    async function ajustarstock(id) {
        const stock=document.getElementById("stocknuevo").value;

        await fetch(`/admin/stock/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
            stock:stock
            })
        });
    }

////
// ver usuario - admin 
async function cargarproducto() {
    const res=await fetch("/admin/productos");
    const productos=await res.json();
    const tabla=document.getElementById("tablaproductos");

    tabla.innerHTML="";

    productos.forEach((p,i)=>{
        const fila=document.createElement("tr");

        fila.innerHTML=`
        <td>${i+1}</td>

        <td>
         <img src="${p.imagen}" width="50" style="object-fit: cover; border-radius: 5px;">         
        </td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${p.precio}</td>
        <td>${p.stock}</td>

        <td>
           <button onclick='cargareditar(
            ${p.id},
            ${JSON.stringify(p.nombre)},
            ${p.precio},
            ${p.stock},
            ${p.categoria_id}
            )'>Editar</button>
           <button onclick="eliminarproducto(${p.id})">Eliminar</button>
        </td>`;

        tabla.appendChild(fila);
    });
}

//funcion editar producto
function cargareditar(id,nombre,precio,stock,categoria){

    productoeditado=id;

    document.getElementById("nombre").value = nombre;
    document.getElementById("precio").value = precio;
    document.getElementById("stock").value = stock;
    document.getElementById("categoria").value = categoria; 

    //cambiar texto boton y mostrar cancelar
    document.getElementById("btn-guardar").innerText="Actualizar Producto";
    document.getElementById("btn-cancelar").style.display="inline-block";
    
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

//guardar producto editado
let productoeditado =null; //variable global
async function guardarproducto() {
    if(productoeditado){
        editarproducto(productoeditado);
    }else{
        agregarproducto();
    }
}

//limpiar formulario
function limpiarFormulario() {
    productoeditado = null;
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("imagenproducto").value = "";
    document.getElementById("categoria").value = "1";
    
    // UI: Revertir botón
    document.getElementById("btn-guardar").innerText = "Guardar Producto";
    document.getElementById("btn-cancelar").style.display = "none";
}

// cargar usuarios registrados
async function cargarusuarios() {
    const res=await fetch("/admin/usuarios");
    const usuarios=await res.json();
    const tabla= document.getElementById("tablausuarios");

    tabla.innerHTML="";

    usuarios.forEach((u,i)=>{
        const fila=document.createElement("tr");

        fila.innerHTML=`
        <td>${i + 1}</td>
        <td>${u.nombre}</td>
        <td>${u.apellido || ''}</td>
        <td>${u.correo}</td>
        <td>${u.direccion || ''}</td>
        <td>${u.telefono || ''}</td>
        
        <td>
            ${
                u.rol === "cliente"
                ? `<button onclick="eliminarusuario(${u.id})">Eliminar</button>`
                : `<button onclick='cargareditarusuario(
                ${u.id},
                ${JSON.stringify(u.nombre)},
                ${JSON.stringify(u.apellido)},
                ${JSON.stringify(u.correo)},
                ${JSON.stringify(u.telefono)},
                )'>Editar</button>`
            }
        </td>`;

        tabla.appendChild(fila);
    });
}
///eliminar usuarios
async function eliminarusuario(id) {
    if(!confirm("¿Eliminar usuario?")) return;

    const res=await fetch(`/admin/usuario/${id}`,{
        method:"DELETE"
    });

    const data=await res.json();
    if(data.success){
        alert("Usuario Eliminado");
        cargarusuarios();
    }else{
        alert("Error al eliminar usuario");
    }
    
}

/// editar usuario
function cargareditarusuario(id, nombre,apellido,correo,telefono,rol){
    document.getElementById("nombreusuario").value=nombre;
    document.getElementById("apellidousuario").value=apellido;
    document.getElementById("correousuario").value=correo;
    document.getElementById("telefonousuario").value=telefono;

    usuarioeditado =id;
    document.getElementById("btn-guardarusuario").innerText="Actualizar Usuario";
}

let usuarioeditado = null;
// guardar usuario
async function guardarusuario() {
    const nombre = document.getElementById("nombreusuario").value;
    const apellido = document.getElementById("apellidousuario").value;
    const correo = document.getElementById("correousuario").value;
    const telefono = document.getElementById("telefonousuario").value;

    const res=await fetch(`/admin/usuario/${usuarioeditado}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            nombre,apellido,correo,telefono,rol
        })
    });

    const data=await res.json();
    if(data.success){
        alert("Usuario actualizado");
        document.getElementById("nombreusuario").value="";
        document.getElementById("apellidousuario").value="";
        document.getElementById("correousuario").value="";
        document.getElementById("telefonousuario").value="";
              
        
        usuarioeditado=null;
        document.getElementById("btn-guardarusuario").innerText="Guardar Usuario";
        cargarusuarios();
    }else{
        alert("Error al actualizar usuario");
    }
}

// llenar autimaneticamente
document.addEventListener("DOMContentLoaded",()=>{
    cargarproducto();
    cargarusuarios();

    //cancelar edicion producto
    document.getElementById("btn-cancelar").addEventListener("click",()=>{
        limpiarFormulario();
    })
});