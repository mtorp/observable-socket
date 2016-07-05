// vendor
// import debug from 'debug'

import { Server } from 'ws'

// const log = debug('observable-socket:test-server')

export const Echo = function createEchoServer (port) {
    var server = new Server({port: port})

    server.on('connection', function (socket) {

        // echo
        socket.on('message', function (msg) {
            if (msg === 'die') {
                server.close()
            }

            socket.send('Echo: ' + msg)
        })
    })

    return server
}

export const Publish = function createPublishServer (port) {
    var server = new Server({port: port})

    server.on('connection', function (socket) {
        let counter = 1

        socket.send('OPEN')

        var interval = setInterval(function () {
            if(socket.readyState === 1) {
                socket.send(JSON.stringify(counter++))
            }
        }, 100)

        socket.on('message', function (msg) {
            if (msg === 'die') {
                clearInterval(interval)

                server.close()
            }
        })
    })

    return server
}

export const Err = function createErr (port) {
    var server = new Server({port: port})

    // server.on('connection', function(socket) {
    //     setTimeout(() => socket.emit('error', 'yolo fukit'), 1000)
    // })

    // server.on('error', function() {
    //     setTimeout(() => server.close(), 1000)
    // })

    return server
}