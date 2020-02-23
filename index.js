var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var fs = require('fs')

let path = './data.json'

// existing file checking
try {
	if (fs.existsSync(path)) {
		console.log(path, 'Exists')
	}
	else {
		// create a json file 
		console.log('Create JSON file ', path)
		let writeFile = { "chat": [] }
		fs.writeFile(path, JSON.stringify(writeFile), 'utf-8', function (err) {
			if (err) throw err
		})
	}
} 
catch (err) {
	console.log(err)
}

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
})

// socket.io 
io.on('connection', function (socket) {
	console.log(socket.id + " Connected")

	socket.on('chat message', function (data) {
		console.log(socket.id + " " + data.name + ': ' + data.msg);

		// write data to file
		writeToLocalFiles(data, socket.id)

		io.emit('chat message', {
			data: data,
			senderId: socket.id
		})
	})

	socket.on('disconnect', function () {
		console.log('user disconnected')
	})
})

function writeToLocalFiles(data, id) {
	let readFileData = fs.readFileSync(path);
	let readChatData = JSON.parse(readFileData)
	readChatData.chat.push({
		data: data,
		senderId: id
	})
	fs.writeFile(path, JSON.stringify(readChatData), 'utf-8', function (err) {
		if (err) throw err
		// console.log('Done!')
	})
}


http.listen(3000, function () {
	console.log('listening on localhost:3000')
});