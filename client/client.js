var socket = io.connect('http://localhost:3088');
socket.on('message', function (data) {
});
$('form').submit(function () {
    socket.emit('message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

socket.emit('join', {
    username: 'Username hehe'
});

//�յ����������ҹ㲥����ʾ��Ϣ
socket.on('broadcast_join', function (data) {
    console.log(data.username + '������������');
});

//�յ��뿪�����ҹ㲥����ʾ��Ϣ
socket.on('broadcast_quit', function (data) {
    console.log(data.username + '�뿪��������');
});

//�յ����˷��͵���Ϣ����ʾ��Ϣ
socket.on('broadcast_say', function (data) {
    console.log(data.username + '˵: ' + data.text);
});

//�������Ǽ�����һ���ı���textarea��һ�����Ͱ�ť.btn-send
//ʹ��jQuery���¼�
$('.btn-send').click(function (e) {
    //��ȡ�ı�����ı�
    var text = $('textarea').val();
    //�ύһ��say�¼����������յ��ͻ�㲥
    socket.emit('say', {
        username: 'Username hehe',
        text: text
    });
});