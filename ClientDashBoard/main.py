from flask import Flask, jsonify, render_template, request
from flask_cors import CORS


sensor_data = []


app = Flask(__name__)
CORS(app=app)


 

@app.route("/")
def entry():

    return render_template('index.html')

app.run(debug=True)


