config = {};
iconsets = {};
config.preload_config = function(game) {


    // http://www.veryicon.com/icons/food-drinks/sushi-icon-set/
    // Liquid: Realistic sushi icons
    iconsets.liquid = sprites.Iconset(
	game, 'liquid', 'assets/sushi2/iconsets/liquidshadow2.png', 150, 150, 20, 1);
    iconsets.liquid_small = sprites.Iconset(
	game, 'liquid_small', 'assets/sushi2/iconsets/liquidshadow2.png', 150, 150, 20, 0.5);

    // Assortment: Square section of delicious sushi plates, realistic
    iconsets.assortment = sprites.Iconset(
	game, 'assortment', 'assets/sushi2/iconsets/assortment_150.png', 150, 150, 18, 1);
    iconsets.assortment_small = sprites.Iconset(
	game, 'assortment_small', 'assets/sushi2/iconsets/assortment_150.png', 150, 150, 18, 0.5);

    // http://freedesignfile.com/upload/2014/09/Japan-sushi-design-vector-icons.jpg
    // Round: Drawn sushi, clean circles
    iconsets.round = sprites.Iconset(
	game, 'round', 'assets/sushi2/iconsets/round_150.png', 150, 150, 16, 1);
    iconsets.round_small = sprites.Iconset(
	game, 'round_small', 'assets/sushi2/iconsets/round_150.png', 150, 150, 16, 0.5);


    // Shells: Low color variation, shell fish and tentacles
    iconsets.shells = sprites.Iconset(
	game, 'shells', 'assets/sushi2/iconsets/shells2.png', 103, 97, 9, 1);

    // http://www.veryicon.com/icons/food-drinks/sushi-icon-set/
    // Only black and white icons
    iconsets.nohue = sprites.Iconset(
	game, 'nohue', 'assets/sushi2/iconsets/nohue3.png', 106, 105, 16, 1);


    config.all_iconsets = [
	iconsets.liquid,
	iconsets.liquid_small,
	iconsets.assortment,
	iconsets.assortment_small,
	iconsets.nohue,
    ]

    // // Sushi
    // test icons
    // iconsets.sushi = sprites.Iconset(
    // 	game, 'sushi', 'assets/sushi/sushi_sprite.png', 160, 135, 11, 0.4);
    // iconsets.bobble = sprites.Iconset(
    // 	game, 'bobbles', 'assets/BubbleBobblePlusFoodSpritesheet.png', 33, 33, 83, 1);


}

