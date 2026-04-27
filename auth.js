document.addEventListener("DOMContentLoaded",() =>{
    const btnregister = document.getElementById("btnregister");   
    const registererror =document.getElementById("registererror");

    if(btnregister){
    btnregister.addEventListener("click",async (e) =>{
        e.preventDefault(); 
        e.stopPropagation();

        const data = {
            nombre: document.getElementById("regnombre").value.trim(),
            apellido: document.getElementById("regapellido").value.trim(),
            correo: document.getElementById("regcorreo").value.trim(),
            direccion: document.getElementById("regdireccion").value.trim(),
            telefono: document.getElementById("regtelefono").value.trim(),
            pass: document.getElementById("regpass").value,
            pass2: document.getElementById("regpass2").value
        };

        //validacion rapida
        if(Object.values(data).some(v => v === "")){
            registererror.textContent = "Todos los campos son obligatorios";
            registererror.style.color = "red";

            //modalregister.classList.remove("hide");
            return;
        }

        try{
        const res = await fetch("http://localhost:3000/register", {
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(data)
        });

        const results =await res.json();
        registererror.textContent=results.message;
        registererror.style.color =results.success ? "green" : "red";
        if(results.success){
            
            //limpiar formulario
            document.querySelector("#formregister")?.reset();
        }
    }catch (err){
        console.error(err);
        registererror.textContent = "Error conexion servidor";
        registererror.style.color = "red";
    }
    });
    }

    /* -----------------login----------------*/
    const btnlogin = document.getElementById("btn-login");
    const loginerror = document.getElementById("loginerror");

    if(btnlogin){
        btnlogin.addEventListener("click",async (e) =>{
            e.preventDefault();
            
            const data = {
                correo:document.getElementById("loginUser").value.trim(),
                pass: document.getElementById("loginpass").value
            };

            if(!data.correo || !data.pass){
                loginerror.textContent="Todo campo obligatorio";
                loginerror.style.color="red";
                return;
            }

            try{
                const res = await fetch("http://localhost:3000/login", {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(data)
                });

                const result =await res.json();
                console.log(result);

                loginerror.textContent = result.message;
                loginerror.style.color = result.success ? "green" : "red";

                if(result.success){
                    sessionStorage.setItem("usuario", JSON.stringify(result.user));
                    if(result.user.rol_id===2){
                      window.location.href="panel-cajera.html";
                      return;
                    }
                    if(result.user.rol_id===3){
                      window.location.href="panel-administrador.html";
                      return;
                    }                    
                    actualizarmenuusuario();

                    document.querySelector("#loginDropdown")?.reset();

                    //cerrar de unos segundos
                    setTimeout(() => {
                        const modallogin=document.getElementById("loginDropdown");
                        if(modallogin){
                            modallogin.classList.add("hide");
                        }
                        loginerror.textContent="";
                    }, 900);

                    if(localStorage.getItem("comprapendiente")==="distancia"){
                        localStorage.removeItem("comprapendiente");

                        //volver a ejecutar logica distancia
                        const botondistancia=document.getElementById("btndistancia");
                        if(botondistancia){
                            botondistancia.click();
                        }
                    }

                    //mostrar nombre boton ingresar
                    const btningresar=document.getElementById("btningresar");
                    if(btningresar){
                        btningresar.textContent=result.user.nombre;
                    }

                    const usuarioguardado=sessionStorage.getItem("usuario");
                    if(usuarioguardado){
                        const usuario=JSON.parse(usuarioguardado);
                        const btningresar=document.getElementById("btningresar");
                        if(btningresar){
                            btningresar.textContent=usuario.nombre;
                        }
                    }


                }
            }catch (err){
                console.error(err);
                loginerror.textContent="Error de conexion servidor";
                loginerror.style.color="red";
            }
        });
    }

    const usuarioguardado=sessionStorage.getItem("usuario");
    
    if(usuarioguardado){
        const usuario=JSON.parse(usuarioguardado);
        const pagina=window.location.pathname;

        if(usuario.rol_id=== 2 && !pagina.includes("panel-cajera.html")){
            //alert("Bienvenida Cajero/a");
            window.location.href="panel-cajera.html";
        }

        if(usuario.rol_id===3 && !pagina.includes("panel-administrador.html")){
            //alert("Bienvenido Administrador");
            window.location.href="panel-administrador.html";
        }
    }

    // registro
    const openregister=document.getElementById("openregister");
    const formregister=document.getElementById("formregister");
    const modalregister=document.getElementById("modalOverlay");

    if(openregister){
        openregister.addEventListener("click",(e)=>{
            e.preventDefault();
            //e.stopPropagation();

            formregister.reset();
            registererror.textContent="";

            //formregister.classList.remove("hide");
            modalregister.classList.remove("hide");

            document.body.style.overflow="hidden";

            document.getElementById("loginDropdown")?.classList.add("hide");
        });
    }
    if(modalregister){
        modalregister.addEventListener("click",cerrarmodalregistro);
    }
    if(formregister){
        formregister.addEventListener("click",function(e){
            e.stopPropagation();
        });
    }
    if(formregister){
        formregister.addEventListener("submit",function(e){
            e.preventDefault();
        });
    }

    
    document.addEventListener("keydown", (e)=>{
        if(e.key==="Escape"){
            cerrarmodalregistro();
        }
    });

    function cerrarmodalregistro(){
        modalregister.classList.add("hide");

        document.body.style.overflow="";

            registererror.textContent="";
    }

    actualizarmenuusuario();

});

function obtenerusuario(){
    const u=sessionStorage.getItem("usuario");
    return u ? JSON.parse(u):null;
}

function cerrarsesion(){
    sessionStorage.removeItem("usuario");
    location.reload();
}

// funcion de menu usuario
function actualizarmenuusuario(){
    const usuario=obtenerusuario();
    const btningresar=document.getElementById("btningresar");
    const dropdown=document.getElementById("userDropdown");

    if(!btningresar || !dropdown) return;

    if(usuario){
        // mostrar nombre
        btningresar.textContent=usuario.nombre;

        // cambiar contenido dropdown
        dropdown.innerHTML=`
            <a id="cerrarsesion"> Cerrar Sesión</a>
        `;
        const btncerrar=document.getElementById("cerrarsesion");
        if(btncerrar){
            btncerrar.addEventListener("click",cerrarsesion);
        }

        //evento cerrar sesion
        document.getElementById("cerrarsesion").addEventListener("click",cerrarsesion);
    }else{
        //usuario no logueado
        btningresar.textContent="Ingresar";
    }
}