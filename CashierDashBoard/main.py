from flask import Flask,render_template
from bson import ObjectId
from flask import Flask, render_template, jsonify, request
import pymongo
import os
import logging
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from flask_cors import CORS
from proccessors import *
import threading

# load local env
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, cors_allowed_origins='*')


## Database Configurtaion 
client = MongoClient(os.getenv("MONGODB_ADDRESS"))
db = client['pizzaHouse']

pendingOrderCol = db['pendingOrder']
HistoryOrderCol = db['History']
foodMenuCol = db['foodMenu']




@socketio.on('connect')
def clientConnected():
    print("Client Joined")


@app.route("/")
def entry():
    #check

    foodMenu = foodMenuCol.find()
    
    return render_template('index.html',foodM =foodMenu)



@app.route("/history")
def history():
  
    order = HistoryOrderCol.find()
    return render_template('history.html',orders=order )



@app.route("/addToBucket",methods=['POST'])
def buckets():
    Data = request.get_data().decode("UTF-8").split(":")

    ItemID = Data[0]
    AmountOfOrder = Data[1]
    
    socketio.emit("updateBucket",CreateBucketUpdate(ItemID,AmountOfOrder,foodMenuCol))
    
    return "200"

@app.route("/pendOrder",methods=['POST'])
def pendOrder():

    Data = request.get_data().decode("UTF-8")

    addTopendingOrder(Data,pendingOrderCol)

    return "200"

# MongoDB Thread
def HistoryListner():

    try:
        with HistoryOrderCol.watch(
                [{'$match': {'operationType': 'insert'}}]) as stream:
            for insert_change in stream:
                socketio.emit("updateNoti","updateNotification")
    except pymongo.errors.PyMongoError:
        # The ChangeStream encountered an unrecoverable error or the
        # resume attempt failed to recreate the cursor.
        logging.error('PyMongoErrr')


thread = threading.Thread(target=HistoryListner)
thread.daemon = True
thread.start()


if __name__ == '__main__':
    socketio.run(host="0.0.0.0", port=5000,app=app, debug=True)
