from flask import Flask, render_template, request, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import func
import sys
import json
from flask import jsonify
from flask_heroku import Heroku
from flask_cors import CORS, cross_origin
from flask import abort
import os
db_url = "postgres://rafal:@127.0.0.1:5432/rawraver"#os.environ.get('DATABASE_URL')

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
heroku = Heroku(app)
db = SQLAlchemy(app)
db.init_app(app)
from models import Item, Directory
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



@app.route("/")
@cross_origin()
def main():
    return "Hello World"

@app.route("/dir/<int:id>")
@cross_origin()
def dispDir(id):
    files = Item.query.filter_by(directory_id = id).all()
    asr = ""
    for fle in files:
        asr+= str(fle.name)+"\n"
    return str(asr)


if __name__ == "__main__":
    app.run(debug=True)
