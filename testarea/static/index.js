
var socket = io.connect('http://127.0.0.1:5000/');

socket.on('connect', function() {
  console.log('Connected!');
});

socket.on('update',function(value){
  console.log("got it")
  let textvalue = document.createElement("p")
  textvalue.innerHTML = value

  document.getElementById("empty_list").appendChild(textvalue)
})

socket.on('new_data', function(data) {
  console.log(data);
});