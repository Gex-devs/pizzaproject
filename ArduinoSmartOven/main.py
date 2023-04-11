from pyfirmata import Arduino, util
import time
import requests

# Constants
led_pin = 2 # Analog pin for Led Pin
button_pin = 13 # Anolog pin for button




# Functions
def setup():
    """Initialize the board and set the modes of the pins used for the sensors"""
    global board, button, led
    board = Arduino('COM4')
    it = util.Iterator(board)
    it.start()
    board.displayOn()
   
    board.set_pin_mode_analog_input(led_pin)
    button = board.get_pin('d:{}:i'.format(button_pin))
    led = board.get_pin('d:{}:o'.format(led_pin))

def get_time_from_database():
    
    return int(time.time())

def send_time_data_to_server(time_data):
    payload = {'time': time_data}
    response = requests.post(url, json=payload)
    print(response.content)




# Flask server information
url = 'http://127.0.0.1:5000/estimatedTime' 

# Initialize board and pins
setup()

# Main loop
while True:
    if button.read() == 1:
        led.write(1)
        time_data = get_time_from_database()
        send_time_data_to_server(time_data)
        led.write(0)
        time.sleep(1)
## send a request 30sec or 1 min

# based on that timer


## Expection. When it doesn't time...Order is not ready.
