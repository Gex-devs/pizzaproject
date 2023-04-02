
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



function demo() {
    console.log("clicked")
    // Get the buttons
    const cancelButton = document.querySelector('.CurrentOrderFirstButton');
    const waitingButton = document.querySelector('.CurrentOrderSecondButton');

    cancelButton.classList.add('hide');
    waitingButton.classList.add('hide');

    createTimer("01");
    // Get the timer elements
    const timerMinutes = document.querySelector('.timer-minutes');
    const timerSeconds = document.querySelector('.timer-seconds');

    // Set the initial time
    let totalTime = 60; // 10 minutes in seconds
    let remainingTime = totalTime;


    // Update the timer every second
    const intervalId = setInterval(() => {
        // Calculate the remaining minutes and seconds
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        // Update the timer display
        timerMinutes.textContent = minutes < 10 ? `0${minutes}` : minutes;
        timerSeconds.textContent = seconds < 10 ? `0${seconds}` : seconds;

        // Stop the timer when it reaches zero
        if (remainingTime === 0) {
            clearInterval(intervalId);
            alert('Food is Ready'); // Should probably use Sweet Alert for this one
        } else {
            remainingTime--;
        }
    }, 1000);

}

function CurrentOrderUpdate(items) {
    // Get the container element where you want to add the order details
    const container = document.getElementById("currentOrder");

    // Remove last order first

    container.innerHTML = "";
    const time_log = document.createElement('time')
    time_log.classList.add('log_timer')
    time_log.innerHTML = "10:30"
 

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
            orderInsideContainer.style.animation = 'newItemAdded 0.8s ease-in-out';

            const orderText = document.createElement('p');
            orderText.textContent = item.Item_name;
            orderText.classList.add('EnhancerText');

            const orderNumber = document.createElement('p');
            orderNumber.textContent = "x" + item.AmountOfOrder;
            orderNumber.classList.add('EnhancerNumber');

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
    cancelButton.onclick=()=>{demo()}

    const waitingButton = document.createElement("p");
    waitingButton.classList.add("CurrentOrderSecondButton");
    waitingButton.textContent = "WAITING FOR OVEN";

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(waitingButton);

    container.append(time_log)
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
    orderButton.onclick=()=>{startOrder(orderButton)}

    orderItem.appendChild(insideOrders);
    orderItem.appendChild(orderButton);

    return orderItem;
}

function appendOrder(pendingOrder) {
    const orderItem = createOrderItem(pendingOrder);
    document.getElementById("order").appendChild(orderItem);
}


function createTimer(time) {
    // Create the elements
    const timerContainer = document.createElement('div');
    timerContainer.classList.add('timer-container');
    timerContainer.style.animation = 'newItemAdded 0.8s ease-in-out';

    const timerLabel = document.createElement('div');
    timerLabel.classList.add('timer-label');
    timerLabel.innerText = 'ETA';

    const timer = document.createElement('div');
    timer.classList.add('timer');

    const timerMinutes = document.createElement('div');
    timerMinutes.classList.add('timer-minutes');
    timerMinutes.innerText = time;

    const timerSeparator = document.createElement('div');
    timerSeparator.classList.add('timer-separator');
    timerSeparator.innerText = ':';

    const timerSeconds = document.createElement('div');
    timerSeconds.classList.add('timer-seconds');
    timerSeconds.innerText = '00';

    // Append the elements to the timer container
    timer.appendChild(timerMinutes);
    timer.appendChild(timerSeparator);
    timer.appendChild(timerSeconds);

    timerContainer.appendChild(timerLabel);
    timerContainer.appendChild(timer);

    // Add the timer container to the page
    const parentElement = document.getElementById("currentOrder");
    parentElement.appendChild(timerContainer);
 

}