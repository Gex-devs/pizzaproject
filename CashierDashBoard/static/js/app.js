
async function addToBucket(button) {
    let inputValue;
    const { value: ipAddress } = await Swal.fire({
        title: 'Please Specify amount',
        input: 'text',
        inputLabel: 'Amount in Numbers',
        inputClass: 'text-center',
        inputValue: inputValue,
        showCancelButton: true,
        inputAttributes: {
            style: 'width: 80px;postion:relative;margin-left:40%',
        },
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            } else {
                inputValue = value
            }
        }
    })
    console.log(inputValue)
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:5000/addToBucket', true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    var data = button.value + ":" + inputValue;
    xhr.send(data);
}


function addOrder() {

}
function sendOrder() {
    Swal.fire({
        title: 'Did you add all orders?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {
            const insideItems = document.querySelectorAll('.InsideItems');
            const orderItems = {};
            let counter = 1;

            insideItems.forEach((item) => {
                const itemValue = item.getAttribute('data-value');
                const pElements = item.querySelectorAll('p');
                const name = pElements[0].textContent;
                const quantity = pElements[1].textContent;
                const price = item.querySelector('.InsideItemsprice').textContent;

                const itemId = { "$oid": itemValue };
                const itemData = { Item_id: itemId, Name: name, AmountOfOrder: parseInt(quantity.slice(1)) };

                const itemName = "Item" + counter;
                orderItems[itemName] = itemData;
                counter++;
            });

            const jsonData = { OrderItems: orderItems };
            console.log(JSON.stringify(jsonData, null, 2));
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://127.0.0.1:5000/pendOrder', true);
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.send(JSON.stringify(jsonData, null, 2));
            resetUi()
        }
    })
}