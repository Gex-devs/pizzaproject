
// var socket = io.connect('http://127.0.0.1:5000/');

// socket.on('connect', function() {
//   console.log('Connected!');
// });

// socket.on('update',function(value){
//   console.log("got it")
//   let textvalue = document.createElement("p")
//   textvalue.innerHTML = value
//   document.getElementById("empty_list").appendChild(textvalue)
// })

// socket.on('new_data', function(data) {
//   console.log(data);
// });

function register() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log(form.username.value)
                console.log(form.password.value)
            }
        }
    };
    xhr.open('POST', 'http://localhost:5000/registerAccount');  
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"username":form.username.value,"password":form.password.value}));
}

function hide_unhide() {
    document.getElementById('id01').style.display='block'
}
function AddOrderToList(params) {
    
}
// Change to post later
function addOrder(ButtonBody){
    var xhr = new XMLHttpRequest();
    let OrderId = ButtonBody.value
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Order Sent")
            }
        }
    };
    xhr.open('GET', 'http://localhost:5000/AddOrder/'+OrderId);  
    xhr.send();
}