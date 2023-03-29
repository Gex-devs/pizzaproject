function pollData() {
    setInterval(function() {
      fetch('/data')
        .then(response => response.json())
        .then(data => {
          // Update the UI with the new data
          console.log(data);
        })
        .catch(error => {
          console.error(error);
        });
    }, 5000); // Poll every 5 seconds
}

pollData()