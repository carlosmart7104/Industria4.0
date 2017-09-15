var WebSocketServer = require('ws').Server;

var limit= 3;
var cuenta = 0;

var WebSocketsService = function (app) {

	var wss = new WebSocketServer({server: app});

	wss.broadcast = function(data, ws) {
	  wss.clients.forEach(function(client) {
	    if (client != ws) { // sending to all clients except sender
	      client.send(data);
	    }
	  });
	}

	wss.broadcastAll = function(data) {
	  wss.clients.forEach(function(client) {
	    client.send(data);
	  });
	}

	wss.broadcastAndResponse = function(data, res, ws) {
	  wss.clients.forEach(function(client) {
	    if (client != ws) { // sending to all clients except sender
	      client.send(data);
	    } else {
	    	// response
	    	client.send(res);
	    }
	  });
	}

	wss.on('connection', function(ws) {

	  console.log('new client');

	  ws.on('message', function (msg) {
	    console.log("msg: "+msg);
	    if (isJSON(msg)) { 
    		//console.log("Es un JSON");
			var data = JSON.parse(msg);
    		if (data.user != undefined) {
    			if (data.user == 'panel') {
	    			// datos enviados desde el panel
	    			if (data.limit != undefined) {
	    				limit = data.limit;
	    				//console.log('limit: '+limit);
	    				ws.send(data.limit);
	    			} else if (data.reset == true) {
	    				cuenta = 0;
	    				//console.log('cuenta: '+cuenta);
	    				ws.send('{"user":"host", "cuenta": 0}');
	    			} else if (data.onload != undefined) {
	    				ws.send('{"user":"host", "cuenta": '+cuenta+'}');
	    				ws.send('{"user":"host", "limit": '+limit+'}');
	    			}
	    			if (data.incremento != undefined) {
	    				cuenta += data.incremento;
	    				if (cuenta > limit) {
	    					// limite alcanzado
	    					//console.log('limite alcanzado');
	    					cuenta = 1;
	    					//wss.broadcastAll('{"user":"host", "cuenta": '+cuenta+'}');
	    				}
	    				//console.log('cuenta: '+cuenta);
	                    wss.broadcastAll('{"user":"host", "cuenta": '+cuenta+'}');
	    			}
	    		} else if (data.user == 'proceso') {
	    			// datos enviados desde el proceso
	    			if (data.incremento != undefined) {
	    				cuenta += data.incremento;
	    				if (cuenta > limit) {
	    					// limite alcanzado
	    					console.log('limite alcanzado');
	    					cuenta = 1;
	    					//wss.broadcastAndResponse('{"user":"host", "cuenta": '+cuenta+'}', '1', ws);
	    					wss.broadcastAndResponse('{"user":"host", "cuenta": '+cuenta+'}', '0', ws);
	    				} else if (cuenta == limit) {
	    					
	    					wss.broadcastAndResponse('{"user":"host", "cuenta": '+cuenta+'}', '1', ws);
	    				} else {
	    					wss.broadcastAndResponse('{"user":"host", "cuenta": '+cuenta+'}', '0', ws);
	    				}
	    			}
	    		} else {
	    			// no hay datos
	    			console.log('ws: Mensaje vacio');
	    		}
    		} else {

    		}
    	} else {
    		console.log("No es JSON");
    	}
    		
	  });

	  ws.on('close', function() {
	    console.log('close');
	  });

	});

}

function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports = WebSocketsService;