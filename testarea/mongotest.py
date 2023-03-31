from flask import Flask, render_template,jsonify
import time,os,logging
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from flask_cors import CORS
import threading

# load local env
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app,cors_allowed_origins='*')

CORS(app=app)

# Mongo DB config
client = MongoClient(os.getenv("MONGODB_ADDRESS"), 27017)

db = client['testDB']

collection = db['testCol']

pendingOrdersCol = db['PendingOrders']

change_stream = collection.watch()



@socketio.on('connect')
def clientConnected():
    print("Client Joined")



@app.route("/")
def page():
    return render_template('index.html')


@app.route("/AddOrder")
def page():
    pendingOrdersCol.insert_one({'id':1,"item":"pizza"})
    return "200"

@app.route("/testendpoint/<value>")
def test(value):
    print(value)
    socketio.emit('update',value)
    return "200"


# MongoDB Thread
def MongoDBlistner():
    for event in change_stream:
        print(event["fullDocument"]["name"])
        socketio.emit('update', event["fullDocument"]["name"])

thread = threading.Thread(target=MongoDBlistner)
thread.setDaemon(True)
thread.start()



if __name__ == '__main__':
    socketio.run(app,debug=True)

#app.run(host="0.0.0.0",debug=True)