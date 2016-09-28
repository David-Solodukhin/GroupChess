$(document).ready(function() {
    var socket = io.connect();
    var chess = new Chess();
    var illegal = false;
    var side = "q";
    var votes = {};
    var players = 1;
	
	
	
    socket.on("init", function(data) {
	   if(side =="q"){side = data;console.log("here");}
	  
	   players++;
	   console.log(players);
    });
    socket.on("start", function(data) {
	document.getElementById('board1').style.display = ' block ';
	document.getElementById('labelText1').style.display = ' block ';
	document.getElementById('loader').style.display = ' none  ';
	console.log(side);
	});
    
    var onMoveEnd = function(source, target, piece, newPos, oldPos, orientation) {
        
        
        var Move1 = "";
        var Move2 = "";
        
        for (var variable in oldPos) {
            
            if (typeof newPos[variable] === 'undefined') 
            {
                Move1 = variable;
            
            }
        }
        
        for (var variable in newPos) {
            if (newPos[variable] != oldPos[variable]) 
            {
                Move2 = variable;
            }
        }
        console.log(Move1.toString() + " " + Move2.toString());
        if (chess.turn() != side || chess.move({
            from: Move1.toString(),
            to: Move2.toString()
        }) == null ) //put converse if something goes wrong too
        {
            console.log("illegal");
            return 'snapback';
        } 
        else 
        {
            var data = {
                position: chess.fen(),
                vote: (Move1 + "->" + Move2),
				side: side
            };
            socket.emit("update", data);
        }
    
    }
    ;
    
    
    var board1 = ChessBoard('board1', {draggable: true,position: 'start',onDrop: onMoveEnd,});
    
    
    socket.on("update", function(data) {
	console.log(data);
       /* board1.position(data.position, true)
        chess = new Chess(data.position);
        this.votes = data.votes;
        var frequencyTable = '';
        for (var move in this.votes) {
            frequencyTable += move + ': ' + this.votes[move] + '<br/>';
        }
        document.getElementById('moves').innerHTML = frequencyTable;
        console.log(chess.fen());
        console.log(side);
		*/
		
	
        if(side=="w")
		{
		this.votes = data.Wvotes;
		}
		else
		{
		this.votes = data.Bvotes;
		}
        var frequencyTable = '';
        for (var move in this.votes) {
            frequencyTable += move + ': ' + this.votes[move] + '<br/>';
        }
        document.getElementById('moves').innerHTML = frequencyTable;
      //  console.log(chess.fen());
       // console.log(side);
		
		
		
    });
     socket.on("boardUpdate", function(data) {
	    board1.position(data.position, true)
        chess = new Chess(data.position);
	 });
	 socket.on("boardUpdateRequest", function(data) {
	    if(side!=data.side)
		{
	    var chessTemp = new Chess(chess.fen());
        chessTemp.move({ from: data.candidate.substring(0,3), to: data.candidate.substring(4)});
		socket.emit("boardUpdateReceive", chessTemp.fen());
		}
		else{
		document.getElementById('p1').innerHTML = "Next Move Candidates, Last Move chosen: "+data.candidate;
		}
	 });
    
    
    function getOwnSnake(players) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == socket.id) {
                return players[i];
            }
        }
    }
});
