const categoria= document.getElementById("categoria");
fetch("/categoria")
.then(res =>res.json())
.then(data=>{
    data.forEach(cat =>{
        const btn=document.createElement("button");
        btn.textContent=cat.nombre;
        btn.onclick= () =>cargarproductos(cat.id);
        contenedorcategorias.appendChild(btn);
    });
})
.catch(err=>console.error(err));