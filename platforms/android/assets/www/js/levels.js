levels = null;

initialize_levels = function(game, game_width, game_height, header_height) {
    var randomly_place = function(icon) {
	icon.x = utils.randint(icon.width/2, game_width - icon.width/2);
	icon.y = utils.randint(100 + icon.height/2, game_height - icon.height/2);
    }
    var gravity_place = function(icon) {
	icon.x = utils.randint(icon.width/2, game_width - icon.width/2);
	icon.y = Math.min(
	    utils.randint(100 + icon.height/2, game_height - icon.height/2),
	    utils.randint(100 + icon.height/2, game_height - icon.height/2)
	);
    }

    levels = function() {

	var noop = function() {};

	var handle_border_collision = function(icon) {
            var game_width_min = 0;
            var game_width_max = game_width;
            var game_height_min = 100;
            var game_height_max = game_height;
	    // TODO
	    var icon_size = 160 * 0.5;

            if(icon.body.x + icon.width > game_width_max) {
		icon.body.velocity.x = icon.body.velocity.x * -1;
		icon.body.x = game_width_max - 1 - icon.width;
            }

            if(icon.body.x < game_width_min) {
		icon.body.velocity.x = icon.body.velocity.x * -1;
		icon.body.x = game_width_min + 1;
            }

            if(icon.body.y + icon.height > game_height_max) {
		icon.body.velocity.y = icon.body.velocity.y * -1;
		icon.body.y = game_height_max - 1 - icon.height;
            }

            if(icon.body.y < game_height_min) {
		icon.body.velocity.y = icon.body.velocity.y * -1;
		icon.body.y = game_height_min + 1;
            }
	};


	var uniform = function(icons, arrangement) {
	    if(icons.length != _.sum(arrangement)) {
		console.log("WARNING: `uniform` level has "+icons.length+" icons but expected "+_.sum(arrangement));
	    }
	    points = utils.uniform_points(game_width, game_height - header_height, arrangement);
	    points = _.shuffle(points);
	    for(var i=0; i < icons.length; i++) {
		game.physics.arcade.enable(icons[i]);
		icons[i].x = points[i].x;
		icons[i].y = points[i].y + header_height;
		// TODO: what if accidentallly more icons than points?
	    }
	    return {'update_level': noop, 'clear_level': noop};
	}
	var uniform_swaps = function(icons, arrangement) {
	    var movement_duration = 5900;
	    var movement_interval = 6000;

	    if(icons.length != _.sum(arrangement)) {
		console.log("WARNING: `uniform` level has "+icons.length+" icons but expected "+_.sum(arrangement));
	    }
	    points = utils.uniform_points(game_width, game_height - header_height, arrangement);
	    points = _.shuffle(points);
	    for(var i=0; i < icons.length; i++) {
		icons[i].x = points[i].x;
		icons[i].y = points[i].y + header_height;
		// TODO: what if accidentallly more icons than points?
	    }

	    var move_to = function(icon, x, y) {
		var animation = game.add.tween(icon);
		animation.to({x: x, y: header_height+y}, movement_duration, Phaser.Easing.Quadratic.InOut);
		animation.start();
		icon._active_tween = animation;
	    }
	    

	    var execute_swaps = function(){
		points = _.shuffle(points);
		for(var i=0; i < icons.length; i++) {
	    	    move_to(icons[i], points[i].x, points[i].y); 
		}
	    }
	    var interval_id;
	    var begin_movement_time = utils.randint(0, 5000);
	    setTimeout(
		function() {
		    execute_swaps();
		    interval_id = setInterval(execute_swaps, movement_interval);
		},
		begin_movement_time
	    );
	    
	    

	    var clear_level = function() {
		clearInterval(interval_id);
	    }

	    return {'update_level': noop, 'clear_level': clear_level};
	};

	var horizontal_slide = function(icons) {
	    var easing = [
		//Phaser.Easing.Elastic.Out, // Requires longer tween time
		//Phaser.Easing.Bounce.Out,  // Requires longer tween time

		Phaser.Easing.Linear.In,
		Phaser.Easing.Sinusoidal.InOut,
		Phaser.Easing.Cubic.Out,

		// Phaser.Easing.Exponential.InOut,
		// Phaser.Easing.Back.InOut,
		// Phaser.Easing.Quadratic.In,
		// Phaser.Easing.Quadratic.Out,
		// Phaser.Easing.Quadratic.InOut,
	    ];
	    var ease = utils.randchoice(easing);
	    var variable_tween_time = utils.randchoice([true, false]);

	    for(var i=0; i < icons.length; i++) {
		var icon = icons[i];

		randomly_place(icon);

		var x_offset = utils.randint(30, 100);
		icon.x = utils.randint(x_offset, game_width - x_offset);
		// icon.x = icon.x - x_offset;

		if(variable_tween_time) {
		    var tween_time = utils.randint(500, 2000);
		    if(i == 0) {
			var tween_time = Math.max(
			    utils.randint(500, 2000), 
			    utils.randint(500, 2000),
			    utils.randint(500, 2000)
			);
		    }
		} else {
		    var tween_time = 1500;
		}
		var tween_time = utils.randint(9000, 19000);

		var animation = game.add.tween(icon);
		var direction = utils.plus_minus();
		animation.to(
		    {x: icon.x + direction * x_offset, },
		    tween_time,
		    ease,
		    true,  // ?
		    0,  // ?
		    100,  // ?
		    true // ?
		);
		animation.start();
		animation.yoyo(true, 1);
		icon._active_tween = animation;


	    }
	    var bounce_boundaries = function() {
		for(var i = 0; i < icons.length; i++) {
		    handle_border_collision(icons[i]);
		}
	    }

	    return {'update_level': noop, 'clear_level': noop};

	}


	var scattered = function(icons) {

	    for(var i=0; i < icons.length; i++) {
		var icon = icons[i];

		game.physics.arcade.enable(icon);
		randomly_place(icon);

	    	velocity_spread = 5
	    	icon.body.velocity.x = utils.randint(velocity_spread  * -1, velocity_spread);
	    	icon.body.velocity.y = utils.randint(velocity_spread  * -1, velocity_spread);
	    }
	    var bounce_boundaries = function() {
		for(var i = 0; i < icons.length; i++) {
		    handle_border_collision(icons[i]);
		}
	    }

	    return {'update_level': bounce_boundaries, 'clear_level': noop};
	}


	var rotate = function(icons) {

	    for(var i=0; i < icons.length; i++) {
		var icon = icons[i];

		game.physics.arcade.enable(icon);
		randomly_place(icon);

		icon.anchor.set(0.5, 0.5);
		var angle = utils.randint(-50, 50);
		var duration = utils.randint(2000, 5000);
		var wait_duration = utils.randint(200, 2000);

		icon.angle = angle;

		var animation = game.add.tween(icon);
		animation.to(
		    {angle: angle + 360},
		    duration,
		    Phaser.Easing.Bounce.Out,
		    true,  // ?
		    wait_duration,  // time between repeats
		    9999,  // ?
		    true // ?
		);
		animation.start();
		animation.yoyo(true, 1);
		icon._active_tween = animation;

	    	// velocity_spread = 5
	    	// icon.body.velocity.x = utils.randint(velocity_spread  * -1, velocity_spread);
	    	// icon.body.velocity.y = utils.randint(velocity_spread  * -1, velocity_spread);

	    }

	    return {'update_level': noop, 'clear_level': noop};
	}


	var make_gravity = function(min_gravity, gravity_spread, horizontal_velocity_spread) {
	    var gravity = function(icons) {
		for(var i=0; i < icons.length; i++) {
		    var icon = icons[i];
		    var is_target = (i == 0);

		    // var min_gravity = 300;
		    // var gravity_spread = 300;
		    // var horizontal_velocity_spread = 200;

		    game.physics.arcade.enable(icon);
		    //randomly_place(icon);
		    gravity_place(icon);
		    var calc_gravity = function() {
			return utils.randint(
			    min_gravity, 
			    min_gravity + gravity_spread
			);
		    };
		    if(is_target) {
			icon.body.gravity.y = Math.min(
			    calc_gravity(),
			    calc_gravity(),
			    calc_gravity()
			);
		    } else {
			icon.body.gravity.y = calc_gravity();
		    }

		    var speed = utils.randint(
			horizontal_velocity_spread * -1, 
			horizontal_velocity_spread
		    );

		    if(is_target) {
			speed = Math.min(speed / 2, 80);
		    }

	    	    icon.body.velocity.x = speed;
	    	    // icon.body.velocity.y = utils.randint(velocity_spread  * -1, velocity_spread);
		}

		var bounce_boundaries = function() {
		    for(var i = 0; i < icons.length; i++) {
			handle_border_collision(icons[i]);
		    }
		}


		return {'update_level': bounce_boundaries, 'clear_level': noop};
	    }
	    return gravity;
	}
	var gravity_slow = make_gravity(20, 50, 50);
	var gravity_standard = make_gravity(300, 300, 200);
	var gravity_fast = make_gravity(400, 800, 200);


	var module = {};
	module.uniform = uniform;
	module.uniform_swaps = uniform_swaps;
	module.scattered = scattered;
	module.rotate = rotate;
	module.horizontal_slide = horizontal_slide;
	module.gravity_slow = gravity_slow;
	module.gravity_standard = gravity_standard;
	module.gravity_fast = gravity_fast;
	return module;

    }();

}
