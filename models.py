from flask_appbuilder import Model
from sqlalchemy import Column, Integer, ForeignKey
from main import db

class Item(db.Model):
    __tablename__ = "file"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text())
    directory_id = db.Column(db.Integer, db.ForeignKey('dir.id', ondelete='CASCADE'), nullable = False)
    title = db.Column(db.Text())
    artist = db.Column(db.Text())
    year = db.Column(db.Integer)
    album = db.Column(db.Text())
    format = db.Column(db.Text())
    size = db.Column(db.Float)

    def __init__(self, name, directory_id, title, artist, year, album, format, size):
        self.name = name
        self.directory_id = directory_id
        self.title = title
        self.artist = artist
        self.year = year
        self.album = album
        self.format = format
        self.size = size

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'directory_id': self.directory_id,
            'title': self.title,
            'artist': self.artist,
            'year': self.year,
            'album': self.album,
            'format': self.format,
            'size': self.size,
        }

class Directory(db.Model):
    __tablename__ = "dir"
    id = db.Column(db.Integer, primary_key=True)
    parent_dir_id = db.Column(db.Integer, db.ForeignKey('dir.id', ondelete='CASCADE'))
    name = db.Column(db.Text())
    path = db.Column(db.Text())

    def __init__(self, parent_dir_id, name, path):
        self.parent_dir_id = parent_dir_id
        self.name = name
        self.path = path

    def serialize(self):
            return {
            'id': self.id,
            'parent_dir_id': self.parent_dir_id,
            'name': self.name,
            'path': self.path,
        }