config.create_config = function(game) {

    config.level_definitions = [
	null, // no 0 level


	// Uniform: Icons are placed uniformly in row, no movement
	// Uniform Swaps: Icons place in grid, swap spaces

	// STAGE 1 (Difficulty 1)
	{'level': levels.uniform, 'count': 4, 
	 'params': [[2, 2]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 9, 
	 'params': [[3, 3, 3]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 16, 
	 'params': [[4, 4, 4, 4]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 25, 
	 'params': [[5,5,5,5,5,]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 36, 
	 'params': [[6,6,6,6,6,6,]], 'iconset': iconsets.liquid},

	{'level': levels.gravity_slow, 'count': 20, 'params':[], 'iconset': iconsets.round},


	// STAGE 2 (Difficulty ..)
	{'level': levels.uniform, 'count': 14, 
	 'params': [[2,3,4,3,2]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 20, 
	 'params': [[4, 4, 4, 4, 4]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 28,
	 'params': [[1, 2, 3, 4, 5, 6, 7]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 44,
	 'params': [[2, 3, 4, 5, 6, 7, 8, 9]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 30, 
	 'params': [[5,5,5,5,5,5]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 45, 
	 'params': [[5, 5, 5, 5, 5, 5, 5, 5, 5]], 'iconset': iconsets.liquid},

	{'level': levels.gravity_slow, 'count': 20, 'params':[], 'iconset': iconsets.liquid},


	// STAGE 3 (Difficulty ..)
	{'level': levels.uniform, 'count': 14, 
	 'params': [[2,3,4,3,2]], 'iconset': iconsets.round},
	{'level': levels.uniform, 'count': 20, 
	 'params': [[4, 4, 4, 4, 4]], 'iconset': iconsets.round},
	{'level': levels.uniform, 'count': 28,
	 'params': [[1, 2, 3, 4, 5, 6, 7]], 'iconset': iconsets.liquid},
	{'level': levels.uniform, 'count': 44,
	 'params': [[2, 3, 4, 5, 6, 7, 8, 9]], 'iconset': iconsets.round_small},
	{'level': levels.uniform, 'count': 30, 
	 'params': [[5,5,5,5,5,5]], 'iconset': iconsets.round_small},
	{'level': levels.uniform, 'count': 45, 
	 'params': [[5, 5, 5, 5, 5, 5, 5, 5, 5]], 'iconset': iconsets.round_small},



	// STAGE 4 (Difficulty ..)
	{'level': levels.uniform, 'count': 18,
	 'params': [[3,3,3,3,3,3]], 'iconset': iconsets.shells},
	{'level': levels.uniform, 'count': 36,
	 'params': [[4,4,4,4,4,4,4,4,4]], 'iconset': iconsets.shells},
	{'level': levels.uniform, 'count': 44,
	 'params': [[2, 3, 4, 5, 6, 7, 8, 9]], 'iconset': iconsets.shells},
	{'level': levels.uniform, 'count': 28,
	 'params': [[1, 2, 3, 4, 5, 6, 7]], 'iconset': iconsets.shells},
	{'level': levels.uniform, 'count': 30, 
	 'params': [[5,5,5,5,5,5]], 'iconset': iconsets.shells},


	// STAGE .. (Difficulty: 7)
	{'level': levels.uniform_swaps, 'count': 72, 'params': [[6,6,6,6,6,6,6,6,6,6,6,6]], 'iconset': iconsets.liquid},

	{'level': levels.uniform_swaps, 'count': 144, 'params': [[12,12,12,12,12,12,12,12,12,12,12,12]], 'iconset': iconsets.liquid},

	{'level': levels.uniform_swaps, 'count': 144, 'params': [[12,12,12,12,12,12,12,12,12,12,12,12]], 'iconset': iconsets.liquid_small},

	{'level': levels.uniform_swaps, 'count': 180, 'params': [[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]], 'iconset': iconsets.liquid_small},

	{'level': levels.uniform_swaps, 'count': 216, 'params': [[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]], 'iconset': iconsets.liquid_small},

	// STAGE .. (Difficulty: 10)
	{'level': levels.uniform_swaps, 'count': 16, 'params': [[4,4,4,4]], 'iconset': iconsets.nohue},
	{'level': levels.uniform_swaps, 'count': 36, 'params': [[6,6,6,6,6,6]], 'iconset': iconsets.nohue},
	{'level': levels.uniform_swaps, 'count': 72, 'params': [[6,6,6,6,6,6,6,6,6,6,6,6]], 'iconset': iconsets.nohue},


	{'level': levels.uniform_swaps, 'count': 144, 'params': [[12,12,12,12,12,12,12,12,12,12,12,12]], 'iconset': iconsets.nohue},

	// TODO: nohue small
	// {'level': levels.uniform_swaps, 'count': 144, 'params': [[12,12,12,12,12,12,12,12,12,12,12,12]], 'iconset': iconsets.nohue_small},

	// {'level': levels.uniform_swaps, 'count': 180, 'params': [[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]], 'iconset': iconsets.nohue_small},

	// {'level': levels.uniform_swaps, 'count': 216, 'params': [[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]], 'iconset': iconsets.nohue_small}

    ];
    //config.level_definitions = [];


};

config.get_level = function(level_number) {
    var level = config.level_definitions[level_number];
    if(level) {
	return level;
    } else {
	return config.default_level(level_number);
    }
};

config.default_level = function(level_number)  {
    var icons = utils.randchoice(config.all_iconsets);
    return {'level': levels.horizontal_slide, 'count': level_number*2, 'iconset': icons};

    return {'level': levels.uniform, 'count': 4, 
	    'params': [[1, 1,1,1]], 'iconset': iconsets.liquid};
}


console.log("config:", config);
