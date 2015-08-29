
var admob_interface = function() {
    var create_banner = function() {
	AdMob.createBanner({
	    adId: "ca-app-pub-2491043515341375/6377400241",
	    position: AdMob.AD_POSITION.BOTTOM_CENTER,
	    autoShow: true, // show it once it's ready

	    // TODO: overlap:true creates a black screen on android

	    /*
	      overlap: false
	      -- iPhone - overlap does happen, need to adust game by ad_height
	      -- Android - opverlap not happening, no need to adjust game by ad_height

	      overlap: true
	      -- Android get black screen, unplayable
	      -- iPhone works as expected
	    */
	    overlap: false, // overlap the game, so it won't steal space to canvas
	    isTesting: true // show a demo ad
	});
    }

    var prepare_interstitial = function() {
	// TODO: check if it is already loaded
	AdMob.prepareInterstitial({
	    adId: "ca-app-pub-2491043515341375/9330866645",
	    autoShow: false
	});
    };
    var show_interstitial = function() {
	AdMob.showInterstitial();
    }


    document.addEventListener('onAdFailLoad', function(data){ 
    });
    document.addEventListener('onAdLoaded', function(data){
	// Called when banner or interstitial is loaded
    });
    document.addEventListener('onAdPresent', function(data){
    });
    document.addEventListener('onAdLeaveApp', function(data){
    });
    document.addEventListener('onAdDismiss', function(data){
    });

    module = {};
    module.create_banner = create_banner;
    module.prepare_interstitial = prepare_interstitial
    module.show_interstitial = show_interstitial

    module.bottom_banner_height = 50;
    
    return module;




};

var noop_interface = function() {
    var noop = function() {};

    module = {};
    module.create_banner = noop;
    module.prepare_interstitial = noop;
    module.show_interstitial = noop;

    module.bottom_banner_height = 0;
    
    return module;

}


initialize_adinterface = function() {
    if(window.AdMob) {
	AdInterface = admob_interface();
    } else {
	AdInterface = noop_interface();
    }
}
