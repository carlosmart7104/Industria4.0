var socket = new WebSocket('ws://localhost:8080/');

socket.onopen = function (event) {
	console.log('open WebSocket');
	var limite = 0;
	socket.send('{"user": "panel", "onload": true}');
}

socket.onmessage = function (msg) {
	var data = JSON.parse(msg.data);
	if (data.user == 'host') {
		if (data.limit != undefined) {
			document.getElementById('limite').innerHTML = data.limit;
		} else if (data.cuenta != undefined) {
			//console.log(data.cuenta);
			document.getElementById('cuenta').innerHTML = data.cuenta;
		}
	}
}

socket.onclose = function (event) {
	console.log('closed WebSocket');
}