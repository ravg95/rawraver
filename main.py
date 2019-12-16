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
import shutil
from werkzeug.utils import secure_filename
db_url = "postgres://rafal:@127.0.0.1:5432/rawraver"#os.environ.get('DATABASE_URL')

format = {
'audio/basic':'au',
'audio/basic':'snd',
'audio/L24':'Linear PCM',
'audio/mid':'midi',
'audio/midi':'midi',
'audio/mpeg':'mp3',
'audio/mp3':'mp3',
'audio/mp4':'mp4 audio',
'audio/x-aiff':'aiff',
'audio/aiff':'aiff',
'audio/x-mpegurl':'m3u',
'audio/vnd.rn-realaudio':'ra/ram',
'audio/ogg':'Ogg Vorbis',
'audio/vorbis':'Vorbis',
'audio/vnd.wav':'Wave',
'audio/flac':'flac',
'audio/wave':'Wave',
'audio/wav':'Wave',
'audio/x-wav':'Wave',
'audio/x-pn-wav':'Wave',
'audio/webm':'WebM'
}

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
heroku = Heroku(app)
db = SQLAlchemy(app)
db.init_app(app)
from models import Item, Directory
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

STORAGE = 'storage'
def checkType(str):
    d = str.split('/')
    if(d[0] == 'audio'):
        return True
    return False

@app.route("/dir/<int:id>")
@cross_origin()
def dispDir(id):
    files = Item.query.filter_by(directory_id = id).all()
    dirs = Directory.query.filter_by(parent_dir_id = id).all()
    parents = []
    idt = id
    while idt is not None and int(idt) > 0:
        dir = Directory.query.filter_by(id = idt).one()
        parents.append([dir.id, dir.name])
        idt = dir.parent_dir_id
    parents.reverse()
    return jsonify(files=[e.serialize() for e in files],dirs = [e.serialize() for e in dirs], parents = parents)

@app.route("/file/<int:id>")
@cross_origin()
def dispFile(id):
    file = Item.query.filter_by(id = id).one()
    dir = Directory.query.filter_by(id = file.directory_id).one()
    path = os.path.join(STORAGE, dir.path, dir.name, file.name)
    data = file.serialize()
    data['path'] = path
    return jsonify(data)

@app.route("/file/<int:id>/delete")
@cross_origin()
def delFile(id):
    file = Item.query.filter_by(id = id).one()
    dir = Directory.query.filter_by(id = file.directory_id).one()
    path = os.path.join(STORAGE, dir.path, dir.name, file.name)
    db.session.delete(file)
    db.session.commit()
    os.remove(path)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/file/add/<int:dir_id>", methods = ['POST'])
@cross_origin()
def addFile(dir_id):
    if 'file' not in request.files:
        return json.dumps({'success':False,'error':'No file part'}), 400, {'ContentType':'application/json'}
    file = request.files['file']
    data = request.form
    title = data.get('title')
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return json.dumps({'success':False,'error':'No selected file'}), 415, {'ContentType':'application/json'}
    if not checkType(file.content_type):
        return json.dumps({'success':False,'error':'Bad file type'}), 417, {'ContentType':'application/json'}

    if file and title:
        filename = secure_filename(file.filename)
        dir = Directory.query.filter_by(id = dir_id).one()
        #print(os.path.join(STORAGE, dir.path, dir.name, filename))
        path = os.path.join(STORAGE, dir.path, dir.name, filename)
        try:
            file.save(path)
            size = os.stat(path).st_size/(1024*1024)
            size = "%.2f" % round(size,2)
            newFile = Item(filename, dir_id, data.get('title'), data.get('artist'), data.get('year'), data.get('album'), format[file.content_type], size)
            db.session.add(newFile)
            db.session.commit()
        except Exception as e:
           #log your exception in the way you want -> log to file, log as error with default logging, send by email. It's upon you
            db.session.rollback()
            db.session.flush() # for resetting non-commited .add()
            os.remove(path)
            print(e)
            return json.dumps({'success':False,'error':'Input data error'}), 412, {'ContentType':'application/json'}

        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    else:
        return json.dumps({'success':False,'error':'Unknown input data error'}), 420, {'ContentType':'application/json'}


@app.route("/dir/add/<int:dir_id>", methods = ['POST'])
@cross_origin()
def addDir(dir_id):
    name = request.form.get('name')
    parent_dir = Directory.query.filter_by(id = dir_id).one()
    path = os.path.join(parent_dir.path, parent_dir.name)
    newDir = Directory(dir_id, name, path)
    db.session.add(newDir)
    db.session.commit()
    os.mkdir( os.path.join(STORAGE, path, name), 511 );
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}


@app.route("/dir/delete/<int:dir_id>", methods = ['GET'])
@cross_origin()
def delDir(dir_id):

    dir = Directory.query.filter_by(id = dir_id).one()

    path = os.path.join(STORAGE, dir.path, dir.name)

    db.session.delete(dir)
    db.session.commit()

    shutil.rmtree(path)
    return json.dumps({'parent':dir.parent_dir_id}), 200, {'ContentType':'application/json'}

@app.route("/file/search/<string:phrase>", methods = ['GET'])
@cross_origin()
def search(phrase):

    files = Item.query.filter(Item.title.ilike('%' + phrase + '%')).all()
    files1 = Item.query.filter(Item.artist.ilike('%' + phrase + '%')).all()
    files2 = Item.query.filter(Item.name.ilike('%' + phrase + '%')).all()
    files3 = Item.query.filter(Item.album.ilike('%' + phrase + '%')).all()
    files4 = Item.query.filter(Item.format.ilike('%' + phrase + '%')).all()
    files+=files1
    files+=files2
    files+=files3
    files+=files4
    if(phrase.isdigit()):
        if(int(phrase)>=1900 and int(phrase)<=2030):
            files5 = Item.query.filter(Item.year.ilike('%' + phrase + '%')).all()
            files+=files5

    nFiles = list(dict.fromkeys(files))


    return jsonify(files=[e.serialize() for e in nFiles])

@app.route("/file/edit/<int:file_id>", methods = ['POST'])
@cross_origin()
def editFile(file_id):
    file = Item.query.filter_by(id = file_id).one()

    file.title = request.form.get('title')
    file.artist = request.form.get('artist')
    file.album = request.form.get('album')
    file.year = request.form.get('year')

    db.session.commit()
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

if __name__ == "__main__":
    app.run()
