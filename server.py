from flask import Flask, request, jsonify, make_response
import uuid
from json import JSONEncoder
import json
from flask_cors import CORS
import signal
import sys

def signal_handler(sig, frame):
    print('Ctrl+C detected. Saving data...')
    save_data()
    sys.exit(0)

app = Flask(__name__)
CORS(app)

draft_storage = {} #TODO: save amonf restarts
publication_storage = {} #TODO: save amonf restarts

class Draft:
    def __init__(self, username="", pwd="", text="", cpp="", python="", other="", vehicle1="", 
                 vehicle2="", vehicle3="", date="", favcolor="", filename="", filedata="", 
                 something="", cars="", quantity=0, vol=0):
        self.username = username
        self.pwd = pwd
        self.text = text
        self.cpp = cpp
        self.python = python
        self.other = other
        self.vehicle1 = vehicle1
        self.vehicle2 = vehicle2
        self.vehicle3 = vehicle3
        self.date = date
        self.favcolor = favcolor
        self.filename = filename
        self.filedata = filedata
        self.something = something
        self.cars = cars
        self.quantity = quantity
        self.vol = vol

    def to_json(self):
        return {
            "username" : self.username,
            "pwd" : self.pwd,
            "text" : self.text,
            "cpp" : self.cpp,
            "python" : self.python,
            "other" : self.other,
            "vehicle1" : self.vehicle1,
            "vehicle2" : self.vehicle2,
            "vehicle3" : self.vehicle3,
            "date" : self.date,
            "favcolor" : self.favcolor,
            "filename" : self.filename,
            "filedata" : self.filedata,
            "something" : self.something,
            "cars" : self.cars,
            "quantity" : self.quantity,
            "vol" : self.vol,
        }

def convert_drafts_to_dict(drafts: dict[str, Draft]):
    result = {}
    for id in drafts:
        result[id] = drafts[id].username
    return result

def save_data():
    with open("storages/draft_storage.json", "w") as f:
        json.dump({k: v.to_json() for k, v in draft_storage.items()}, f, indent=4)

    with open("storages/publication_storage.json", "w") as f:
        json.dump({k: v.to_json() for k, v in publication_storage.items()}, f, indent=4)

def load_data():
    global draft_storage, publication_storage
    try:
        with open("storages/draft_storage.json", "r") as f:
            draft_data = json.load(f)
            draft_storage = {k: Draft(**v) for k, v in draft_data.items()}
            print(draft_storage)
    except FileNotFoundError:
        print("No previous draft data found.")

    try:
        with open("storages/publication_storage.json", "r") as f:
            publication_data = json.load(f)
            publication_storage = {k: Draft(**v) for k, v in publication_data.items()}
            print(publication_storage)
    except FileNotFoundError:
        print("No previous publication data found.")

@app.route('/init', methods=['GET'])
def init_draft():
    new_draft = Draft()
    new_id = str(uuid.uuid4())
    draft_storage[new_id] = new_draft
    return jsonify({"id" : new_id}), 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/drafts', methods=['GET'])
def get_drafts():
    return jsonify(convert_drafts_to_dict(draft_storage)), 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/publications', methods=['GET'])
def get_publications():
    return jsonify(convert_drafts_to_dict(publication_storage)), 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/draft/<id>', methods=['GET'])
def get_draft(id):
    if id not in draft_storage:
        return jsonify({"error" : "no draft with given id"}), 400
    print(jsonify(draft_storage[id].to_json()).get_json())
    return jsonify(draft_storage[id].to_json()), 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/publication/<id>', methods=['GET'])
def get_publication(id):
    if id not in publication_storage:
        return jsonify({"error" : "no publication with given id"}), 400
    return jsonify(publication_storage[id].to_json()), 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/autosave/<id>', methods=['PATCH'])
def autosave_draft(id):
    if id not in draft_storage:
        return jsonify({"error" : "no draft with given id"}), 400
    try:
        data = request.get_json()
        print(data)
        draft_storage[id].__dict__.update(data)
        print("updated draft = ", draft_storage[id].__dict__)
        print()
    except Exception as e:
        print(e)
    return '', 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/savefile/<id>', methods=['POST'])
def save_file(id):
    if id not in draft_storage:
        return jsonify({"error" : "no draft with given id"}), 400
    try:
        print("GET FILE")
        files = request.files
        print(files.getlist('file')[0])
        file = files.getlist('file')[0]
        filedata = file.read().decode("utf-8")
        print(file.filename)
        print(filedata)
        draft_storage[id].filename = file.filename
        draft_storage[id].filedata = filedata
        print("updated draft = ", draft_storage[id].__dict__)
        print()
    except Exception as e:
        print(e)
    return '', 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/reset/<id>', methods=['DELETE'])
def reset_draft(id):
    if id not in draft_storage:
        return jsonify({"error" : "no draft with given id"}), 400
    del draft_storage[id]
    return '', 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/delete/<id>', methods=['DELETE'])
def delete_draft(id):
    if id not in draft_storage:
        return jsonify({"error" : "no draft with given id"}), 400
    del draft_storage[id]
    return '', 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/deletepub/<id>', methods=['DELETE'])
def delete_pub(id):
    if id not in publication_storage:
        return jsonify({"error" : "no pub with given id"}), 400
    del publication_storage[id]
    return '', 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

@app.route('/publish/<id>', methods=['POST'])
def publish_draft(id):
    if id not in draft_storage:
        return jsonify({"error" : "no draft with given id"}), 400
    publication_storage[id] = draft_storage.pop(id)
    return '', 200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}

if __name__ == '__main__':
    try:
        load_data()
        signal.signal(signal.SIGINT, signal_handler)
        app.run()
    except Exception as e:
        print("EXCEPTION: ", e)
        save_data()
