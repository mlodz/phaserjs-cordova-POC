initialize_hunter = function() {

    initialize_adinterface();


    var icons = [];
    var target_display;
    var pause_play_button;
    var play_is_active = false;

    // We disable clicking too quickly.
    // This is because of lag. If the game lags, multiple clicks queue up and register all at once, so
    // we only want to take one click.
    var click_cooldown = false;
    var click_cooldown_ms = 200;

    var is_second_life = false;

    var is_paused = false;
    var pause_screen;
    var is_pause_transition = false;

    var level = 0;
    var score = 0;
    var scoreText;

    var debug_mode = true;

    var time_text;
    var level_text;
    var high_score_text;

    var high_score;
    var previous_high_score;
    var storage = window.localStorage;
    var header_height = 100;

    var current_iconset;

    /*
      Moto X is 360 x 567?

      567 height
      Game Over screen
      - logo 200
      - final score 100
      - Keep Going - 100
      - New Game - 100
      - Ad - 50

    */

    var game_width = $(window).width();
    var game_height = $(window).height() - AdInterface.bottom_banner_height;

    console.log("start_cordova_game: " + game_width + ", " + game_height);


    // Yes, game is global
    game = new Phaser.Game(game_width, game_height, Phaser.CANVAS, '', {preload: preload, create: create, update: update});

    var initial_game_time = 10;
    var second_life_game_time = 15;
    var time_penalty = -5;
    var time_gift = 3;
    var timer = null;

    var penalty_sound;
    var click_target_sound;
    var game_over_sound;

    var update_level = function(){};
    var clear_level = function(){};

    var level_definitions = [];

    function preload() {

	game.load.audio('penalty', 'assets/Breaking_glass_light_29.wav');
	game.load.audio('click_target', 'assets/Sweep5.wav');

	// game.load.audio('meow', ['assets/cat.m4a', 'assets/cat.ogg']);
	// game.load.audio('meow', [
	//     // "http://dl.dropbox.com/u/1538714/article_resources/cat.m4a",
	//     // "http://dl.dropbox.com/u/1538714/article_resources/cat.ogg",
	//     'assets/cat.m4a',
	//     'assets/cat.ogg',

	//     'audio/bleed.wav',
	//     'audio/sound2.mp3',
	//     'audio/die.ogg'
	    
	// ]);


	game.load.audio('game_over', 'assets/No_Score_1.wav');

	// New Graphics (sushi2)
	game.load.image('home-screen', 'assets/sushi2/background.jpg');
	game.load.image('logo', 'assets/sushi2/logo2.png');
	game.load.image('high-score', 'assets/sushi2/high-score.png');
	game.load.image('keep-going', 'assets/sushi2/keep-going.png');
	game.load.image('sky-header', 'assets/sushi2/sky-header2.png');
	game.load.image('pause-background', 'assets/sushi2/pause-background.png');


	 // Frames (240x80)-- "KEEP GOING?", "NEW GAME", "CONTINUE"
	game.load.spritesheet('buttons', 'assets/sushi2/buttons.png', 240, 80);


	// http://www.veryicon.com/icons/food-drinks/sushi-icon-set/
	liquid_iconset = sprites.Iconset(
	    game, 'liquid', 'assets/sushi2/iconsets/liquidshadow2.png', 150, 150, 20, 1);
	liquid_small_iconset = sprites.Iconset(
	    game, 'liquid_small', 'assets/sushi2/iconsets/liquidshadow2.png', 150, 150, 20, 0.5);

	assortment_iconset = sprites.Iconset(
	    game, 'assortment', 'assets/sushi2/iconsets/assortment_150.png', 150, 150, 18, 1);

	assortment_small_iconset = sprites.Iconset(
	    game, 'assortment_small', 'assets/sushi2/iconsets/assortment_150.png', 150, 150, 18, 0.5);

	// http://freedesignfile.com/upload/2014/09/Japan-sushi-design-vector-icons.jpg
	round_iconset = sprites.Iconset(
	    game, 'round', 'assets/sushi2/iconsets/round_150.png', 150, 150, 16, 1);
	round_small_iconset = sprites.Iconset(
	    game, 'round_small', 'assets/sushi2/iconsets/round_150.png', 150, 150, 16, 0.5);


	shells_iconset = sprites.Iconset(
	    game, 'shells', 'assets/sushi2/iconsets/shells2.png', 103, 97, 9, 1);

	// http://www.veryicon.com/icons/food-drinks/sushi-icon-set/
	nohue_iconset = sprites.Iconset(
	    game, 'nohue', 'assets/sushi2/iconsets/nohue3.png', 106, 105, 16, 1);

	sushi_iconset = sprites.Iconset(
	    game, 'sushi', 'assets/sushi/sushi_sprite.png', 160, 135, 11, 0.4);
	bobble_iconset = sprites.Iconset(
	    game, 'bobbles', 'assets/BubbleBobblePlusFoodSpritesheet.png', 33, 33, 83, 1);



	//game.load.image('sky', 'assets/sky.png');
	//game.load.image('sky', 'assets/sushi/khaki-texture.jpg');

	//game.load.image('blue-tile', 'assets/sushi/blue-square.png');
	game.load.image('blue-tile', 'assets/sushi/ultramarine-texture.jpg');
	//game.load.image('home-screen', 'assets/sushi/home-screen-2.png');

	game.load.spritesheet('pause-play', 'assets/sushi/pause_play_stop_black.png', 69, 67);

	game.load.spritesheet('lifelines', 'assets/sushi/lifelines3.png', 100, 100);

	game.load.spritesheet('score-pops', 'assets/sushi/score-pops.png', 140, 100);

	game.load.image('game-over-screen', 'assets/sushi/game-over-screen-2.png');
	game.load.spritesheet('play-button', 'assets/sushi/play-button.png', 132, 50);
	//spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing) → {Phaser.Loader}
	//game.load.spritesheet('icons', 'assets/BubbleBobblePlusFoodSpritesheet.png', 33, 33);

	// http://www.watiworks.com/wp-content/uploads/2013/icon_shots/Sushi.png
	//game.load.spritesheet('sushi', 'assets/sushi/sushi_sprite.png', 160, 135);


	sushi_iconset = sprites.Iconset(game, 'sushi', 'assets/sushi/sushi_sprite.png', 160, 135, 11, 0.4);
	bobble_iconset = sprites.Iconset(game, 'bobbles', 'assets/BubbleBobblePlusFoodSpritesheet.png', 33, 33, 83, 1);




    }

    function set_level(level) {
	level_text.text = "Level: " + level;
    }

    function create() {

	// THIS IS DEBUG
	if(debug_mode) {
	    game.time.advancedTiming = true;
	}

	AdInterface.create_banner();

	// Pause the game and hide the screen when lose focus
	game.onPause.add(function() { on_pause(true);}, this);


	initialize_levels(game, game_width, game_height, header_height);
	initialize_lifelines(game, game_width, game_height, header_height);

	penalty_sound = game.add.audio('penalty');

	click_target_sound = game.add.audio('click_target');

	game_over_sound = game.add.audio('game_over')

	high_score = storage.getItem("high_score") || 0;
	previous_high_score = high_score;

	game.physics.startSystem(Phaser.Physics.ARCADE);

	
	

	// Add gameplay background, including header
	var sky = game.add.sprite(game.world.centerX, 0, "sky-header");
	sky.anchor.set(0.5, 0);
	sky.inputEnabled = true;
	sky.events.onInputDown.add(on_click_sky, this);

	//var tile = game.add.tileSprite(0, 0, game_width, 100, "blue-tile");

	//pause_play_button = game.add.sprite(game_width - 70, 0, 'pause-play');
	pause_play_scale = 0.7
	pause_play_button = game.add.sprite(10, 10, 'pause-play');
	// pause_play_button.width = 60;
	// pause_play_button.height = 60;
	pause_play_button.scale.set(pause_play_scale, pause_play_scale);
	pause_play_button.frame = 0;
	pause_play_button.anchor.setTo(0.5, 0.5);
	pause_play_button.x = game_width - (69*pause_play_scale/2) - 10;
	pause_play_button.y = (69*pause_play_scale/2) + 10
	pause_play_button.inputEnabled = true;
	pause_play_button.events.onInputDown.add(on_click_pause, this);

	animations.open_bobble(pause_play_button, pause_play_scale);

	show_main_menu();


	default_level_definition = {'level': levels.scattered, 'count': function(lev){ return lev*5;}, 'params': []};

	level_definitions = [

	    null, // there is no 0 level



	    {'level': levels.uniform, 'count': 4, 'params': [[2, 2]]},

	    
	    {'level': levels.uniform, 'count': 4, 'params': [[2, 2]]},
	    {'level': levels.uniform, 'count': 8, 'params': [[4, 4]]},
	    {'level': levels.uniform, 'count': 16, 'params': [[4, 4, 4, 4]]},
	    {'level': levels.uniform, 'count': 32, 'params': [[2, 6, 6, 6, 6, 6]]},
	    null,

	    {'level': levels.uniform_swaps, 'count': 36, 'params': [[6,6,6,6,6,6]]},
	    {'level': levels.uniform_swaps, 'count': 36, 'params': [[6,6,6,6,6,6]]},
	    {'level': levels.uniform_swaps, 'count': 64, 'params': [[8,8,8,8,8,8,8,8]]},
	    {'level': levels.uniform_swaps, 'count': 64, 'params': [[8,8,8,8,8,8,8,8]]},
	    {'level': levels.uniform_swaps, 'count': 128, 'params': [[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]]},
	    {'level': levels.uniform_swaps, 'count': 128, 'params': [[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]]},

	    {'level': levels.gravity_slow, 'count': 20, 'params':[]},
	    {'level': levels.gravity_slow, 'count': 40, 'params':[]},
	    {'level': levels.gravity_slow, 'count': 60, 'params':[]},
	    {'level': levels.gravity_slow, 'count': 80, 'params':[]},
	    {'level': levels.rotate, 'count': 90, 'params': []},

	    null,
	    null,
	    null,
	    null,


	    {'level': levels.horizontal_slide, 'count': 60, 'params': []},
	    {'level': levels.horizontal_slide, 'count': 120, 'params': []},
	    {'level': levels.horizontal_slide, 'count': 180, 'params': []},
	    {'level': levels.rotate, 'count': 90, 'params': []},
	    null,



	    {'level': levels.horizontal_slide, 'count': 60, 'params': []},
	    {'level': levels.horizontal_slide, 'count': 120, 'params': []},
	    null,
	    {'level': levels.horizontal_slide, 'count': 180, 'params': []},
	    null,

	    {'level': levels.gravity_standard, 'count': 30, 'params':[]},
	    {'level': levels.gravity_standard, 'count': 60, 'params':[]},
	    null,
	    {'level': levels.gravity_standard, 'count': 120, 'params':[]},
	    null,

	    {'level': levels.horizontal_slide, 'count': 60, 'params': []},
	    {'level': levels.horizontal_slide, 'count': 120, 'params': []},
	    null,
	    {'level': levels.horizontal_slide, 'count': 180, 'params': []},
	    null,

	    {'level': levels.gravity_fast, 'count': 40, 'params':[]},
	    {'level': levels.gravity_fast, 'count': 80, 'params':[]},
	    null,
	    {'level': levels.gravity_fast, 'count': 160, 'params':[]},
	    null,

	    {'level': levels.uniform_swaps, 'count': 16, 'params': [[4,4,4,4]]},
	    {'level': levels.uniform_swaps, 'count': 32, 'params': [[8,8,8,8]]},
	    {'level': levels.uniform_swaps, 'count': 64, 'params': [[8,8,8,8,8,8,8,8]]},
	    {'level': levels.uniform_swaps, 'count': 64, 'params': [[8,8,8,8,8,8,8,8]]},
	    {'level': levels.uniform_swaps, 'count': 128, 'params': [[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]]},
	    null,

	    {'level': levels.uniform_swaps, 'count': 128, 'params': [[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]]},
	    {'level': levels.uniform_swaps, 'count': 256, 'params': [[16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16]]},
	    {'level': levels.uniform_swaps, 'count': 256, 'params': [[16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16]]},
	    {'level': levels.uniform_swaps, 'count': 256, 'params': [[16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16]]},
	    {'level': levels.uniform_swaps, 'count': 256, 'params': [[16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16]]},

	];

    }

    // function resizeGame() {
    // 	var height = $(window).height();
    // 	var width = $(window).width();
	
    // 	game_width = width - 40;
    // 	game_height = height - 40;

    // 	game.width = width;
    // 	game.height = height;
    // 	game.stage.bounds.width = width;
    // 	game.stage.bounds.height = height;
	
    // 	if (game.renderType === Phaser.WEBGL)
    // 	{
    // 	    game.renderer.resize(width, height);
    // 	}
    // }



    function begin_game(level, time) {

	// prepare at beginning of a game level
	AdInterface.prepare_interstitial();

	console.log("sylvanlake");


	timer = utils.Timer(time);
	leveler = utils.Leveler(level);

	if(!time_text) {
	    time_text = game.add.text(16, 10, 'Time: ', { font: 'bold 26px Arial', fill: '#000' });
	}
	if(!level_text) {
	    level_text = game.add.text(16, 40, 'Level: ', { font: 'bold 20px Arial', fill: '#000' });
	}
	if(!high_score_text) {
	    high_score_text = game.add.text(16, 64, 'High Score: ', { font: 'bold 16px Arial', fill: '#000' });
	}

	previous_high_score = high_score;

	setup_level();
    }

    function end_game() {

	destroy_pause_screen();
	play_is_active = false;

	//game_over_sound.play()

	timer = null;

	// For all icons (except the target)
	for(var i=1; i < icons.length; i++) {
	    animations.explode_icon(icons[i]);
	}
	var target_icon = icons[0];
	if(target_icon.body) {
	    target_icon.body.velocity.x = 0;
	    target_icon.body.velocity.y = 0;
	}

	var timeout;
	timeout = setTimeout(function() {
	    destroy_level();

	    //show_main_menu();
	    show_game_over();

	}, 1000);

    }


    function setup_level() {
	play_is_active = true;
	var icon_count;


	var level = leveler.incr();
	set_level(level);
	if(level > high_score) {
	    high_score = level;
	    storage.setItem("high_score", high_score);
	}
	high_score_text.text = "High Score: " + high_score;

	level_definition = level_definitions[level]
	if(!level_definition) {
	    level_definition = default_level_definition;
	}

	if(_.isFunction(level_definition.count)) {
	    icon_count = level_definition.count(level);
	} else {
	    icon_count = level_definition.count;
	}



	var iconsets = [
	    liquid_iconset,
	    liquid_small_iconset,
	    assortment_iconset,
	    assortment_small_iconset,
	    round_iconset,
	    round_small_iconset,

	    // shells_iconset,
	    // nohue_iconset,
	    //bobble_iconset,
	    // sushi_iconset
	]

	current_iconset = iconsets[utils.randint(0, iconsets.length)]
	//current_iconset = utils.randchoice(iconsets);

	// var icon_count = (level * 7)+5;
	// if(level > 90) {
        //     icon_count = 90;
	// }

	var target_icon_frame = current_iconset.randomframe();

	var create_icon = function(icon_frame) {
	    icon = current_iconset.icon(0, 0);
            icon.frame = icon_frame;
	    icon.anchor.setTo(0.5, 0.5);
	    return icon;
	}

	// make_level(icon_count, row_count)



	icons = [];
	current_target_icon = create_icon(target_icon_frame); // makin' it global :-/
	icons.push(current_target_icon);

	for(var i = 0; i < icon_count - 1; i++) {
	    icon_frame = current_iconset.randomframe();
	    while(icon_frame == target_icon_frame) {
		icon_frame = current_iconset.randomframe();
	    }
	    icons.push(create_icon(icon_frame));
	}
	var params = [icons].concat(level_definition.params);


	level_functions = level_definition.level.apply(this, params);
	clear_level = level_functions.clear_level;
	update_level = level_functions.update_level;


	var target = icons[0];
	target.inputEnabled = true;
	target.events.onInputDown.add(on_click_target, this);
	//target.bringToTop();

	target_display = current_iconset.icon(200, 0);
	//target_display = game.add.sprite(0, 0, 'sushi');
	target_display.frame = target.frame
	// this is cheating, so I can level up quickly
	target_display.inputEnabled = true;
	target_display.events.onInputDown.add(on_click_target, this);
	target_display.width = 100;
	target_display.height = 100;



	// put target in middle depth
	swap_depth = utils.randint(Math.floor(icon_count*0.7), icon_count);
	icon1 = icons[swap_depth];
	game.world.swap(icon1, target);

	// game.world.sendToBack(target_display);
	// game.world.sendToBack(sky);


	return icons;

    };

    function destroy_level() {
	// TODO: reuse sprites rather than repeatedly kill/construct
	clear_level();
	for(var i = 0; i < icons.length; i++) {
            icons[i].kill();
	}
	target_display.kill();
	icons = [];
    }

    function on_click_pause(event) {
	if(is_pause_transition) {
	    return;
	}
	if(is_paused) {
	    on_unpause();
	} else {
	    on_pause();
	}
    }
    function on_pause(skip_animation) {
	if(is_paused || !play_is_active) {
	    return;
	}

	pause_play_button.frame = 1;
	timer.pause();
	is_paused = true;
	play_is_active = false;

	if(skip_animation) {
	    show_pause_screen_instant();
	} else {
	    show_pause_screen();
	}
    }
    function on_unpause(event) {

	pause_play_button.frame = 0;
	timer.unpause();
	is_paused = false;
	play_is_active = true;

	hide_pause_screen();
    }

    function setup_pause_screen() {
	pause_screen = game.add.group();
	pause_screen.x = game_width * -1;

	var blocker = game.add.tileSprite(0, 100, game_width, game_height - 100, "pause-background");
	pause_screen.add(blocker);
	//pause_screen.add.text(16, 10, 'PAUSED', { font: 'bold 26px Arial', fill: '#a00' });

	var text = new Phaser.Text(game, 150, 150, "PAUSED", {/*style object*/});
	pause_screen.add(text);
	
	var all_lifelines = [
	    new lifelines.Drop50(),
	    new lifelines.Drop90(),
	    new lifelines.Shrink(),
	]
	// TODO; figure out which lifelines are purchased

	for(var i=0; i < all_lifelines.length; i++) {
	    var ll = all_lifelines[i];
	    var lifeline1 = game.add.sprite(100*i + 50, 250, 'lifelines');
	    lifeline1.anchor.set(0.5, 0.5);
	    if(ll.purchased) {
		lifeline1.frame = ll.available_frame;
	    } else {
		lifeline1.frame = ll.upsell_frame;
	    }
	    lifeline1.inputEnabled = true;
	    lifeline1.events.onInputDown.add(
		function(lifeline_obj, lifeline_sprite) {
		    return function(event) { 
			lifeline_sprite._active_tween.stop();
			on_click_lifeline(lifeline_sprite, lifeline_obj); 
		    };
		}(ll, lifeline1),
		this
	    );	    
	    pause_screen.add(lifeline1);
	    animations.open_bobble(lifeline1, 1);

	}

    }

    function destroy_pause_screen() {
	if(pause_screen) {
	    pause_screen.destroy();
	    pause_screen = null;
	}
    }

    function show_pause_screen() {
	
	if(!pause_screen) {
	    setup_pause_screen()
	}
	game.world.bringToTop(pause_screen);

	is_pause_transition = true;
	tween = game.add.tween(pause_screen);
	tween.to({x: 0}, 300, Phaser.Easing.Quadratic.Out);
	tween.onComplete.add(function() { is_pause_transition = false;  }, this);
	tween.start();
	
    }
    function show_pause_screen_instant() {
	// When we lose focus, don't animate the pause screen
	if(!pause_screen) {
	    setup_pause_screen()
	}
	game.world.bringToTop(pause_screen);
	pause_screen.x = 0;
	pause_screen.y = 0;

	is_pause_transition = false;
	
    }

    function on_click_lifeline(sprite, lifeline) {
	if(lifeline.used || !lifeline.purchased) {
	    return;
	};
	sprite.frame = lifeline.used_frame;
	lifeline.used = true;

	on_unpause();
	lifeline.run(icons);
    }

    function hide_pause_screen() {
	is_pause_transition = true;
	tween = game.add.tween(pause_screen);
	tween.to({x: game_width * -1}, 300, Phaser.Easing.Quadratic.In);
	tween.onComplete.add(function() { is_pause_transition = false; }, this);
	tween.start();

    }

    function on_click_target(icon, event) {
	if(click_cooldown) {
	    return false;
	}
	if(!play_is_active) {
	    return;
	}

	set_click_cooldown();

	timer.add(time_gift);

	destroy_level();
	level = level + 1;

	click_target_sound.play();

	setup_level();

	tween_score_pop(1, icon.x, icon.y);

    }

    function tween_score_pop(frame, x, y) {
	var scale_to = 0.5;
	var pop = game.add.sprite(100, 100, 'score-pops');
	pop.frame = frame;
	pop.scale.set(0, 0);
	pop.y = y - 50;
	pop.x = x - 10;

	tween = game.add.tween(pop.scale);
	tween.to({x: scale_to, y: scale_to}, 300, Phaser.Easing.Quadratic.Out);
 	tween.onComplete.add(function() {  }, this);
	tween.start();

	// tween alpha and up
	tween2 = game.add.tween(pop);
	tween2.to({y: pop.y - 200}, 3000, Phaser.Easing.Quadratic.Out);
	tween2.onComplete.add(function() {  }, this);
	tween2.start();

	tween3 = game.add.tween(pop);
	tween3.to({alpha: 0}, 4000, Phaser.Easing.Quadratic.Out);
	tween3.onComplete.add(function() { pop.kill(); }, this);
	tween3.start();
    }

    function on_click_sky(sky, event) {
	if(click_cooldown) {
	    return false;
	}
	if(!play_is_active) {
	    return;
	}

	// Allow a missed click to count as a hit if it's close enough
	var forgiveness_ratio = 3;
	var distance = utils.distance(event, current_target_icon);
	if(distance < forgiveness_ratio * current_target_icon.width/2) {
	    return on_click_target(icon);
	}

	set_click_cooldown();

	timer.add(time_penalty);

	penalty_sound.play();
	tween_score_pop(0, event.x, event.y);

    }

    function set_click_cooldown() {
	console.log("cooldown begins");
	click_cooldown = true;
	setTimeout(function() { 
	    click_cooldown = false; 
	    console.log("cooldown ends");
	}, click_cooldown_ms);
    }

    function update() {
	// TODO: There's probably a Phaser feature to replace handle_border_collision
	update_level();

	if(timer) {
	    var game_time = timer.seconds();
	    time_text.text = 'Time: ' + timer.seconds();
	    if(game_time <= 0) {
		time_text.text = 'Time: 0';
		end_game();
	    }

	}
    }

    function show_main_menu() {
	/* Main Menu shows when the app is first opened, and that's the only time.
	 */

	var home_screen_group = game.add.group();
	var on_click_begin = function() {
	    home_screen_group.destroy();
	    begin_game(0, initial_game_time);
	}


	// setup background image
	var home_screen = game.add.sprite(0, 0, 'home-screen');
	home_screen.anchor.setTo(0.5, 0);
	home_screen.x = game_width / 2;
	home_screen.y = 0

	// setup logo
	var logo = game.add.sprite(0, 0, 'logo');
	logo.anchor.setTo(0.5, 0);
	logo.x = game.world.centerX;
	logo.y = 50;
	logo.scale.set(0.7, 0.7);

	if(debug_mode) {
	    // setup  Welcome text
	    var text_style = { 
		font: 'bold 18px Arial', 
	    };

	    var title = "Welcome! " + game_width + " x " + game_height + " ("+window.devicePixelRatio+" dpr)";
	    var title_text = game.add.text(20, 320, title, text_style);

	    // display FPS
	    setInterval(function() { 
		if(high_score_text) {
		    high_score_text.text = "High Score: " + high_score + "(fps: " + game.time.fps+")";
		    //console.log("fps:", game.time.fps); 
		}
	    }, 500);
	}

	// setup "NEW GAME" button
	var play_button = game.add.sprite(game.world.centerX, 400, 'buttons');
	play_button.frame = 1;
	play_button.anchor.setTo(0.5, 0.5);
	play_button.inputEnabled = true;
	play_button.events.onInputDown.add(on_click_begin, this);
	animations.open_bobble(play_button, 1);
	
	// add everything to the group
	home_screen_group.add(home_screen);
	home_screen_group.add(logo);
	home_screen_group.add(title_text);
	home_screen_group.add(play_button);
    }

    function show_second_life_continue() {
	var on_continue = function() {
	    continue_button.destroy();
	    is_second_life = true;
	    begin_game(leveler.current() - 1, second_life_game_time);
	};

	// "Continue" Button
	var continue_button = game.add.sprite(game.world.centerX, game.world.centerY, "buttons");
	continue_button.frame = 2;
	continue_button.inputEnabled = true;
	continue_button.events.onInputDown.add(on_continue, this);
	continue_button.anchor.set(0.5, 0.5);
	animations.open_bobble(continue_button, 1);
    }

    function show_game_over() {
	/* Shows the game over screen
	   - "Game Over, Level XX" or "High Score, Level XX"
	   - High Score
	   - (optional) Keep Going button
	   - New Game button
	*/
	var overlay_height = 800

	var game_over_group = game.add.group();

	var on_play = function() {
	    game_over_group.destroy();
	    begin_game(0, initial_game_time);
	};

	var on_try_again = function() {
	    game_over_group.destroy();

	    AdInterface.show_interstitial();
	    // Show a continue button after the ad under the interstitial
	    show_second_life_continue();
	};

	//var overlay = game.add.sprite(game.world.centerX, overlay_height * -1, "home-screen");
	var overlay = game.add.sprite(game.world.centerX, 0, "home-screen");
	overlay.anchor.setTo(0.5, 0);

	var show_try_again = true;
	if(is_second_life) {
	    show_try_again = false;
	    is_second_life = false;
	}


	/*
	  Logo
	  High Score OR Game Over - finish_status
	  Level XX
	  Keep Going
	  - Keep Going Explanation
	  New Game
	 */

	// Vertical Alignment setup
	var margin = -8;

	var logo_height = 250 * 0.6;
	var logo_y = 15 + logo_height / 2;

	var finish_status_height = 40;
	var finish_status_y = logo_y + logo_height/2 + margin + finish_status_height / 2;

	var finish_score_height = 64;
	var finish_score_y = finish_status_y + finish_status_height/2 + margin + finish_score_height/2;

	var try_again_height = 80;
	var try_again_y = finish_score_y + finish_score_height/2 + margin + try_again_height/2;

	var try_again_description_height = 70;
	var try_again_description_y = -10 + try_again_y + try_again_height/2 + margin + try_again_height/2;

	var play_button_y = 30 + try_again_description_y + try_again_description_height/2 + margin + try_again_description_height/2;


	// Setup Logo
	var logo = game.add.sprite(game.world.centerX, logo_y, 'logo');
	logo.anchor.setTo(0.5, 0.5);
	logo.scale.set(0.6, 0.6);

	var is_high_score = (leveler.current() > previous_high_score); // current high_score already set
	if(is_high_score) {
	    var finish_status = game.add.sprite(game.world.centerX, finish_status_y, 'high-score');
	} else {
	    var txt = "Game Over";
	    var text_style = { 
		font: 'bold 46px Arial', 
		fill: '#000',
		stroke: '#ffffff',
		strokeThickness: 3
	    };
	    var finish_status = game.add.text(game.world.centerX, finish_status_y, txt, text_style);
	}
	finish_status.anchor.setTo(0.5, 0.5);

	var txt = "Level " + leveler.current();
	if(debug_mode) {
	    txt +=  ("-- " + (play_button_y + 40));
	}
	var text_style = { 
	    font: 'bold 26px Arial', 
	    fill: '#000',
	    stroke: '#ffffff',
	    strokeThickness: 3
	};
	var finish_score = game.add.text(game.world.centerX, finish_score_y, txt, text_style);
	finish_score.anchor.setTo(0.5, 0.5);

	if(show_try_again) {

	    // "Try Again" Button
	    var try_again_button = game.add.sprite(game.world.centerX, try_again_y, "buttons");
	    try_again_button.frame = 0; // "Keep Going?"
	    try_again_button.inputEnabled = true;
	    try_again_button.events.onInputDown.add(on_try_again, this);
	    try_again_button.anchor.set(0.5, 0.5);
	    animations.open_bobble(try_again_button, 1);

	    // Try Again Description
	    var try_again_desc = game.add.sprite(game.world.centerX, try_again_description_y, 'keep-going');
	    try_again_desc.anchor.setTo(0.5, 0.5);

	} else {
	    play_button_y = try_again_description_y;
	}

	// "New Game" Button
	var play_button = game.add.sprite(game.world.centerX, play_button_y, "buttons");
	play_button.frame = 1;
	play_button.inputEnabled = true;
	play_button.events.onInputDown.add(on_play, this);
	play_button.anchor.set(0.5, 0.5);
	animations.open_bobble(play_button, 1);


	// Add all pieces to the group
	game_over_group.add(overlay);
	game_over_group.add(logo);
	game_over_group.add(finish_status);
	game_over_group.add(finish_score);
	game_over_group.add(play_button);
	if(show_try_again) {
	    game_over_group.add(try_again_desc);
	    game_over_group.add(try_again_button);
	}

	game_over_group.y = -1 * overlay_height;
	// Animate the screen (drop from top)
	var drop = game.add.tween(game_over_group);
	drop.to({y: 0}, 500, Phaser.Easing.Exponential.Out);
	drop.start();

    }

}

// document.addEventListener('deviceready', onDeviceReady);
// function onDeviceReady(){
//     startGame();
// }

// TODO

var game_loaded = false;
var start_game = function() {
    if(!game_loaded) {
	game_loaded = true;
	$('body').empty();
	initialize_hunter();
    };
}

// Either start game when device is ready, or after 10 seconds
// document.addEventListener("deviceready", start_game, false);
// setTimeout(start_game, 10000);


if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    document.addEventListener("deviceready", start_game, false);
} else {
    start_game();
}
