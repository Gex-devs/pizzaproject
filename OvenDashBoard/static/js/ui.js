function cancelOrder() {
    swal({
        title: "Are you sure?",
        text: "Once Canceled, you will not be able to recover this Order",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                const orderItem = CurrentOrderButton.closest('.OrderItem');
                orderItem.remove();
                swal("Poof! Order is Gone!", {
                    icon: "success",
                });
            }
        });
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


function updateHistory(item) {
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

    const MainContainer = document.getElementById("historyorder")
    MainContainer.appendChild(orderItem)
}