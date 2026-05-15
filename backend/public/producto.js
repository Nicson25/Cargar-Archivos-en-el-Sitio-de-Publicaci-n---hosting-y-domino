//seleccionar categoria
const categoria=document.querySelectorAll(".producto");

//secciones
const seccioncategoria = document.getElementById("categoria");
const seccionproducto = document.getElementById("seccionproductos");
const listaproducto = document.getElementById("listaproductos");
const titulocategoria = document.getElementById("titulocategoria");
const btnvolver = document.getElementById("btnvolver");

// click en categoria
categoria.forEach(cat =>{
    cat.addEventListener("click", ()=>{
        const categoriaId = cat.dataset.id;
        const nombre = cat.querySelector("h3").textContent;

        titulocategoria.textContent=nombre;
        seccioncategoria.classList.add("hide");
        seccionproducto.classList.remove("hide");
        
        cargarproducto(categoriaId);
    });
});

//volver
btnvolver.addEventListener("click", () =>{
    seccionproducto.classList.add("hide");
    seccioncategoria.classList.remove("hide");
    listaproducto.innerHTML="";
});

//cargar productos desde backend
function cargarproducto(categoriaId){
    console.log("Cargando producto de categoria:",categoriaId);

    fetch(`/producto/categoria/${categoriaId}`)
    .then(res=>res.json())
    .then(data=>{
        console.log("Productos recibidos:", data);
        mostrarproducto(data);
    })
    .catch(err=>console.error(err));
}

// mostrar productos
function mostrarproducto(producto){
    listaproducto.innerHTML="";

    producto.forEach(p=>{
        const div=document.createElement("div");
        div.classList.add("producto");
        
        // enlace para imagenes de productos
        div.innerHTML=`
        <img src="/${p.imagen}" alt="${p.nombre}"> 
        <p>$${p.imagen}</p>
        <h4>${p.nombre}</h4>
        <p>$${p.precio}</p>
        <div class="contador">
            <button onclick="cambiarcantidad(${p.id},-1)">-</button>
            <input type="text" inputmode="numeric" id="cant-${p.id}" value="1" min="1">
            <button onclick="cambiarcantidad(${p.id},1)">+</button>
        </div>
        <button class="btn btn-primary" 
        onclick="agregarproducto(${p.id}, '${p.nombre}', ${p.precio})">
            Agregar
        </button>`;

        listaproducto.appendChild(div);        
    });
}

// agregar al carrito
function agregarproducto(id, nombre, precio){
    const cantidad =document.getElementById(`cant-${id}`).value;
    agregaralcarrito(id, nombre, precio, parseInt(cantidad));
}

//cambiar cantidad para agregar
function cambiarcantidad(id, cambio){
    const input=document.getElementById(`cant-${id}`);
    let valor =parseInt(input.value);

    valor +=cambio;
    if(valor<1){
        valor=1;
    }

    input.value=valor;
}
