var express = require('express');
var app = express();
var mongoose = require('mongoose'); //mongoDB
var morgan = require('morgan'); //log requests to console
var bodyParser = require('body-parser'); //get information from html POST
var methodOverride = require('method-override'); //simulate DELETE and PUT
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var database = require('./config/database');
mongoose.connect(database.url, database.options);

var UserController = require('./public/js/user/Users');
app.use('/users', UserController);

var Authenticate = require('./public/js/auth/Authenticate');
app.use('/api/auth', Authenticate);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

var todoSchema = mongoose.Schema({
	text: String,
	added: Number,
	done: Boolean
});
var Todo = mongoose.model('Todo', todoSchema);

io.sockets.on('connect', function(socket) {
	console.log('a user connected');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});

	socket.on('load-todos', function() {
		Todo.find(function(err, todos) {
			if (err) console.log('fuck');

			socket.emit('update-todos', todos);
		});
	});
	socket.on('remove-todo', function(id) {
		console.log(id);
		Todo.remove(
			{
				_id: id
			},
			function(err, todo) {
				if (err) console.log('fuck');

				Todo.find(function(err, todos) {
					if (err) console.log('fuck');

					socket.broadcast.emit('update-todos', todos);
				});
			}
		);
	});
	socket.on('add-todo', function(text) {
		Todo.create(
			{
				text: text,
				added: new Date().getTime(),
				done: false
			},
			function(err, todo) {
				if (err) console.log('fuck');

				Todo.find(function(err, todos) {
					if (err) console.log('fuck');

					socket.emit('update-todos', todos);
					socket.broadcast.emit('update-todos', todos);
				});
			}
		);
	});
	socket.on('switch-todo', function(id) {
		Todo.findById(id, function(err, todo) {
			if (err) console.log('fuck');

			todo.done = !todo.done;
			todo.save(function(err, updatedTodo) {
				if (err) console.log('fuck');

				Todo.find(function(err, todos) {
					if (err) console.log('fuck');

					socket.broadcast.emit('update-todos', todos);
				});
			});
		});
	});
	socket.on('change-todo', function(data) {
		console.log(data.text);
		if (data.changeText != '') {
			Todo.findById(data.id, function(err, todo) {
				if (err) throw err;
				todo.text = data.changeText
					.replace(/&nbsp;/gi, '')
					.replace(/<br\s*[\/]?>/gi, '')
					.replace(/&amp;/g, '&')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>');
				todo.save(function(err, todo) {
					if (todo) {
						Todo.find(function(err, todos) {
							if (err) console.log('fuck');

							socket.broadcast.emit('update-todos', todos);
						});
					}
				});
			});
		} else if (data.changeText == '') {
			Todo.remove(
				{
					_id: data.id
				},
				function(err, todo) {
					if (err) console.log('fuck');

					Todo.find(function(err, todos) {
						if (err) console.log('fuck');

						io.emit('update-todos', todos);
					});
				}
			);
		}
	});
});

// app.get('/', function(req, res) {
// 	res.sendFile(path.join(__dirname, './public/pages', 'index.html'));
// });

app.get('*', function(req, res) {
  res.sendfile(path.join('./public/pages','index.html'));
})

http.listen(9090);
console.log('app listening on 9090!');
