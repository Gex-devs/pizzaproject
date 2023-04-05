from bson import ObjectId
from flask import Flask, render_template,jsonify, request
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

db = client['pizzahouse']

pendingOrderCol = db['PendingOrder']
foodMenu = db['foodMenu']
accounts = db['accounts']

change_stream = pendingOrderCol.watch()



@socketio.on('connect')
def clientConnected():
    print("Client Joined")

 

@app.route("/")
def entry():
    return render_template('startpage.html')


@app.route("/login",methods = ['POST'])
def register():
    username = request.form['uname']
    password = request.form['psw']

    print(username,password)

    acc = accounts.find_one({"$and": [{"username": username}, {"password": password}]})
    print(acc)
    if acc == None:
        print("Incorrect Username or Password")
        return "404"
    elif acc != None:
        print("Found pass")
        return render_template('startpage.html',Username = username)


@app.route("/AddOrder/<ID>")
def page(ID):
    tt = foodMenu.find_one(ObjectId(ID))
    print(f"Found {(tt)}")
    pendingOrderCol.insert_one(tt)
    return "200"

# MongoDB Thread
def MongoDBlistner():
    for event in change_stream:
        print(event)
        try:
            print(event["fullDocument"]["name"])
            socketio.emit('update', event["fullDocument"]["name"])
        except KeyError:
            pass
        


thread = threading.Thread(target=MongoDBlistner)
thread.setDaemon(True)
thread.start()



if __name__ == '__main__':
    socketio.run(host="0.0.0.0",app=app,debug=True)

