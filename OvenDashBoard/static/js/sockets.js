
var socket = io.connect('http://127.0.0.1:5050/');

socket.on('connect', function () {
    console.log('Connected!');
});

socket.on('update', function (value) {
    console.log("got it")
    let textvalue = document.createElement("p")
    textvalue.innerHTML = value
    document.getElementById("empty_list").appendChild(textvalue)
})

socket.on('start_cooking', function (data) {
    startCooking(data);
});


socket.on('done_cooking', function (data) {
    // Done cooking
});

socket.on('new_order', function (data) {
    console.log("hmm")
    appendOrder(data)
});

socket.on('StartOrder', function (data) {
    CurrentOrderUpdate(data)
});

socket.on('UpdateHistory', function (data) {
    updateHistory(data)
});


function ProcessOrder(buttonValue,status) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:5050/OrderProcces', true);
    // set the content-type header to inicate that we're sending plain text data
    xhr.setRequestHeader('Content-Type', 'text/plain');
    //var data = button.value;
    console.log(buttonValue)
    // send the POST request with the string data
    xhr.send(buttonValue+":"+status);
}