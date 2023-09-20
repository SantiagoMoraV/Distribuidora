$("document").ready(function(){
    getProducts();
    initQRScanner();
});

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
            $("#product-name").val("");
            $("#product-desc").val("");
            $("#product-price").val("");
            getProducts();
            generateQR(response.id); // Generar QR después de guardar el producto
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handle errors if necessary
        }
    });
}

function generateQR(productId) {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: productId, // El texto del QR es el ID del producto
        width: 300,
        height: 300,
        colorDark : "#0000DD",
        logo: "emblema.jpg",
        logoBackgroundTransparent: false,
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

function goToIndex() {
    window.location.href = "index.html";
}
