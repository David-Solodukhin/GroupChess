var express = require("express"),
app = express(),
server = require("http").createServer(app),
io = require("socket.io").listen(server);
server.listen(8000);
app.use(express.static(__dirname + '/'));
app.get('/',function(req,res){
	res.sendfile(__dirname + "/index.html");
});

var players = [];
var position = "start";
var Wvotes = {};
var Bvotes = {};
var maxPlayers = 4;
//var chess = new Chess();
io.sockets.on("connection",function(socket){
//var side = Math.floor((Math.random() * 4) + 1);
var side = "w";
	//console.log(side);
	
	
   
    
   if(players.length<maxPlayers)
   {
   
   
	 players.push({
        id: socket.id,
		position: position
	});
	}
	if(players.length<3)
	{
	io.sockets.emit("init","w");
	}
	else
	{
	io.sockets.emit("init","b");
	}
	
	if(players.length==4)
	{
	io.sockets.emit("start","420");
	}
	
	
	
	console.log("a client has connected: " + socket.id);
    
    socket.on("update",function(data){
	console.log(data);
      
	//	this.position = data.position;
	//	votes[data.vote] = (votes[data.vote] ? votes[data.vote]+1:1);
	//	var newData = {position:data.position,votes:votes};
	//	io.sockets.emit("update",newData);
	
		if(data.side=='w')
		{
		Wvotes[data.vote] = (Wvotes[data.vote] ? Wvotes[data.vote]+1:1);
		var newData = {position:data.position,Wvotes:Wvotes,side:"w"};
		io.sockets.emit("update",newData);
		var total = 0;
		for (var key in Wvotes) {
		total+=Wvotes[key];
		console.log(total);
		}
			if(Object.keys(Wvotes).length==players.length*.5 || total==players.length*.5)
			{
			var candidate;
			var maxVal = 0;
			for(var key in Wvotes)
			{
			if(Wvotes[key]>maxVal)
				{
				maxVal = Wvotes[key];
				candidate = key;
			    }
			}
			console.log(candidate+"something is wrong");
			//chess.move({ from: candidate.substring(0,3), to: candidate.substring(4)});
			io.sockets.emit("boardUpdateRequest",{side:"w",candidate:candidate});
			socket.on("boardUpdateReceive",function(data){
			newData.position=data;
			});
			//newData.position = chess.fen();
			io.sockets.emit("boardUpdate",newData);
			Wvotes = {};
			}
		}
		else
		{
		Bvotes[data.vote] = (Bvotes[data.vote] ? Bvotes[data.vote]+1:1);
		var newData = {position:data.position,Bvotes:Bvotes,side:"b"};
		io.sockets.emit("update",newData);
		var total = 0;
		for (var key in Bvotes) {
		total+=Bvotes[key];
		console.log(total);
		}
			if(Object.keys(Bvotes).length==players.length*.5 || total==players.length*.5)
			{
			var candidate;
			var maxVal = 0;
			for(var key in Bvotes)
			{
			if(Bvotes[key]>maxVal)
				{
				maxVal = Bvotes[key];
				candidate = key;
			    }
			}
			console.log(candidate);
			//chess.move({ from: candidate.substring(0,3), to: candidate.substring(4)});
			io.sockets.emit("boardUpdateRequest",{side:"b",candidate:candidate});
			socket.on("boardUpdateReceive",function(data){
			newData.position=data;
			});
			//newData.position = chess.fen();
			io.sockets.emit("boardUpdate",newData);
			Bvotes = {};
			}
		}
	
	
	
	
	});
	
	
	
	
	
    socket.on("disconnect",function(){
        console.log("a client has disconnected: " + socket.id);
        for(var i = 0; i<players.length;i++){
            if(players[i].id == socket.id){
                players.splice(i,1);
            }
        }
    });
});


function updateSnakes(){
    for(var i = 0;i<players.length;i++)
	{
	
	}
}

