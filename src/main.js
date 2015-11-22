//@program

var TILESIZE = 20;

var NUMROWS = 10;
var NUMCOLS = 10;

var getSkinsArray = function(...colors){
	var result = new Array();
	colors.forEach(color => {result.push(
		new Skin({fill: color, borders: {left:1, right:1, top:1, bottom:1}, stroke: "black"})
	)});
	return result;
}

var whiteSkin = new Skin("white");
var clearSkin = getSkinsArray("yellow")[0];
var paintSkins = getSkinsArray("#1f78b4", "#33a02c", "#e31a1c", "#ff7f00", "#ff7f00", "#b2df8a", "#fb9a99", "#fdbf6f", "#cab2d6");
var NUMSTATES = paintSkins.length;

class TileBehavior extends Behavior {
	onCreate(content, data){
		this.tile = data;
		content.skin = clearSkin;
		this.state = -1;
	}

	onTouchBegan(content){
		this.tile.incrementState();
	}

	updateColor(content){
		if (this.tile.state == -1){
			content.skin = clearSkin;
		}else{
			content.skin = paintSkins[this.tile.state];
		}
	}
}

var ParkTile = Container.template($ => ({
	left: 0, top: 0, active: true, right: 0, bottom: 0, //width: TILESIZE, height: TILESIZE,
	Behavior: TileBehavior
}));


class Tile{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.state = -1;

		this.content = new ParkTile(this);
	}

	incrementState(){
		this.state++;
		if (this.state >= NUMSTATES) this.state = -1;
		this.content.delegate("updateColor");
	}

	setState(state){
		this.state = state;
		this.content.delegate("updateColor");
	}
}

var mainColumn = new Column({skin: whiteSkin, top:0, right:0, bottom:0, left:0});
application.add(mainColumn);

var tiles = new Array();

for (let y = 0; y < NUMROWS; y++){
	let row = new Line({left: 0, right: 0, top: 0, bottom: 0});
	for (let x = 0; x < NUMCOLS; x++){
		let mytile = new Tile(x, y);
		tiles.push(mytile);
		row.add(mytile.content);
	}
	mainColumn.add(row);
}
