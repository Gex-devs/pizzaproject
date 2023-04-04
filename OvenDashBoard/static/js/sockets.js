
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

socket.on('start_cooking', function (data) {
    startCooking();
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

