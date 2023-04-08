async function addToBucket(button) {
    let inputValue;
    const { value: ipAddress } = await Swal.fire({
        title: 'Please Specify amount',
        input: 'text',
        inputLabel: 'Amount in Numbers',
        inputClass: 'text-center',
        inputValue: inputValue,
        showCancelButton: true,
        inputAttributes:{
            style: 'width: 80px;postion:relative;margin-left:40%',
        },
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }else{
                inputValue = value
            }
        }
    })
    console.log(inputValue)
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:5000/addToBucket', true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    var data = button.value+":"+inputValue;
    xhr.send(data);
}