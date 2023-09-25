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
        success: function(response) {
            console.log(response);

            // Obtener el ID asignado por el servidor
            let productId = response.id;

            // Almacenar los detalles del producto en el almacenamiento local del navegador
            localStorage.setItem(productId, JSON.stringify(data));

            // Mostrar el producto en la lista
            displayProduct({id: productId, ...data}); // Aquí llamamos a displayProduct

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
        </li>
    `;
    $("#product-list").append(productHTML);

    // Generar QR con easy.qrcode.js
    var qrcode = new QRCode(document.getElementById(`qr-code-${productId}`), {
        text: JSON.stringify(product),
        width: 150,
        height: 150,
        logo: "emblema.jpg",
        colorDark : "#0000DD",
        logoBackgroundTransparent: false,
    });
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
        alert("Código detectado: " + result.codeResult.code);
    });
}

function getProducts(){
    $.ajax({
        dataType: 'json',
        url: "api/product/all",
        type: 'GET',
        contentType: 'application/json',
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

/*function generateQR(productId) {
    // Obtener los detalles del producto basados en el ID
    let productDetails = JSON.parse(localStorage.getItem(productId));

    var qrCode = new QRCode(document.getElementById("qrcode"), {
        text: JSON.stringify(productDetails), // Convertir a JSON para asegurar el formato
        width: 300,
        height: 300,
        colorDark : "#0000DD",
        logo: "emblema.jpg",
        logoBackgroundTransparent: false,
    });
}*/



function goToIndex() {
    window.location.href = "index.html";
}}



