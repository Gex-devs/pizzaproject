

function startCooking(ETA) {
    console.log("clicked")
    // Get the buttons
    try {
        const cancelButton = document.querySelector('.CurrentOrderFirstButton');
        const waitingButton = document.querySelector('.CurrentOrderSecondButton');

        cancelButton.classList.add('hide');
        waitingButton.classList.add('hide');
    } catch (error) {
        console.log("Buttons not found")
    }


    createTimer("01");
    // Get the timer elements
    const timerMinutes = document.querySelector('.timer-minutes');
    const timerSeconds = document.querySelector('.timer-seconds');

    // Set the initial time
    let totalTime = ETA; // 1 minutes in seconds
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
            ProcessOrder(CurrentOrderButton.value,true)
            const orderItem = CurrentOrderButton.closest('.OrderItem');
            orderItem.remove();
            document.getElementById("currentOrder").innerHTML=""
            Swal.fire({
                icon: 'success',
                title: 'Order is Ready',
                showConfirmButton: false,
                timer: 1500
            })
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
    // Convert Log time into minutes 
    


    const insideOrders = document.createElement('div');
    insideOrders.classList.add('CurrentOrderInside');

    let order_obj = JSON.parse(items);
    // Get the order ID
    var order_id = order_obj.Order_id;
    // Get the order items dictionary
    var order_items = order_obj.OrderItems;

    var log_time = order_obj.logTime;

    // Set log time, fix time and date to get minute
    //time_log.innerHTML = log_time

    time_log.innerHTML = "10:30"

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
    cancelButton.onclick=()=>{cancelOrder(cancelButton.value)}

    const waitingButton = document.createElement("p");
    waitingButton.classList.add("CurrentOrderSecondButton");
    waitingButton.textContent = "WAITING FOR OVEN";

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(waitingButton);

    container.append(time_log)
    container.append(insideOrders);
    container.appendChild(buttonContainer);
}

let CurrentOrderButton;

function startOrder(button) {
    CurrentOrderButton = button
    if(document.getElementById("currentOrder").innerHTML !== ""){
        swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Order is Already in progress',
            footer: '<a href="">Why do I have this issue?</a>'
        })
    }else{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:5050/StartOrder', true);
    // set the content-type header to indicate that we're sending plain text data
        xhr.setRequestHeader('Content-Type', 'text/plain');
    //var data = button.value;
        var data = button.value;
        console.log(data)
    // send the POST request with the string data
        xhr.send(data);
        button.style.backgroundColor = 'red';
    }
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

    const timeLog = document.createElement("time")
    timeLog.innerHTML = "10:29"

    orderItem.appendChild(timeLog);
    orderItem.appendChild(insideOrders);
    orderItem.appendChild(orderButton);

    return orderItem;
}

function appendOrder(pendingOrder) {
    const orderItem = createOrderItem(pendingOrder);
    try {
        document.getElementById("order").appendChild(orderItem);
    } catch (error) {
        console.log("Updated Order but not In Order Page")
    }
    
}



