def listner():
    for event in change_stream:
        print(event)
        socketio.emit('update', "Mongo DB updated")

thread = threading.Thread(target=listner)
thread.daemon()
thread.start()
