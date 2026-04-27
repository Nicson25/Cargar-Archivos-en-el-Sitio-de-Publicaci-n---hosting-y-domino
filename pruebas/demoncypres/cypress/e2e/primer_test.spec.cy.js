///<referece types="cypress"/>

describe('pruebas proyecto cafeteria - maison sabor',()=>{
    // inicio
    beforeEach(()=>{
        cy.visit('http://127.0.0.1:5500/index.html');
    });

    //pagina principal
    describe('cargar de la pagina',()=>{
        it('debe mostrar el titulo principal',()=>{
            cy.contains('¡Maison Sabor!').should('exist');
        });

    });

    //mostrar menu
    describe('menu principal',()=>{
        it('debe mostrar el menu al hacer click',()=>{
            cy.get('#menuBtn').click();
            cy.get('#menu').should('not.have.class','hide');
        });
    });

    //login
    describe('autenticacion',()=>{
        it('debe abrir opciones de ingreso',()=>{
            cy.get('#menuBtn').click();
            cy.get('#btningresar').click();
            cy.get('#userDropdown').should('be.visible');
        });
        it('debe abrir formulario login',()=>{
            cy.get('#menuBtn').click();
            cy.get('#btningresar').click();
            cy.get('#openlogin').click();
            cy.get('#loginDropdown').should('not.have.class','hide');
        });
        it('debe intentar login',()=>{
            cy.get('#menuBtn').click();
            cy.get('#btningresar').click();
            cy.get('#openlogin').click();           
        });
    });

    //registro
    describe('registro de usuario',()=>{
        it('debe abrir formulario registro',()=>{
            cy.get('#menuBtn').click();
            cy.get('#btningresar').click();
            cy.get('#openregister').click();
            cy.get('#modalOverlay').should('not.have.class','hide');
        });
    });

    //categoria
    describe('categoria del menu',()=>{
        it('debe mostrar categoria',()=>{
            cy.get('#menuBtn').click();
            cy.get('#menu').should('not.have.class','hide');
        });
        it('debe seleccionar categoria',()=>{
            cy.get('#menuBtn').click();
            cy.get('.producto').first().click();
        });
    });

    //carrito
    describe('carrito de compras',()=>{
        it('debe abrir carrito',()=>{
            cy.get('#menuBtn').click();
            cy.get('#btncarrito').click();
            cy.get('#cartDropdown').should('not.have.class','hide');
        });
    });

    //proceso de compra y finalizar forma invitado y efectivo
    describe('proceso de compra',()=>{
        it('debe abrir opcion seguir compra',()=>{
            cy.get('#menuBtn').click();
            cy.get('.producto').first().click();
            cy.get('#seccionproductos').should('not.have.class','hide'); 
            cy.contains('Agregar').click(); 
            //abrir acrrito
            cy.get('#btncarrito').click();
            //iniciar compra
            cy.get('#btnCheckout').click();
            //elegir tipo compra
            cy.get('#btndistancia').click();
            //validar
            cy.get('#distanciaModal').should('not.have.class', 'hide');
            //se elige en esta prueba invitado
            cy.get('#btncontinvitado').click();
            //datos del invitado
            cy.get('#invnombre').type('Rocio');
            cy.get('#invdireccion').type('calle 13 4 5');
            cy.get('#invtelefono').type('3214569874');
            //forzar visibilidad
            cy.get('#seccionpagodistancia').invoke('removeClass', 'hide');
            // seleccionar pago
            cy.get('input[value="efectivo"]').check({ force: true });
            // finalizar
            cy.get('#btnfinalizardistancia').click();
            cy.get('#successModal').should('not.have.class', 'hide');
        });
    });
});
