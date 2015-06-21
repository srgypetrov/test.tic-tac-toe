from gevent import monkey

monkey.patch_all()

import os
import django

from django.core.handlers.wsgi import WSGIHandler

from socketio.server import SocketIOServer


os.environ['DJANGO_SETTINGS_MODULE'] = 'project.settings'

django.setup()


if __name__ == '__main__':
    print 'Starting server at http://127.0.0.1:9000/'
    SocketIOServer(('', 9000), WSGIHandler(), resource="socket.io").serve_forever()
