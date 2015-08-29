lifelines = null;

/*

**** FREE

Drop Some (50%)
Shrink

**** PAID
50% Zap (all disappear, no animation)
75% Zap
90% Zap

Drop Many (75%)
Drop Most (90%)

Grow

*/


function indexes_to_remove(icons, ratio) {
    var count = Math.ceil((icons.length-1) * ratio);
    var indexes = _.range(1, icons.length)
    console.log("count", count);
    console.log("indexes:", indexes);
    return _.sample(indexes, count);
}

initialize_lifelines = function(game, game_width, game_height, header_height) {
    lifelines = function() {


	var Drop50 = function() {

	    this.name = 'Drop 50%';
	    this.description = 'Half of the icons go away';
	    this.price = 99;

	    this.available_frame = 0;
	    this.used_frame = 10;
	    this.upsell_frame = 20;

	    this.used = false; // Can only use once in a game, resets at next game
	    this.purchased = true; // Must purchase to be used

	    this._percentage_drop = 0.50;

	    var _icons = null;

	    this.run = function(all_icons) {
		// select 50% of all_icons, add tweens and kills
		// remove them from all_icons

		var indexes = indexes_to_remove(all_icons, this._percentage_drop);
		// remove icons from `icons`, mutating `icons`
		var removed_icons = _.pullAt(all_icons, indexes);

		removed_icons.forEach(function(icon) {
		    animations.drop_icon(icon);
		});
	    }
	    this.clear = function() {
		// if any _icons still exist, remove tweens and kill icon
	    }

	    return this;
	}

	var Drop10 = function() {
	    // this.available_frame = 1;
	    // this.used_frame = 11;
	    // this.upsell_frame = 21;

	    this._percentage_drop = 0.10;
	}
	Drop10.prototype = new Drop50();

	var Drop90 = function() {
	    this.available_frame = 1;
	    this.used_frame = 11;
	    this.upsell_frame = 21;

	    this._percentage_drop = 0.90;
	}
	Drop90.prototype = new Drop50();



	var Shrink = function() {

	    this.name = 'Shrink em!';
	    this.description = 'Everything gets smaller';
	    this.price = 99;

	    this.available_frame = 2;
	    this.used_frame = 12;
	    this.upsell_frame = 22;

	    this.used = false; // Can only use once in a game, resets at next game
	    this.purchased = true; // Must purchase to be used

	    this.run = function(all_icons) {
		var j = all_icons.length;
		while(j-- > 1) {
		    animations.shrink_icon(all_icons[j]);
		}
	    }
	    return this;
	}


	// var Shrink = {

	//     'run': function(icons) {
	// 	var j = icons.length;
	// 	while(j-- > 1) {
	// 	    if(utils.randint(0, 100) < 150) {
	// 		//drop_icon(icons[j]);
	// 		shrink_icon(icons[j]);
	// 		//icons.splice(j, 1);
	// 	    }
	// 	}
	//     }

	// }


	// How to extend
	// Drop60.prototype = new Drop50();

	return {
	    'Shrink': Shrink,
	    'Drop50': Drop50,
	    'Drop10': Drop10,
	    'Drop90': Drop90
	}

    }();
}
