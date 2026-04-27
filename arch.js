document.addEventListener("DOMContentLoaded", () => {

    const frasesBienvenida = [
        "¿Qué se te antoja disfrutar hoy?",
        "Elige tu sabor del día",
        "¿Con qué quieres consentirte ahora?",
        "Tu antojo, a un clic de distancia",
        "Haz que tu día sepa mejor",
        "Descubre lo que hará feliz tu paladar",
        "Sabores listos para ti", 
        "¿Qué delicia quieres probar hoy?"
    ];

    const frasesCategorias = [
        "Haz que tu día sepa mejor",
        "Descubre lo que hará feliz tu paladar",
        "Sabores listos para ti", 
        "¿Qué delicia quieres probar hoy?",
        "¿Qué se te antoja disfrutar hoy?",
        "Elige tu sabor del día",
        "¿Con qué quieres consentirte ahora?",
        "Tu antojo, a un clic de distancia",
    ];

    const btn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");
    const header = document.querySelector(".header");

    // =====  Control de Frases de bienvenida =====
    if(btn){
        function fraseBienvenida(){
            btn.style.transition = "opacity 0.5s";
            btn.style.opacity= 0;
            setTimeout(()=>{
                const index = Math.floor(Math.random() * frasesBienvenida.length);
                btn.textContent = frasesBienvenida[index];
                btn.style.opacity = 1;
            }, 500);
        }
        fraseBienvenida();
        setInterval(fraseBienvenida, 3000);
    }
    
    // =====  entrar y Control de Frases en categorias =====
    btn?.addEventListener("click", () =>{
        header.classList.add("hide");   //oculta bienvenida
        menu.classList.remove("hide");  // muestra mennu
        iniciarFrasesCategorias();      //activa frases del menu
    });

    // ===== control o Función para iniciar frases de categorías =====
    let intervalocatergorias =null
    function iniciarFrasesCategorias(){
        const fraseDiv = document.getElementById("frase");
        if(!fraseDiv || intervalocatergorias) return; // si no existe, no hacer nada

        fraseDiv.style.transition = "opacity 0.5s";

        function cambiarFrase(){
            fraseDiv.style.opacity = 0;
            setTimeout(()=>{
                const index = Math.floor(Math.random() * frasesCategorias.length);
                fraseDiv.textContent = frasesCategorias[index];
                fraseDiv.style.opacity = 1;
            }, 500);
        }

        cambiarFrase(); // primera frase
        intervalocatergorias=setInterval(cambiarFrase, 3000);
    }
//------------------------------------------------------------------------------------------

    //mostrar login/registro
    const openlogin =document.getElementById("openlogin");
    const openRegister =document.getElementById("openRegister");
    const loginBox =document.getElementById("loginDropdown");
    const registerBox =document.getElementById("registerDropdown");
    const modalOverlay =document.getElementById("modalOverlay");
    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = document.querySelector(".dropdown-content");
    const btningresar = document.getElementById("btningresar");
    const cart = document.getElementById("cartDropdown");
    const btncarrito =document.getElementById("btncarrito");
    const btnregister = document.getElementById("btnregister");
    const registererror = document.getElementById ("registererror");
    const btnlogin = document.getElementById("btn-login");

    //funcion cerrar todo
    function cerrartodo(){
        dropdownContent?.classList.remove("show");
        loginBox?.classList.add("hide");
        loginBox?.classList.remove("show");
        registerBox?.classList.add("hide");
        registerBox?.classList.remove("show");
        modalOverlay?.classList.add("hide");
        modalOverlay?.classList.remove("show");
        cart?.classList.remove("show");
    }

    //===========botones
    btningresar?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const abierto = dropdownContent.classList.contains("show");
        cerrartodo();

        if(!abierto){
            dropdownContent.classList.add("show");
        }
    });

    btncarrito?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if(cart.classList.contains("show")){
            cart.classList.remove("show");
        }else{
            cerrartodo();
            cart.classList.add("show");
            if(window.mostrarcarrito){
                window.mostrarcarrito();  //actualiza contenido
            }
        }
    });

    openlogin?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        cerrartodo();
        loginBox.classList.remove("hide");
        loginBox.classList.add("show");
    });

    openRegister?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        cerrartodo();
        registerBox.classList.remove("hide");
        registerBox.classList.add("show");
        modalOverlay.classList.add("show");
    });

    // clic fuera
    document.addEventListener("click", () =>{
        cerrartodo();
    });
    [dropdown, dropdownContent,loginBox, registerBox, cart, btncarrito].forEach(el =>{
        el?.addEventListener("click", e =>e.stopPropagation());
    });
    
    // para conectar SQL
    btnregister?.addEventListener("click", (e) =>{
        e.preventDefault();
        registererror.style.color="green";
        registererror.textContent="Registro Complero";
        setTimeout(() => {
            cerrartodo();
            loginBox.classList.add("show");
        },1500);
    });
});

