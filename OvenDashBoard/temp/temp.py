from pymongo import MongoClient
import threading

client = MongoClient("mongodb+srv://test:test123@cluster0.kebg03f.mongodb.net/?retryWrites=true&w=majority")

database = client['PizzaProject']

OrderCol = database['Orders']


Listner = OrderCol.watch()

def TheEventListner():
    for event in Listner:
        print(event)


thread = threading.Thread(target=TheEventListner)
#thread.setDaemon(True)
thread.start()


print("Here")