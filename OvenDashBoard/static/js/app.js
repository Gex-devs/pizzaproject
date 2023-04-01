
var socket = io.connect('http://192.168.1.19:5000/');

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

socket.on('StartOrder', function (data) {
    CurrentOrderUpdate(data)
});



function CurrentOrderUpdate(items) {
    // Get the container element where you want to add the order details
    const container = document.getElementById("currentOrder");

    // Remove last order first

    container.innerHTML = "";

    const insideOrders = document.createElement('div');
    insideOrders.classList.add('CurrentOrderInside');
    
    let order_obj = JSON.parse(items);
    // Get the order ID
    var order_id = order_obj.Order_id;
    // Get the order items dictionary
    var order_items = order_obj.OrderItems;


    // Loop through the OrderItems object and create the HTML elements for each item
    for (var item_key in order_items) {
      if (order_items.hasOwnProperty(item_key)) {
        var item = order_items[item_key];

            const orderInsideContainer = document.createElement('div');
            orderInsideContainer.classList.add('OrderInsideCurrentOrder');

            const orderText = document.createElement('p');
            orderText.textContent = item.Item_name;

            const orderNumber = document.createElement('p');
            orderNumber.textContent = "x" + item.AmountOfOrder;

            orderInsideContainer.appendChild(orderText);
            orderInsideContainer.appendChild(orderNumber);

            insideOrders.appendChild(orderInsideContainer);
      }
    }
  
    // Add the cancel and waiting buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("CurrentOrderButtons");
  
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("CurrentOrderFirstButton");
    cancelButton.textContent = "CANCEL ORDER";
    cancelButton.value = order_id;
  
    const waitingButton = document.createElement("button");
    waitingButton.classList.add("CurrentOrderSecondButton");
    waitingButton.textContent = "WAITING FOR OVEN";
  
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(waitingButton);
    
    container.append(insideOrders);
    container.appendChild(buttonContainer);
  }
  

function startOrder(button) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://192.168.1.19:5000/StartOrder', true);
    // set the content-type header to indicate that we're sending plain text data
    xhr.setRequestHeader('Content-Type', 'text/plain');
    //var data = button.value;
    var data = button.value;
    console.log(data)
    // send the POST request with the string data
    xhr.send(data);

}

function createOrderItem(items) {
    const orderItem = document.createElement('div');
    orderItem.classList.add('OrderItem');
    orderItem.style.animation = 'newItemAdded 0.3s ease-in-out';

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

            const orderText = document.createElement('p');
            orderText.classList.add('OrderText');
            orderText.textContent = item.Item_name;

            const orderNumber = document.createElement('p');
            orderNumber.classList.add('OrderNumber');
            orderNumber.textContent = "x" + item.AmountOfOrder;

            orderInsideContainer.appendChild(orderText);
            orderInsideContainer.appendChild(orderNumber);

            insideOrders.appendChild(orderInsideContainer);
        }
    }

    const orderButton = document.createElement('button');
    orderButton.classList.add('OrderButton');
    orderButton.value = order_id
    orderButton.textContent = 'START ORDER';
    orderButton.onclick = () => { startOrder(orderButton) }

    orderItem.appendChild(insideOrders);
    orderItem.appendChild(orderButton);

    return orderItem;
}

function appendOrder(pendingOrder) {
    const orderItem = createOrderItem(pendingOrder);
    document.getElementById("order").appendChild(orderItem);
}


