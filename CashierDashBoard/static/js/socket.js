
var socket = io.connect('http://127.0.0.1:5000/');

socket.on('connect', function () {
    console.log('Connected!');
});

socket.on('updateBucket', function (data) {
    console.log(data)
    UpdateOrderBucket(data)
});

socket.on('updateNoti', function (data) {
    console.log(data)
    updateNotificationCount()
});