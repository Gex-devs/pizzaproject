import time, sys
from fhict_cb_01.CustomPymata4 import CustomPymata4

#-----------
# Constants
#-----------
level = 0
prevLevel = 0
BUTTON1PIN = 8
REDLEDPIN = 4
GREENLEDPIN = 5
number = 60

def ButtonChanged(data):
    global level
    global prevLevel
    level = data[2] # get the level
    # Keep the callback function short and fast.
    # Let loop() do the 'expensive' tasks.
#-----------
# functions
#-----------
def setup():
    global board
    board = CustomPymata4(com_port = "COM4")
    board.set_pin_mode_digital_input_pullup(BUTTON1PIN) # set pin to input pullup
    board.set_pin_mode_digital_output(REDLEDPIN)
    board.set_pin_mode_digital_output(GREENLEDPIN)
    board.displayOn()
    board.set_pin_mode_digital_input_pullup(BUTTON1PIN, callback = ButtonChanged)

def timer():
    global number
    board.displayShow(number) 
    while number >= 0 :
      board.digital_pin_write(REDLEDPIN, 1)
      board.displayShow(number) 
      number -= 1
      time.sleep(0.1)
    if number == -1:
            board.digital_pin_write(GREENLEDPIN, 1)
            breakpoint
        
    
    else:
        board.digital_pin_write(REDLEDPIN, 0)
        prevLevel = 1 
        
    time.sleep(0.01) # Give Firmata some time to handle protocol.

def loop():
    global prevLevel
    global number
    level, time_stamp = board.digital_read(BUTTON1PIN)
    


    if (prevLevel != level):
        
        timer()
        
        time.sleep(0.01) # Give Firmata some time to handle protocol.
    else:
        board.digital_pin_write(REDLEDPIN, 0)
        prevLevel = 1 
        
    time.sleep(0.01) # Give Firmata some time to handle protocol.

    # value = board.digital_read(8)
    # print(value) # returns a list of level and
    # option 1: 
    # level = board.digital_read(8)[0]
    # option 2:
    # level, time_stamp = board.digital_read(8)

#--------------
# main program
#--------------
setup()
while True:
    try:
        loop()  
    except KeyboardInterrupt: # crtl+C
        print ('shutdown')
        board.shutdown()
        sys.exit(0)   
