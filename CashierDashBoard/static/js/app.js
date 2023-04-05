function addToBucket(button) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:5000/addToBucket', true);
    // set the content-type header to indicate that we're sending plain text data
    xhr.setRequestHeader('Content-Type', 'text/plain');
    //var data = button.value;
    var data = button.value;
    console.log(data)
    // send the POST request with the string data
    xhr.send(data);
}