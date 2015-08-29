sprites = function() {
    var Iconset = function(game, name, path, width, height, iconset_count, scale) {

	// var icons_per_width = 5; // how many icons does it take to fill the width of the board

	//game.load.spritesheet('sushi', 'assets/sushi/sushi_sprite.png', 160, 135);
	game.load.spritesheet(name, path, width, height);


	var icon = function(x, y) {
            var sprite = game.add.sprite(x, y, name);
	    // var scale = game.width / (width * icons_per_width);
	    // console.log("scale:", scale);

	    sprite.scale.set(scale, scale);



	    return sprite;
	};
	var randomframe = function() {
	    console.log("iconset count:", iconset_count, scale);
	    return utils.randint(0, iconset_count);
	};
	return {
	    'icon': icon,
	    'randomframe': randomframe
	}

    }
    
    return {
	'Iconset': Iconset
    }
}();



