var express = require('express');
var app = express();

var server = require('http').createServer(app);
server.listen(3088);

var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    res.send('index.html');
});

/**
 * ���͸���ǰ�ͻ���
 * socket.emit('message', "this is a test");
 *
 * ���͸����пͻ��ˣ����˵�ǰ�ͻ���
 * socket.broadcast.emit('message', "this is a test");
 *
 * ���͸���game������������ÿͻ��ˣ����˵�ǰ�ͻ���
 * socket.broadcast.to('game').emit('message', 'nice game');
 *
 * ���͸����пͻ���
 * io.sockets.emit('message', "this is a test");
 *
 * ���͸���game������������ͻ���
 * io.sockets.in('game').emit('message', 'cool game');
 *
 * ���͸�socketid����ͻ�����Ϣ
 * io.sockets.socket(socketid).emit('message', 'for your eyes only');
 */

var connectionList = {};
/*io.sockets.on���������ַ���'connection'��Ϊ�ͻ��˷������ӵ��¼��������ӳɹ��󣬵��ô���socket�����Ļص�����*/
io.sockets.on('connection', function (socket) {
    /*���ͻ�������ʱ������socketId*/
    var socketId = socket.id;
    connectionList[socketId] = {
        socket: socket
    };
    console.log(socket);

    /*�û�����������ʱ��sending to all clients except sender*/
    socket.on('join', function (data) {
        socket.broadcast.emit('broadcast_join', data);
        connectionList[socketId].username = data.username;
    });

    //�û��뿪�������¼��������������û��㲥���뿪
    socket.on('disconnect', function () {
        if (connectionList[socketId].username) {
            socket.broadcast.emit('broadcast_quit', {
                username: connectionList[socketId].username
            });
        }
        delete connectionList[socketId];
    });

    //�û������¼��������������û��㲥�䷢������
    socket.on('say', function (data) {
        socket.broadcast.emit('broadcast_say', {
            username: connectionList[socketId].username,
            text: data.text
        });
    });

    /*emit:����������һ���¼����¼��������ַ�����ʾ�����¼����ƿ����Զ��壬Ҳ��һЩĬ�ϵ��¼����ƣ���������һ�����󣬱�ʾ���socket���͵�����*/
    io.sockets.emit('message', 'new user coming');

    /*on:����һ���¼����¼��������ַ�����ʾ�������������յ��¼����õĻص�����������data���յ�������*/
    socket.on('message', function (data) {
        io.sockets.emit('message', data);
    });

});