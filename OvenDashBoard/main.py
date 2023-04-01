from bson import ObjectId
from flask import Flask, render_template,jsonify, request
import time,os,logging
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from flask_cors import CORS
import threading
from processors import *

# load local env
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app,cors_allowed_origins='*')

CORS(app=app)

# Mongo DB config
client = MongoClient(os.getenv("MONGODB_ADDRESS"), 27017)

db = client['pizzahouse']

pendingOrderCol = db['pendingOrder']
foodMenu = db['foodMenu']
accounts = db['accounts']

change_stream = pendingOrderCol.watch()



@socketio.on('connect')
def clientConnected():
    print("Client Joined")

 
@app.route("/")
def entry():
    return render_template('index.html')


@app.route("/testendpoint")
def testendpoint():

    return "200"

@app.route("/AddOrder/<ID>")
def page(ID):
    tt = foodMenu.find_one(ObjectId(ID))
    print(f"Found {(tt)}")
    pendingOrderCol.insert_one(tt)
    return "200"

@app.route("/StartOrder",methods=['POST'])
def startOrder():
    
    print("Called")
    OrderID = request.get_data().decode('utf-8')
    #CreatStartOrder(OrderID,pendingOrderCol,foodMenu)
    socketio.emit('StartOrder', CreatStartOrder(OrderID,pendingOrderCol,foodMenu))

    return "200"

# MongoDB Thread
def MongoDBlistner():
    for event in change_stream:
        #print(event)
        try:
            #CreatOrderForFront_end(event,foodMenu)
            socketio.emit('new_order', CreatOrderForFront_end(event,foodMenu))
        except KeyError:
            pass
        


thread = threading.Thread(target=MongoDBlistner)
thread.setDaemon(True)
thread.start()



if __name__ == '__main__':
    socketio.run(host="0.0.0.0",app=app,debug=True)

