jQuery(document).ready(function($) {

	document.getElementById('cuenta').innerHTML = 0;
	document.getElementById('limite').innerHTML = 0;

	$('#reset').click(function(event) {
		socket.send('{"user": "panel", "reset": true}');
	});

	$('#sensor').click(function(event) {
		socket.send('{"user": "panel", "incremento": 1}');
	});

	$('#incrementar').click(function(event) {
		setLimite(1);
	});

	$('#decrementar').click(function(event) {
		setLimite(-1);
	});
});

function setLimite(x) {
	var limite = Number(document.getElementById('limite').innerHTML);
	if (limite == 1 && x == -1) {
		// dejar en cero
	} else if (limite >= 9999 &&  x== 1) {
		// no incrementar
	} else {
		document.getElementById('limite').innerHTML = limite + x;
		var limite = Number(document.getElementById('limite').innerHTML);
		socket.send('{"user": "panel", "limit": "'+ limite +'"}');
	}
}