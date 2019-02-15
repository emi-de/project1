$(function() {

const url = 'http://localhost:3000';
const $list = $('.order-list');
const $addItemButton = $('.add-item_button');


function createOrder() {

    $addItemButton.on('click', function(){

        let $newNumber  = $('#new-order_number');
        let $newPrice  = $('#new-order_price');
        let $newPayment = $('#new-order_payment');

        let newOrder = {
            number: $newNumber.val(),
            price: $newPrice.val(),
            payment: $newPayment.val(),
            products:""
        }

        $.ajax({
            url: url + '/orders',
            method: 'POST',
            data: newOrder,
            dataType: 'json'
        }).done(function(response) {
    
            location.reload();
        });
    });
};


function showOrders() {

        $.ajax({
            url: url + '/orders',
            method: 'GET'
        }).done(function(response) {
            
        
        for (let i = 0; i < response.length; i++) {
                
            let $newOrderItem  = $('<div class="order-item"></div>');
            $newOrderItem.attr('data-id', response[i].id);
            let $orderNumberBtn = $('<button class="order-number">' + response[i].number + '</button>');
            let $orderInfo = $('<div class="order-info"></div>');
            $orderInfo.append('<p class="order-price">' + response[i].price + '</p>');
            let $orderPayment = $('<p class="order-payment">' + response[i].payment + '</p>');
            $orderInfo.append($orderPayment);

            $orderInfo.append('<button class="order-rw">przygotowane</button>');
            $orderInfo.append('<button class="order-paid">opłacone</button>');
            $orderInfo.append('<button class="order-send">wysłane</button>');
            $orderInfo.append('<button class="order-edit">edytuj</button>');
            $orderInfo.append('<button class="order-delete">usuń</button>');
            $newOrderItem.append($orderNumberBtn);
            $newOrderItem.append($orderInfo);
            let $orderDetails = $('<div class="order-details"></div>');
            $newOrderItem.append($orderDetails);      
            let $createProduct = $('<div class="add-product_form"></div>');
            $createProduct.append('<input type="text" class="add-product_name">');
            $createProduct.append('<input type="text" class="add-product_price">');
            $createProduct.append('<button class="add-product_button">Dodaj</button>');
            $orderDetails.append($createProduct);
            $list.append($newOrderItem);
            $createProduct.hide();
            
        }

       
    });
};


const editItem = () => {

    $list.on('click', 'button.order-edit', function(){

        let $thisParent = $(this).parent();
        let $thisGrandparent = $(this).parents('.order-item');
        let $orderId = $thisGrandparent.data('id');

        $.ajax({
            url: url + '/orders' + "/" + $orderId,
            method: 'PATCH',
            dataType: 'json'
        }).done(function(response){
            $thisParent.find('.order-price').attr('contenteditable', 'true');
            $thisParent.find('.order-payment').attr('contenteditable', 'true');
            $thisParent.find('.order-edit').text('Zapisz').addClass('confirm');
        })
    });

    $list.on('click', 'button.confirm', function(){

        let $thisParent = $(this).parent();
        let $thisGparent = $(this).parents('.order-item'); 
        let $orderId = $thisGparent.data('id');

        let $editedPrice = $thisParent.find('.order-price');
        let $editedPayment = $thisParent.find('.order-payment');
        let $editedOrder = {
            price: $editedPrice.text(),
            payment: $editedPayment.text()
        }

        $.ajax({
            url: url + '/orders' + "/" + $orderId,
            method: 'PATCH',
            data: $editedOrder,
            dataType: 'json'
        }).done(function(response){
            $editedPrice.attr('contenteditable', 'false');
            $editedPayment.attr('contenteditable', 'false');
            $thisParent.find('.order-edit').text('Edytuj').removeClass('confirm');
        })
    });
};


const showDetails = () => {

    $list.on('click', 'button.order-number', function(){

        let $parent = $(this).parent();
        $parent.find('.add-product_form').show();
        $parent.find('.order-number').addClass('visible');
           
    });

    $list.on('click', 'button.visible', function(){

        let $parent = $(this).parent();
        $parent.find('.add-product_form').hide();
        $parent.find('.order-number').removeClass('visible');
        
    });
};

const addProduct = () => {


    $list.on('click', 'button.add-product_button', function(){

        let $this = $(this);
        let $newProductName = $this.parent().find('.add-product_name');
        let $newProductPrice = $this.parent().find('.add-product_price');
        let $orderId = $this.parents('.order-item').data('id');

        let newProduct = {
            products: {
            productName: $newProductName.val(),
            productPrice: $newProductPrice.val()
            }
        }

        $.ajax({
            url: url + '/orders' + '/' + $orderId, 
            method: 'PATCH',
            data: JSON.stringify(newProduct),
            dataType: 'JSON'
        }).done(function(response){
 
        })

    });
};


createOrder();
showOrders();
showDetails();
editItem();
addProduct();

});











