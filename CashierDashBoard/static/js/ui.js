
Ui_Tax = document.getElementById("TaxCal")
Ui_Subtotal = document.getElementById("SubTotal")
Ui_CartTotal = document.getElementById("TotalCalc")
Added_orders = document.getElementById("buckets")

let cartTotal = 0;
let Subtotal = 0;
let TaxTotal = 0;

function UpdateOrderBucket(Data) {
    let buckets = document.getElementById("buckets")
    let image = document.createElement("img")
    image.src = Data.icon

    let bucketContainer = document.createElement("div")
    bucketContainer.classList.add("InsideItems")
    bucketContainer.dataset.value = Data._id


    let InsideContainer = document.createElement("div")
    InsideContainer.classList.add("InsideItemsClassifiedr")
    let itemName = document.createElement("p")
    itemName.style.color = "white";
    itemName.classList.add("itemName")
    itemName.innerHTML = Data.name

    let AmountOfItem = document.createElement("p")
    AmountOfItem.style.color = "#898686";
    AmountOfItem.classList.add("amountInInt")
    AmountOfItem.innerHTML = "x" + Data.TotalAmount


    let price = document.createElement("p")
    price.classList.add("InsideItemsprice")
    price.style.color = "#898686";
    price.innerHTML = Data.TotalPrice + "$"

    InsideContainer.appendChild(itemName)
    InsideContainer.appendChild(AmountOfItem)


    bucketContainer.appendChild(image)
    bucketContainer.appendChild(InsideContainer)
    bucketContainer.appendChild(price)

    buckets.appendChild(bucketContainer)

    updateTotal(Data);
}

function updateTotal(Data) {
    
    Subtotal = Subtotal + Data.TotalPrice
    TaxTotal = Subtotal * 0.21 
    cartTotal = Subtotal + TaxTotal

    Ui_Tax.innerHTML = "$"+TaxTotal.toFixed(2)
    Ui_Subtotal.innerHTML = "$"+Subtotal.toFixed(2)
    Ui_CartTotal.innerHTML = "$"+cartTotal.toFixed(2)
}


// Reset The Cashier UI 
function resetUi() {
    cartTotal = 0;
    Subtotal = 0;
    TaxTotal = 0;

    Ui_Tax.innerHTML = "$"
    Ui_Subtotal.innerHTML = "$"
    Ui_CartTotal.innerHTML = "$"

    Added_orders.innerHTML = ""

}

// Add Feature if I have time
/*
var swipeableItems = document.querySelectorAll('[data-hammer]');

Array.prototype.forEach.call(swipeableItems, function (item) {
    var hammer = new Hammer(item);

    hammer.on('swipeleft', function () {
        item.classList.add('swipe-left');
        item.style.display = "none";

    });

    hammer.on('swiperight', function () {
        item.classList.add('swipe-right');
        // Send AJAX request to delete the item from the server
    });

    hammer.on('panend', function () {
        item.classList.remove('swipe-left', 'swipe-right');
    });
});

*/
