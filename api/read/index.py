import io
from sanic import Sanic, response
from mutagen.oggvorbis import OggVorbis

app = Sanic()


@app.route('/', methods=['POST'])
@app.route('/<path:path>', methods=['POST'])
async def index(request, path=""):
    headers = {'Access-Control-Allow-Origin': '*', 'X-Served-By': 'sanic'}
    if request.method == 'POST':
        myfile = request.files.get('myfile')
        byte = io.BytesIO(myfile.body)
        ogg = OggVorbis(byte)
        print(ogg)
        return response.json({
            'LOOPSTART': ogg.get('loopstart'),
            'LOOPLENGTH': ogg.get('looplength'),
            'SOFTWARE': ogg.get('software'),
            'DATE': ogg.get('date'),
        }, headers=headers)
    return response.json({'msg': 'hello'}, headers=headers)
