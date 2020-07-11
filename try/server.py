from flask import Flask, request, jsonify, send_file
from mutagen.oggvorbis import OggVorbis
import tempfile

app = Flask(__name__)


@app.route('/')
def root():
    return '''
        <!doctype html>
        <h1>/api/read</h1>
        <form action=/api/read method=post enctype=multipart/form-data>
          <input type=file name=myfile>
          <input type=submit value=Upload>
        </form>
        <hr />
        <h1>/api/write</h1>
        <form action=/api/write method=post enctype=multipart/form-data>
          <input type=file name=myfile>
          <input type=text name=loopstart value=1000>
          <input type=text name=looplength value=500000>
          <input type=submit value=Upload>
        </form>
        <hr />
        <h1>/api/echo</h1>
        <form action=/api/echo method=post enctype=multipart/form-data>
          <input type=file name=myfile>
          <input type=submit value=Upload>
        </form>
        '''


@app.route('/api/read', methods=['POST'])
def read():
    if request.method == 'POST':
        myfile = request.files.get('myfile')
        ogg = OggVorbis(myfile)
        d = dict()
        for k, v in ogg.items():
            d[k] = v
        print(d)
        return jsonify(d)


@app.route('/api/write', methods=['POST'])
def write():
    if request.method == 'POST':
        loopstart_val = request.form['loopstart']
        looplength_val = request.form['looplength']
        print('LOOPSTART:', loopstart_val)
        print('LOOPLENGTH:', looplength_val)
        myfile = request.files['myfile']
        tmp = tempfile.NamedTemporaryFile()
        print(tmp.name)
        with open(tmp.name, "wb") as f:
            f.write(myfile.read())
            f.close()
        ogg = OggVorbis(tmp.name)
        ogg['LOOPSTART'] = loopstart_val
        ogg['LOOPLENGTH'] = looplength_val
        ogg.save()
        print(ogg)
        filename = 'loop.ogg'
        return send_file(tmp.name, mimetype='audio/ogg', as_attachment=True, attachment_filename=filename)


@app.route('/api/echo', methods=['POST'])
def echo():
    if request.method == 'POST':
        myfile = request.files['myfile']
        tmp = tempfile.NamedTemporaryFile()
        print(tmp.name)
        with open(tmp.name, "wb") as f:
            f.write(myfile.read())
            f.close()
        filename = 'echo.ogg'
        return send_file(tmp.name, mimetype='audio/ogg', as_attachment=True, attachment_filename=filename)


if __name__ == "__main__":
    print(app.url_map)
    app.run(host='localhost', port=8000)
