const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3000);

// 开始webscoket服务
const webscoket = require('ws');
const ws = new webscoket.Server({ port: 8080 });

//  当客户端连接进服务器时，触发这个事件
// ws.on('connection', client => {
  //webscoket服务端通过client.on('message', data=>{})来接受前端页面（客户端）传来的数据
  //clien就是连接的对象
  // client.on('message', data => {
  //   console.log(data);
  // })
// });


// 简易聊天室的实现
  // 定义一个存储当前聊天室中所有的客户端对象
  let clients = {
    // key - 标识
    // value - 某个客户端对象
    // key: value
  };
let index = 0;
ws.on('connection', client => {
  console.log('客户端连接了')
  //将连接的以用存起来
  clients[++index] = client;
  // 当有用户连接时，主动向其他人发送请求，欢迎
  sendMsg(client, `欢迎${index}加入聊天室`)

  client.on('message', data => {
    sendMsg(client, {
      name: index,
      msg: data
    })
  });

  // 处理异常
  client.on('error', error => {
    delete clients[index];
  });

  // 处理关闭
  client.on('close', error => {
    delete clients[index];
    sendMsg(client, `${index}退出了聊天室`)
  })

});


/**
 * 给其他客户端发送消息
 * @param {Object} client 当前要排除在外的客户端
 * @param {String} msg 要发送的信息
 */
const sendMsg = (client,msg) => {
  for (key in clients) {
    let item =clients[key];
    if (item != client) {
      // 向改用户发送欢迎新人的提示
      item.send(JSON.stringify(msg));
    }
  }
}
