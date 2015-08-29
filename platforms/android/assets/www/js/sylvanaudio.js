/*
  This is how cordova/phaser audio *should* work.

	game.load.audio('penalty', 'audio/Breaking_glass_light_29.wav');
	penalty_sound = game.add.audio('penalty');
	penalty_sound.play();

  But, android is not on the same page, and there is a Media plugin which is not quite working,
  so we are using a hack. We are including an absolute (local) filepath, because somehow a
  local path won't work
*/


initialize_audio = function(game) {
    DefaultAudio = function() {
	var load = function(key, src) {
	    game.load.audio(key, src);
	}
	var add = function(key) {
	    return game.add.audio(key);
	}
	var setVolume = function(obj, vol) {
	    obj.volume = vol; // between 0.0 (silent) and 1.0 (full volume), or greater for louder
	}
	
	return {
	    setVolume: setVolume,
	    load: load,
	    add: add
	}
    }();

    AndroidMediaObject = function(media) {
	var play = function() {
	    media.stop();
	    media.play();
	}
	var stop = function() {
	    media.stop();
	}
	// var setVolume = function(obj, vol) {
	//     obj.setVolume(vol); // between 0.0 (silent) and 1.0 (full volume), or greater for louder
	// }

	return {
	    setVolume: function(vol) { media.setVolume(vol); },
	    pause: function() { media.pause(); },
	    resume: function() { media.play(); },
	    play: play,
	    stop: stop
	}
    }

    AndroidAudio = function() {
	var audio_objects = {};
	var android_path = 'file:///android_asset/www/';
	var noop = function() {};

	var load = function(key, path) {
	    audio_objects[key] = AndroidMediaObject(new Media(android_path+path, noop, noop));
	};
	var add = function(key) {
	    return audio_objects[key];
	};
	var setVolume = function(obj, vol) {
	    obj.setVolume(vol);
	    //obj.setVolume(String(vol)); // between 0.0 (silent) and 1.0 (full volume), or greater for louder
	};


	return {
	    setVolume: setVolume,
	    load: load,
	    add: add
	}
    }();


    if (navigator.userAgent.match(/(Android)/)) {
	return AndroidAudio;
    } else {
	return DefaultAudio;
    }
}

