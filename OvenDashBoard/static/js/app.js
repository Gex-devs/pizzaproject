
var socket = io.connect('http://127.0.0.1:5000/');

socket.on('connect', function () {
    console.log('Connected!');
});

socket.on('update', function (value) {
    console.log("got it")
    let textvalue = document.createElement("p")
    textvalue.innerHTML = value
    document.getElementById("empty_list").appendChild(textvalue)
})


socket.on('new_order', function (data) {
    appendOrder(data)
});


function createOrderItem(items) {
    const orderItem = document.createElement('div');
    orderItem.classList.add('OrderItem');

    const insideOrders = document.createElement('div');
    insideOrders.classList.add('InsideOrders');

    let order_obj = JSON.parse(items);
    // Get the order ID
    var order_id = order_obj.Order_id;
    // Get the order items dictionary
    var order_items = order_obj.OrderItems;
    



    for (var item_key in order_items) {
       
        if (order_items.hasOwnProperty(item_key)) {
            
            var item = order_items[item_key];

            const orderInsideContainer = document.createElement('div');
            orderInsideContainer.classList.add('OrderInsideContainer');

            const orderText = document.createElement('div');
            orderText.classList.add('OrderText');
            orderText.textContent = item.Item_name;

            const orderNumber = document.createElement('div');
            orderNumber.classList.add('OrderNumber');
            orderNumber.textContent = "x" + item.AmountOfOrder;

            orderInsideContainer.appendChild(orderText);
            orderInsideContainer.appendChild(orderNumber);

            insideOrders.appendChild(orderInsideContainer);
        }
    }

    const orderButton = document.createElement('button');
    orderButton.classList.add('OrderButton');
    orderButton.textContent = 'READY';

    orderItem.appendChild(insideOrders);
    orderItem.appendChild(orderButton);

    return orderItem;
}

function appendOrder(pendingOrder) {
    const orderItem = createOrderItem(pendingOrder);
    document.getElementById("order").appendChild(orderItem);
}



