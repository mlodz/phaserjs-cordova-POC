animations = function() {
    var module = {}

    module.explode_icon = function(icon) {

	icon.kill();

	// There is a bug in here after upgrade to Phaser 2.3.0, but
	// now I think I'd rather just kill the icons than explode them...

	// var timeout = utils.randint(1, 100);
	// setTimeout(function() {

	//     var size_multiple = 2;
	//     var tween_duration = 200; // ms

	//     tween = game.add.tween(icon);
	//     tween.to(
	// 	{ 
	// 	    alpha: 0, 
	// 	    width: icon.width * size_multiple, 
	// 	    height: icon.height * size_multiple,
	// 	}, 
	// 	tween_duration, 
	// 	null
	//     );
	//     tween.onComplete.add(function() { icon.kill() }, this);
	//     tween.start();

	// }, timeout);
    };

    module.drop_icon = function(icon) {
	// Drop an icon off the bottom of the screen, remove it when done.
	var timeout = utils.randint(1, 1000);

	setTimeout(function() {

	    if(icon.body) {
		icon.body.moves = false; // disable arcade, which interferes with tween
	    }
	    // remove any existing tweens
	    if(icon._active_tween) {
		game.tweens.remove(icon._active_tween); //tweens is a reference to the tween manager
	    }

	    var tween_duration = 500; // ms

	    tween = game.add.tween(icon);
	    tween.to(
		{ 
		    y: icon.y + game.height + 100
		}, 
		tween_duration, 
		Phaser.Easing.Quadratic.In
	    );
	    tween.onComplete.add(function() { icon.kill() }, this);
	    tween.start();

	}, timeout);
    }


    module.shrink_icon = function(icon) {
	// Reduce an icon in size. Do not remove it when done.
	var timeout = utils.randint(1, 1000);
	setTimeout(function() {

	    var tween_duration = 1000; // ms
	    var shrink = utils.randint(30, 70) / 100;

	    var tween = game.add.tween(icon.scale);
	    tween.to({ y: icon.scale.y * shrink, x: icon.scale.x * shrink }, tween_duration, Phaser.Easing.Quadratic.InOut);
	    tween.start();

	}, timeout);

    }


    module.bobble_sprite = function(sprite, normal_scale) {

	var bobble = game.add.tween(sprite.scale);
	var bounce_size = 0.03;
	var duration = utils.randint(400, 600);
	sprite.scale.set(normal_scale, normal_scale);
	bobble.to(
	    {
		y: normal_scale * (1+bounce_size),
		x: normal_scale * (1-bounce_size)
	    },
	    duration,
	    Phaser.Easing.Quadratic.InOut,
	    true, // ??
	    0, // ??
	    999999, // repeat count
	    true // repeat
	);

	bobble.yoyo(true, 1);
	bobble.start();

	sprite._active_tween = bobble;
    }

    module.open_bobble = function(sprite, normal_scale) {
	sprite.scale.set(0, 0);
	var duration = utils.randint(600, 900);
	var open = game.add.tween(sprite.scale);
	open.to(
	    {y: normal_scale, x: normal_scale},
	    duration,
	    Phaser.Easing.Bounce.Out
	);
	open.onComplete.add(function() { animations.bobble_sprite(sprite, normal_scale);}, this);
	open.start();
	sprite._active_tween = open;
    }


    return module;
}();
