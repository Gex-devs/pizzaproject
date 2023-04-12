from bson import ObjectId
from flask import Flask, render_template, jsonify, request
import time,random
import os
import logging
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from flask_cors import CORS
import threading
import pymongo
from processors import *
from datetime import datetime

# load local env
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, cors_allowed_origins='*')

CORS(app=app)




# MongoDB Thread
def pendingOrderListner():
    try:
        with pendingOrderCol.watch(
                [{'$match': {'operationType': 'insert'}}]) as stream:
            for insert_change in stream:
                print(insert_change)
                print("New Order Arrived")
                socketio.emit('new_order', CreatOrderForFront_end(insert_change, foodMenu))
    except Exception as e:
        print(e)
        

# MongoDB Thread


def HistoryOrderListner():
    try:
        with HistoryOrderCol.watch(
                [{'$match': {'operationType': 'insert'}}]) as stream:
            for insert_change in stream:
                logging.info("History Update")
                socketio.emit('UpdateHistory', CreatOrderForFront_end(
                    insert_change, foodMenu))
    except pymongo.errors.PyMongoError:
        # The ChangeStream encountered an unrecoverable error or the
        # resume attempt failed to recreate the cursor.
        logging.error('PyMongoErrr')



client = MongoClient(os.getenv("MONGODB_ADDRESS"))
db = client['pizzaHouse']
pendingOrderCol = db['pendingOrder']
HistoryOrderCol = db['History']
foodMenu = db['foodMenu']
accounts = db['accounts']
PendingOrderThread = threading.Thread(target=pendingOrderListner)
PendingOrderThread.setDaemon(True)
HistoryOrderThread = threading.Thread(target=HistoryOrderListner)
HistoryOrderThread.setDaemon(True)

HistoryOrderThread.start()
PendingOrderThread.start()


@socketio.on('connect')
def clientConnected():
    print("Client Joined")


@app.route("/")
def Orderentry():
    Orders = pendingOrderCol.find()
    return render_template('index.html', orders=Orders)


@app.route("/history")
def Historyentry():
    History = HistoryOrderCol.find()

    return render_template('history.html',orders=History)


@app.route("/OrderProcces",methods=['POST'])
def CompleteOrCancle():
    Data = request.get_data().decode("UTF-8")
    
    OrderId = Data.split(":")[0]
    OrderStatus = Data.split(":")[1]
    UpdateHistory(OrderId,OrderStatus,pendingOrderCol,HistoryOrderCol)

    return "200"


@app.route("/testendpoint", methods=['POST', 'GET'])
def testendpoint():
    Orders = pendingOrderCol.find()
    for x in Orders:
        for y in x:
            print(y)

    return "200"


@app.route("/StartCooking",methods = ['GET'])
def OvenRecv():
    ran = random.randint(10,20)
    # socketio.emit('start_cooking',CalculatedETA) Calculate ETA
    socketio.emit('start_cooking', ran * 60  )
      
    return str(ran)


@app.route("/DoneCooking",methods = ['GET'])
def OvenDone():
    # socketio.emit('start_cooking',CalculatedETA) Calculate ETA
    socketio.emit('done_cooking', "done cooking"  )
      
    return "200"


@app.route("/AddOrder/<ID>")
def page(ID):
    
    tt = foodMenu.find_one(ObjectId(ID))
    print(f"Found {(tt)}")
    pendingOrderCol.insert_one(tt)
    return "200"


@app.route("/StartOrder", methods=['POST'])
def startOrder():

    OrderID = request.get_data().decode('utf-8')
    # CreatStartOrder(OrderID,pendingOrderCol,foodMenu)
    socketio.emit('StartOrder', CreatStartOrder(
        OrderID, pendingOrderCol, foodMenu))

    return "200"


if __name__ == '__main__':
    socketio.run(host="0.0.0.0", port=5050,app=app, debug=True)
