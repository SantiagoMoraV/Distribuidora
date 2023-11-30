$("document").ready(function(){
    getProducts();
    initQRScanner();
});

function saveProduct(){
    let nombre=$("#product-name").val();
    let desc=$("#product-desc").val();
    let price=$("#product-price").val();

    let data={
        name: nombre,
        description: desc,
        price: price
    };

    $.ajax({
        dataType: 'json',
        data: JSON.stringify(data),
        url: "api/product/save",
        type: 'POST',
        contentType: 'application/json',
        headers:{
            "Authorization": "Bearer "+ Cookies.get('token')
        },
        success: function(response) {
            console.log(response);

            // Obtener el ID asignado por el servidor
            let productId = response.id;

            // Almacenar los detalles del producto en el almacenamiento local del navegador
            localStorage.setItem(productId.toString(), JSON.stringify(data));

            // Mostrar el producto en la lista
            displayProduct(productId, data, "#product-list"); // Aquí llamamos a displayProduct

            // Actualizar la lista de IDs de productos agregados
            let addedProductIds = localStorage.getItem('addedProductIds');
            addedProductIds = addedProductIds ? JSON.parse(addedProductIds) : [];
            addedProductIds.push(productId.toString());
            localStorage.setItem('addedProductIds', JSON.stringify(addedProductIds));

            $("#product-name").val("");
            $("#product-desc").val("");
            $("#product-price").val("");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handle errors if necessary
        }
    });
}
function displayProduct(productId, product) {
    // Verificar si el producto ya ha sido mostrado
    if ($(`#product-${productId}`).length > 0) {
        return;
    }
    let productHTML = `
        <li>
          <div class="product-details">
            <strong>${product.name}</strong><br>
            Descripción: ${product.description}<br>
            Precio: $${product.price}
          </div>
          <div class="product-qr">
            <div id="qr-code-${productId}"></div>
          </div>
          <div class="product-image">
            <img src="/imagenes/imagen${productId}.jpg" alt="${product.name}">
          </div>
        </li>
    `;

    // Generar QR con easy.qrcode.js después de asegurarse de que el elemento DOM esté presente
    $(document).ready(function() {
        var qrcode = new QRCode(document.getElementById(`qr-code-${productId}`), {
            text: JSON.stringify(product),
            width: 150,
            height: 150,
            logo: "emblema.jpg",
            colorDark : "#0000DD",
            logoBackgroundTransparent: false,
        });
    });

    $("#product-list").append(productHTML);
}

function loadStoredProducts() {
    // Obtener la lista de IDs de productos agregados por el usuario
    let addedProductIds = localStorage.getItem('addedProductIds');

    if (addedProductIds) {
        addedProductIds = JSON.parse(addedProductIds);

        // Filtrar productos almacenados localmente por los IDs agregados
        addedProductIds.forEach(productId => {
            let productData = JSON.parse(localStorage.getItem(productId));
            if (productData) {
                displayProduct(productId, productData);
            }
        });
    }
}

function initQRScanner() {
    // Configuración de Quagga
    // (Debes asegurarte de que la biblioteca QuaggaJS esté incluida en tu proyecto)
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'),
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader", "2of5_reader", "code_93_reader"],
        },
    });

    Quagga.start();

    Quagga.onDetected(function(result) {
        let qrCodeData = result.codeResult.code;
        saveQRCodeData(qrCodeData);
        alert("Código detectado: " + result.codeResult.code);

    });
}

function saveQRCodeData(qrCodeData) {
    // Enviar el código QR detectado al servidor para guardarlo en la base de datos
    let data = {
        content: qrCodeData
    };

    $.ajax({
        dataType: 'json',
        data: JSON.stringify(data),
        url: "api/qr/save",
        type: 'POST',
        contentType: 'application/json',
        headers:{
            "Authorization": "Bearer "+ Cookies.get('token')
        },
        success: function(response) {
            console.log("Código QR guardado exitosamente en la base de datos.");
            window.location.href = "leerqr.html";
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error al guardar el código QR en la base de datos.");
        }
    });
}

function getProducts(){
    $.ajax({
        dataType: 'json',
        url: "api/product/all",
        type: 'GET',
        contentType: 'application/json',
        headers:{
           "Authorization": "Bearer "+ Cookies.get('token')
        },
        success: function(response) {
            console.log(response);
            let m="";
            for(let i=0; i<response.length; i++){
                m += response[i].id + ") " + response[i].name + "     " + response[i].description + "  $" + response[i].price + "<br>";
            }
            $("#resultados").html(m);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handle errors if necessary
        }
    });
}
function loginData() {
    let email = $("#username").val();
    let password = $("#password").val();

    let data = {
        email: email,
        password: password
    }

    $.ajax({
        url: "/api/v1/auth/authenticate",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (rta) {
            $("#username").val("");
            $("#password").val("");
            Cookies.set('token', rta['token']);
            window.location.replace("index.html");
        },
        error: function (xhr, status) {
            document.getElementById("errorMessage").style.display = "block";
            return;
        },
        complete: function (xhr, status) {
            // La petición ha finalizado
        }
    });
}


 function logOut(){
	Cookies.remove('token');
	window.location.replace("login.html");
 }
 function registerData(){

	 let firstname = $("#firstname").val();
	 let lastname = $("#lastname").val();
	 let email = $("#email").val();
	 let password = $("#password").val();

	 let data = {
		 firstname: firstname,
		 lastname: lastname,
		 email: email,
		 password: password
	 }

	 $.ajax({

		 url:"/api/v1/auth/register",
		 type:"POST",
		 contentType:"application/json",
		 dataType:"json",

		 data:JSON.stringify(data),

		 success: function(rta) {
			 Cookies.set("token",rta['token']);
			 window.location.replace("index.html");
		 },
		 error: function(xhr, status) {
			 alert('Disculpe, existió un problema');
		 },
		 complete: function(xhr, status) {
			 //alert('Petición realizada');
		 }

	 });
 }