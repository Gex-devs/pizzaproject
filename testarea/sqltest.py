from flask import Flask, render_template,jsonify
from flask_mysqldb import MySQL
import time,os
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
from flask_cors import CORS


# load local env
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)
CORS(app=app)


app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)




last_timestamp = time.time()


@app.route("/")
def page():

    return render_template('index.html')

@app.route("/change")
def havebeen():


    return "200"



@app.route("/testendpoint")
def entry():

    # Creating a connection cursor
    cursor = mysql.connection.cursor()
    # Executing SQL Statements
    #cursor.execute('''CREATE TABLE test_sample(data int,timestamp int)''')
    cursor.execute(f'''INSERT INTO test_sample VALUES(23,{time.time()})''')
    # Saving the actions performed on the DB
    mysql.connection.commit()
    # Closing the cursor
    cursor.close()
    return "200"


@app.route('/data')
def get_data():
    global last_timestamp

    # Wait for changes in the database
    
    # Get a MySQL cursor
    cur = mysql.connection.cursor()
    # Execute a query to check for changes in the database
    cur.execute("SELECT * FROM test_sample WHERE timestamp > %s", (last_timestamp,))
    # Get the updated rows
    rows = cur.fetchall()
    print(rows)
    # Close the cursor
    cur.close()
    # If there are updated rows, update the last timestamp and return the data
    if rows:
        last_timestamp = time.time()
        data = []
        for row in rows:
            data.append({'id': row[0], 'timestamp': row[1]})
        print(data)
        return jsonify(data)
    # If there are no updated rows, sleep for a short time and try again
    else:
        time.sleep(1)
        return "200"

if __name__ == '__main__':
    socketio.run(app,debug=True)

#app.run(host="0.0.0.0",debug=True)