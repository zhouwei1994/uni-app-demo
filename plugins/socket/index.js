// 小程序端示例代码
const io = require('./socket.io.dev.js');
let socket = io('http://127.0.0.1:7001', {
    transports: ['websocket']
});
if(!socket.id){
    socket.connect({
        room: 'demo',
        userId: `client_${Math.random()}`,
    });
}
let id = "";
socket.on('connect', function() {
    console.log('connected', socket)
    // 监听自身 id 以实现 p2p 通讯
    id = socket.id;
    socket.on(id, msg => {
        console.log("-----------1", id, msg);
    });
});
socket.on('news', d => {
    console.log('received news: ', d)
});
// 接收在线用户信息
socket.on('online', msg => {
    console.log("-----------2", msg);
});
// 系统事件
socket.on('disconnect', msg => {
    console.log("-----------3", msg);
});
socket.on('disconnecting', () => {
    console.log('#disconnecting');
});
socket.on('error', () => {
    console.log('#error');
});
socket.emit('news', {
    title: 'this is a news'
});
export default socket;