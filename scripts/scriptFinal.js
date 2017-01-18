'use strict'

/*
 * Either assign object to already 
 established object or start over!!!
 */
var videoPlayer = window.videoPlayer || {};


var videoPlayer = {
	adDiv: null,
    $bannerAnimation: null,

	videoData: null,
	currentIndex: null,
	playercontainer: null,
    playTimeOut: null,
  
    currentVid: null,
    Video: null,

    //Json
    jsonFile: 'scripts/videos.json',
    items: null,
    vidArr: null,
    vidIndex: null,


	init: function(){
		/*this.grabData();
		this.currentIndex = 0;
		this.displayVideo(this.currentIndex);*/

		if (!EB.isInitialized()) {
            EB.addEventListener(EBG.EventName.EB_INITIALIZED, videoPlayer.loadSpriteSheet);

        } else {
            videoPlayer.loadSpriteSheet();
        }
        console.log('INITIALIZE');
	},

	loadSpriteSheet: function () {
		var loadedImages = 0,
        	imageArr = [
                    'images/bg.jpg',
                    'images/Backup.jpg',
                    'images/art.png',
                    'images/header_halloween_01.png',
                    'images/poster-image.jpg',
                    'images/video-replay.png',
                    'images/video-play.png'];

        preloadImages();

        function preloadImages(){
            for(var i = 0; i<imageArr.length;i++){
                var tempImage = new Image();
                tempImage.src = imageArr[i];
                tempImage.onload = trackProgress();
            }
        };

        function trackProgress(){
            loadedImages++;
            if(loadedImages == imageArr.length){
                videoPlayer.setupElements();

            }
        };

    },

    setupElements: function () {
    	videoPlayer.adDiv = document.getElementById('ad');
        videoPlayer.videoPoster = document.getElementById('video-poster');
        videoPlayer.cta = document.getElementById('cta');
        videoPlayer.art = document.getElementById('art');
        videoPlayer.exit = document.getElementById('exit');
        videoPlayer.vidVolumeBttn = document.getElementById('video-volume');
        videoPlayer.vidArr = [];

        //Set video
        videoPlayer.loadJSON(videoPlayer.jsonFile);//load json
        videoPlayer.myVideo = document.getElementById('myVideo');
        videoPlayer.myVideo.height = 163;
        videoPlayer.myVideo.width = 290;
        videoPlayer.myVideo.style.zIndex = 7;
        videoPlayer.myVideo.volume = 0;
        videoPlayer.currentVid = videoPlayer.myVideo;
        //Sizmek
        videoPlayer.Video = new EBG.VideoModule(myVideo);
        //
        videoPlayer.addEventListeners();
        //console.log('myVideo ', videoPlayer.currentVid);
    },

    wait: function() { //loops back to the checkInit function until the EB object is initialized.
        checkInit();
    },

    // EVENTLISTENERS
    addEventListeners: function (){
        videoPlayer.currentVid.addEventListener('ended', videoPlayer.replayMultiVideos,false);
        videoPlayer.cta.addEventListener('click', videoPlayer.clickthrough);
        videoPlayer.art.addEventListener('click', videoPlayer.clickthrough);
        videoPlayer.exit.addEventListener('click', videoPlayer.clickthrough);
        videoPlayer.videoPoster.addEventListener('click', videoPlayer.clickPoster);
        videoPlayer.vidVolumeBttn.addEventListener('click', videoPlayer.unmuteVideo);
        videoPlayer.adAnimation();
    },

    // CHECK VIDEO LOADED AND PLAY
    adAnimation: function (){
         var checkVideoLoad = setInterval(function(){
            if(videoPlayer.currentVid.readyState == 4){
                videoPlayer.autoVideoPlay();
                clearInterval(checkVideoLoad);
             }
         },300);
    },

    // LOAD JSON FILE
    loadJSON: function(file, callBack){
        // XHR Request for server data
        // Assing quiz.data to XHR response
        // Intead simple parse
        //return(JSON.parse(file);
        var xmlhttp = new XMLHttpRequest();
        var url = file;

        xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                videoPlayer.vidArr =  JSON.parse(xmlhttp.responseText);
				videoPlayer.styleJSON(videoPlayer.vidArr);//style output
                console.log('JSON FILE ',JSON.parse(xmlhttp.responseText),' myVideo ', videoPlayer.currentVid);
                return videoPlayer.loadJSON;
            }
        };

        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    },

    //STYLE JSON
    styleJSON: function(arr){
	    for(var i = 0; i < arr.length; i++) {
	        //videoPlayer.vidArr += arr[i].videos;
	        videoPlayer.currentVid.setAttribute('src',arr[0].videos); 
	        videoPlayer.currentVid.load();
	        console.log('arr[i].videos ',arr[i].videos);
	    }

	},

    // AUTO PLAY
    autoVideoPlay: function (){
        videoPlayer.playTimeOut = setTimeout(function(){
            TweenMax.to(videoPlayer.videoPoster,.8,{ opacity:0, ease:Quint.easeOut,delay:.250, onComplete: function(){
                videoPlayer.videoPoster.style.display = 'none';
                videoPlayer.currentVid.play();
            }});
            //console.log('currentVid ',currentVid,'  currentVid.volume ',currentVid.volume);
        },2500); 
    },

    //PLAY VIDEO
    loadNextVideo: function(vidNum){
    	videoPlayer.currentVid.src = '';//remove src
    	videoPlayer.currentVid.src = videoPlayer.vidArr[vidNum].videos;
        videoPlayer.currentVid.load();
        videoPlayer.currentVid.pause();
        videoPlayer.currentVid.currentTime = 0;
        videoPlayer.currentVid.volume = 1;
    },

    // VIDEO COMPLETE
    replayMultiVideos: function() {
        videoPlayer.videoPoster.style.display = 'block';//place video poster on top
        TweenMax.to('#video-volume',.8,{ opacity:0, ease:Quint.easeOut});//fade out video volume if needed
        TweenMax.to(videoPlayer.videoPoster,.8,{ autoAlpha:1, ease:Quint.easeOut, onComplete: function(){

            if( videoPlayer.vidIndex <  (videoPlayer.vidArr.length - 1) ){
                videoPlayer.vidIndex++;
            }else {
                videoPlayer.vidIndex = 0;
            }
            videoPlayer.loadNextVideo(videoPlayer.vidIndex);
            console.log('replayMultiVideos ', videoPlayer.currentVid.src);
            
        }});
        
    },

    // CLICKTHROUGH - EXIT
    clickthrough: function(e){
    	e.preventDefault();
        EB.clickthrough();
    },

    // POSTER CLICK
    clickPoster: function(e){
        e.preventDefault();
        clearTimeout(videoPlayer.playTimeOut);//clear auto play interval
        TweenMax.to(videoPlayer.videoPoster,.8,{ opacity:0, ease:Quint.easeOut,delay:.250, onComplete: function(){
            videoPlayer.videoPoster.style.display = 'none';
            videoPlayer.currentVid.play();
        }});
        //console.log('currentVid ',currentVid,'  currentVid.volume ',currentVid.volume);
    },

    // UNMUTE VIDEO
    unmuteVideo: function(){
        this.style.display = 'none';
        videoPlayer.currentVid.volume = 1;
        //console.log('currentVid ',currentVid,'  currentVid.volume ',currentVid.volume);
    },

	grabData: function(){
		// Grab json file
		// window.videoPlayer.videoData = AJAX Call to JSON file();
		// This file is now stored and ready for other funcitons
	},

	displayVideo: function(){
		if(this.currentIndex >= 1){
			// Remove event listener olf element that exists
			// Delete old video element -- `myVideo_{videoPlayer.currentIndex}`
		}
		// Create new video element id = `myVideo_{videoPlayer.currentIndex}`
		// Deal with the video source
		// deal with style attributes
		// Add `end ` event listenern -- this.increment();
		// PLAY()
	},

	increment: function(){
		// this.currentIndex ++
		// this.displayVideo(this.currentIndex);
	},

};

document.addEventListener('DOMContentLoaded', function(event) {
	videoPlayer.init();
});