from flask import Flask,render_template
from bson import ObjectId
from flask import Flask, render_template, jsonify, request
import time
import os
import logging
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from flask_cors import CORS
import pymongo
from proccessors import *
from datetime import datetime

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


    return render_template('index.html')

@app.route("/addToBucket",methods=['POST'])
def buckets():
    ItemID = request.get_data().decode("UTF-8")

    socketio.emit("updateBucket",CreateBucketUpdate(ItemID,foodMenuCol))

    return "200"

def pendOrder():

    print("Hey")

if __name__ == '__main__':
    socketio.run(host="0.0.0.0", app=app, debug=True)
