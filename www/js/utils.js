utils = function() {

    var Leveler = function(initial_level) {
	var count = initial_level;
	var current = function() { return count; };
	var incr = function() { count += 1; return count; };
	var clear = function() { count = 0; };
	var level = function() { return count; };
	return {
	    'level': level,
	    'incr': incr,
	    'current': current,
	    'clear': clear
	}

    }

    var Timer = function(initial_seconds) {

	var now = function() { return (new Date()).getTime(); };
	var initial_milliseconds = initial_seconds * 1000;
	var is_paused = false;
	var timer_epoch = now();
	var added_milliseconds = 0;

	var milliseconds = function() {
            var ms_elapsed = now() - timer_epoch;
            return initial_milliseconds - ms_elapsed + added_milliseconds;
	}

	var pause = function() {
            if(!is_paused) {
		is_paused = true;
		initial_milliseconds = milliseconds();
		added_milliseconds = 0;
            }
	}
	var unpause = function() {
            if(is_paused) {
		is_paused = false;
		timer_epoch = now();
            }
	}
	var add = function(added_seconds) {
            added_milliseconds += (added_seconds * 1000);
	}
	var seconds = function() {
            if(is_paused) {
		return 'Paused';
            } else {
		return Math.ceil(milliseconds() / 1000);
            }
	}
	return {
            'pause': pause,
            'unpause': unpause,
            'add': add,
            'seconds': seconds,
            'milliseconds': milliseconds
	}
    };


    var uniform_points = function (width, height, row_counts) {
	/* Return a list of points that are uniformly placed in a box of width by height.

	   row_counts is a list of numbers. Each number represents how many points to place
	   on that row. 0th item is the top row, the last item is the bottom row.
	*/
	var points = [];
	var vertical_spacing, horizontal_spacing;

	vertical_spacing = height / (row_counts.length + 1);

	for(var y=0; y < row_counts.length; y++) {
            row_count = row_counts[y];
            horizontal_spacing = width / (row_count + 1);
            for(var x=1; x <= row_count; x++) {
		points.push({'x': horizontal_spacing*x, 'y': vertical_spacing*(y+1)});
            }
	}
	return points;
    }

    var randint = function(lower, upper) {
	return Math.floor((Math.random() * (upper - lower)) + lower);
    }
    var randchoice = function(items) {
	return items[randint(0, items.length)];
    }

    var distance = function(obj1, obj2) {
	return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
    };

    var plus_minus = function() {
	if(Math.random() < 0.5) {
	    return -1;
	} else {
	    return 1;
	}
    }

    var module = {};
    module.Timer = Timer;
    module.Leveler = Leveler;
    module.randint = randint;
    module.randchoice = randchoice;
    module.uniform_points = uniform_points;
    module.distance = distance;
    module.plus_minus = plus_minus;
    return module;

}();
