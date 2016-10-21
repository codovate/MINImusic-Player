/*
    AUTHOR: Sam Johnson
    MINIMusic Player 
*/
;(function( $, window, document, undefined )
{
    //setup Touch Events
    var isTouch       = 'ontouchstart' in window,
        eStart        = isTouch ? 'touchstart'  : 'mousedown',
        eMove         = isTouch ? 'touchmove'   : 'mousemove',
        eEnd          = isTouch ? 'touchend'    : 'mouseup',
        eCancel       = isTouch ? 'touchcancel' : 'mouseup';

        secondsToTime = function( secs ) 
        {
            var hours = Math.floor( secs / 3600 ), 
                minutes = Math.floor( secs % 3600 / 60 ), 
                seconds = Math.ceil( secs % 3600 % 60 );

            return ( hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0'+hours+':' : hours+':' ) + ( minutes.toString().length < 2 ? '0'+minutes : minutes ) + ':' + ( seconds.toString().length < 2 ? '0'+seconds : seconds );
        };

    $.fn.musicPlayer = function( options )
    {
            // inner variables
            var options = $.extend( { autoPlay: false , volume: 80, loop: false, timeSeparator: ' / ',  infoElements: ['title' , 'artist'] , elements: ['artwork', 'information', 'controls', 'progress', 'time', 'volume'],  timeElements: ['current', 'duration'],  controlElements: ['backward', 'play', 'forward', 'stop'], onLoad: function() {}, onPlay: function() {}, onPause: function() {}, onStop: function() {}, onFwd: function() {}, onRew: function() {}, volumeChanged: function() {}, progressChanged: function() {} , trackClicked: function() {}  }, options ),
                song,  
                tracker = $('.mp-progressbar'),
                volume  = $('.mp-volume'),
                controlInnerElem = "" ,
                timeInnerElem    = "",
                infoElem = "",  
                infoInnerElem    = "",
                fullPlayerElem   = "", 
                volumeElem       = "",
                progressElem     = "",
                artworkElem  = "" ,
                timeElem = "",
                controlElem = "";

            
            //PREPARE MUSIC PLAYER ELEMENTS
            for( var elemItem in options.elements ) 
            { 
                
                //PREPARE VOLUME
                if (options.elements[elemItem] == "volume" ) {

                    volumeElem   = "<div class='mp-volume' ><div class='mp-volume-btn' title='Volume'></div><div class=' mp-volume-adjust'><div><div></div></div></div></div>" ;
                    fullPlayerElem  += volumeElem; 
                }
                //PREPARE PROGRESS
                else if (options.elements[elemItem] == "progress" ) {
                    progressElem = "<div class='mp-progressbar'><div class='mp-bar-loaded' ></div><div class='mp-bar-played'></div></div>";
                    fullPlayerElem  += progressElem; 
                }
                //PREPARE ARTWORK
                else if (options.elements[elemItem] == "artwork" ) {
                   artworkElem = "<div class='mp-cover'></div>";
                   fullPlayerElem  += artworkElem; 
                }
                //PREPARE INFORMATION displayed by the player in  the given order
                else if (options.elements[elemItem] == "information" ) {
                    
                    $.inArray("title", options.infoElements ) != '-1'   ? titleElem     = "<div class='mp-title'></div>"  : titleElem = " " ;
                    $.inArray("artist", options.infoElements ) != '-1'  ? artistElem    = "<div class='mp-artist'></div>" : artistElem = " " ;
                    
                    for( var item in options.infoElements ) {  
                        if (options.infoElements[item] == "title" ) {    infoInnerElem += titleElem;  }
                        else if ( options.infoElements[item]  == "artist" ) {   infoInnerElem += artistElem ;  }
                    }
                    infoElem = "<div class='mp-info' >" + infoInnerElem + "</div>";
                    fullPlayerElem  += infoElem; 
                }
                //PREPARE TIME (current & Duration) in the given order
                else if (options.elements[elemItem] == "time" ) {
                
                    $.inArray("current", options.timeElements) != '-1'  ? curTimeElem = "<div class='mp-time-current'></div>" : curTimeElem = " " ;                    
                    $.inArray("duration", options.timeElements) != '-1' ? durTimeElem = "<div class='mp-time-duration'></div>" : durTimeElem = " " ;
                    timeSeparator =  "<div class='mp-time-separator'>" + options.timeSeparator.replace(/\s/g, '&nbsp;') + "</div>" ;  
                    
                    for( var item in options.timeElements ) {  
                        if( item == 1 ) { timeInnerElem +=  timeSeparator; }
                        if (options.timeElements[item] == "current" ) {    timeInnerElem += curTimeElem ;  }
                        else if ( options.timeElements[item]  == "duration" ) {   timeInnerElem += durTimeElem;  }
                    }
                    timeElem = "<div class='mp-timeHolder'>" + timeInnerElem + "</div>";
                    fullPlayerElem  += timeElem; 
                }
                //PREPARE CONTROLS inner elements to display [play, stop, forward or backward] in the given order
                else if (options.elements[elemItem] == "controls" ) {

                    $.inArray("backward", options.controlElements) != '-1'  ? backwardElem   = "<div class='mp-rew'></div>"      : backwardElem  = " " ;
                    $.inArray("forward", options.controlElements)  != '-1'  ? forwardElem  = "<div class='mp-fwd'></div>"        : forwardElem   = " " ;
                    $.inArray("stop", options.controlElements) != '-1'      ? stopElem     = "<div class='mp-stop'></div>"       : stopElem      = " " ;
                    $.inArray("play", options.controlElements) != '-1'      ? playElem     = "<div class='mp-play'></div><div class='mp-pause'></div>" : playElem  = " " ;

                    for( var item in options.controlElements ) {  
                        if (options.controlElements[item] == "backward" ) {       controlInnerElem  +=  backwardElem ;  }
                        else if (options.controlElements[item] == "play" ) {      controlInnerElem +=  playElem;  }
                        else if (options.controlElements[item] == "forward" ) {   controlInnerElem +=  forwardElem;  }
                        else if (options.controlElements[item] == "stop" ) {   controlInnerElem +=  stopElem;  }
                    }
                    controlElem   = "<div class='mp-controls'>" + controlInnerElem + "</div>";
                    fullPlayerElem  += controlElem; 
                }
            }

            //ADD THE PREPARED ELEMENT SORTED IN THEIR RIGHT ORDER TO THE PLYAER ELEMENT
            playerElem = $("<div class='mp-player'>" + fullPlayerElem + "</div>");

            $(playerElem).insertBefore(".mp-playlist");

            var theBar            = playerElem.find('.mp-progressbar'),
                barPlayed         = playerElem.find('.mp-bar-played' ),
                barLoaded         = playerElem.find('.mp-bar-loaded' ),
                timeCurrent       = playerElem.find('.mp-time-current'),
                timeDuration      = playerElem.find('.mp-time-duration' ),
                timeSeparator     = options.timeSeparator,
                volumeButton      = playerElem.find('.mp-volume-btn'),
                volumeAdjuster    = playerElem.find('.mp-volume-adjust' + ' > div' ),
                volumeValue       = options.volume / 100,
                volumeDefault     = 0,
                cssClass          = 
                {
                    playing:        'mp-playing',
                    mute:           'mp-mute'
                };

            //Volume cannot be set using JavaScript, so the volumechange event will never be fired. 
            //Even if the user changes the volume on their device while mobile Safari is open, this event will not fire
            //source: https://www.ibm.com/developerworks/library/wa-ioshtml5/
            //Hide Volume control on IOS devices. 
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) $('.mp-volume').hide();
                                
            // initialization - first element in playlist
            initAudio($('.mp-playlist li:first-child') );
            // set volume  
            song.volume = volumeValue;


            adjustCurrentTime = function( e )
            {
                theRealEvent         = isTouch ? e.originalEvent.touches[ 0 ] : e;
                song.currentTime = Math.round( ( song.duration * ( theRealEvent.pageX - theBar.offset().left ) ) / theBar.width() );
            },
            adjustVolume = function( e )
            {
                theRealEvent    = isTouch ? e.originalEvent.touches[ 0 ] : e; 
                song.volume = Math.abs( ( theRealEvent.pageX - ( volumeAdjuster.offset().left ) ) / volumeAdjuster.width() );
            };

            var volumeTestDefault = song.volume, 
                volumeTestValue   = song.volume = 0.111;
                if( Math.round( song.volume * 1000 ) / 1000 == volumeTestValue ) song.volume = volumeTestDefault; //alert(song.volume);
                else playerElem.addClass("novolume");

            //set default time Current and duration time
            timeDuration.html( '&hellip;' );
            timeCurrent.text( secondsToTime( 0 ) );  

            //Set Song to be played by player & set song info on the player.
            function initAudio(elem) {

                var url = elem.children("a:first-child").attr("href");
                var title = elem.text();
                var cover = elem.attr('data-cover');
                var artist = elem.attr('data-artist');  

                //Set the title of the song  on the player  
                $('.mp-player .mp-title').text(title);
                //Set the artist name on the player
                $('.mp-player .mp-artist').text(artist);
                //Set the cover image for the player 
                $('.mp-player .mp-cover').css('background-image','url('+ cover +')');;

                //song = new Audio('data/' + url);
                song = new Audio(url); 

                //Force load
                song.load();

               
                // song.addEventListener('loadstart', function () 
                // {
                //   alert("Started");

                // }, false); 

                // song.addEventListener('error', function failed(e) {
                //    // audio playback failed - show a message saying why
                //    // to get the source of the audio element use $(this).src
                //    switch (e.target.error.code) {
                //      case e.target.error.MEDIA_ERR_ABORTED:
                //        alert('You aborted the video playback.');
                //        break;
                //      case e.target.error.MEDIA_ERR_NETWORK:
                //        alert('A network error caused the audio download to fail.');
                //        break;
                //      case e.target.error.MEDIA_ERR_DECODE:
                //        alert('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
                //        break;
                //      case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                //        alert('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
                //        break;
                //      default:
                //        alert('An unknown error occurred.');
                //        break;
                //    }
                //  }, true);

                //set the song time duration on player
                song.addEventListener('loadeddata', function()
                {
                    //timeDuration.html( timeSeparator  + secondsToTime(song.duration) );
                    timeDuration.html(secondsToTime(song.duration) );
                    volumeAdjuster.find( 'div' ).width( song.volume * 100 + '%' );
                    volumeDefault = song.volume;

                }, false);

             



                //update bar loader 
                song.addEventListener('progress', function()
                {
                    barLoaded.width( ( song.buffered.end( 0 ) / song.duration ) * 100 + '%' );
                });

                //timeupdate event listener (timeupdate used together with the current Time Property to return
                // the current position of the audio playback in seconds)   
                song.addEventListener('timeupdate',function ()
                {
                    timeCurrent.text( secondsToTime(song.currentTime ) ); 
                    barPlayed.width( (song.currentTime / song.duration ) * 100 + '%' );
                });

                song.addEventListener( 'volumechange', function()
                {
                    volumeAdjuster.find( 'div' ).width( song.volume * 100 + '%' );
                    if( song.volume > 0 && playerElem.hasClass( cssClass.mute ) ) playerElem.removeClass( cssClass.mute );
                    if( song.volume <= 0 && !playerElem.hasClass( cssClass.mute ) ) playerElem.addClass( cssClass.mute );
                    volumeValue  = song.volume;
                });

                song.addEventListener( 'ended', function()
                {   
                     //Play the loaded song when autoplay is activated
                      //$('.mp-fwd').click(); 
                    if (options.autoPlay){ autoPlayNext(); } 
                    else {
                        //Hide playing class
                        playerElem.removeClass( cssClass.playing );
                        //Hide pause Icon and show play
                        $('.mp-play').removeClass('hidden');
                        $('.mp-pause').removeClass('visible');
                    }

                });

                //Toggle Mute icon and reset Volume   
                volumeButton.on( 'click', function()
                {
                    if( playerElem.hasClass( cssClass.mute ) )
                    {
                        playerElem.removeClass( cssClass.mute );
                        song.volume = volumeDefault;
                    }
                    else
                    {
                        playerElem.addClass( cssClass.mute );
                        volumeDefault = song.volume;
                        song.volume = 0;
                    }
                    return false;
                });

                //when volume bar is clicked
                volumeAdjuster.on( eStart, function( e )
                {
                    adjustVolume( e );
                    volumeAdjuster.on( eMove, function( e ) { adjustVolume( e ); } );
                })
                .on( eCancel, function()
                {
                    volumeAdjuster.unbind( eMove );
                    
                    options.volumeChanged();
                });

                //when trackbar is click 
                theBar.on( eStart, function( e )
                {
                    adjustCurrentTime( e );
                    theBar.on( eMove, function( e ) { adjustCurrentTime( e ); } );
                })
                .on( eCancel, function()
                {
                    theBar.unbind( eMove );
                    options.progressChanged();
                });

                //Make active the loaded Song playing  
                $('.mp-playlist li').removeClass('active');
                elem.addClass('active');

                //issue Callback
                options.onLoad();

                //Play the loaded song when autoplay is activated
                if (options.autoPlay) playAudio();  

            }

            function playAudio() { 
                song.play();
                //set the length of the current song as the max option of the track slider. 
                //tracker.slider("option", "max", song.duration);

                //Add playing class
                playerElem.addClass( cssClass.playing );

                //Hide pause Icon and show play if they exist 
                if (  $.inArray("controls", options.elements ) != '-1' && $.inArray("play", options.controlElements ) != '-1'  ) {
                    $('.mp-play').addClass('hidden');
                    $('.mp-pause').addClass('visible');
                }

                options.onPlay();

            }

            function stopAudio() {
                song.pause();

                //Hide pause Icon and show play if they exist 
                if ( $.inArray("controls", options.elements ) != '-1' && $.inArray("play", options.controlElements ) != '-1' ) {
                    $('.mp-play').removeClass('hidden');
                    $('.mp-pause').removeClass('visible');
                }
            }

            //Auto Play the next track and loop if lopp is activated
            function autoPlayNext() {
                stopAudio();
                var next = $('.mp-playlist li.active').next();

                //Looping Activated : play the first item on the playlist if there is no next item with(looping)
                if (  next.length == 0 && options.loop  ) {
                    next = $('.mp-playlist li:first-child');
                    loadNewSong(next);
                    playAudio();
                }
                else if (  !next.length == 0  ) {
                    loadNewSong(next);
                    playAudio();
                }
            }

            //initiate the give song maintaining current settings 
            function loadNewSong(elem) {
                //save current volume  level
                volumeValue = song.volume;
                //set up the next song to be played
                initAudio(elem);
                //set song volume to the previous track's volume to ensure consistency
                song.volume = volumeValue;
                volumeAdjuster.find( 'div' ).width( volumeValue * 100 + '%' );
                //reset progress & loaded bar indicator to begin
                barPlayed.width(0);
                barLoaded.width(0);
                //reset current time
                timeCurrent.text( secondsToTime( 0 ) );  
            }   


            // play click
            $('.mp-play').click(function (e) {
                e.preventDefault();

                playAudio();
            });

            // pause click
            $('.mp-pause').click(function (e) {
                e.preventDefault();

                stopAudio();
                options.onPause();
            });

            // forward click
            $('.mp-fwd').click(function (e) {
                e.preventDefault();

                stopAudio();

                var next = $('.mp-playlist li.active').next();

                //Looping Activated : play the first item on the playlist if there is no next item with(looping)
                if ( next.length == 0 ) {
                    next = $('.mp-playlist li:first-child');
                }

                loadNewSong(next);
                playAudio();

                options.onFwd();

            });

            // rewind click
            $('.mp-rew').click(function (e) {
                e.preventDefault();

                stopAudio();

                var prev = $('.mp-playlist li.active').prev();
                //play the last item on the playlist if there is no previous item (looping)
                if (prev.length == 0 ) {
                    prev = $('.mp-playlist li:last-child');
                }
                loadNewSong(prev);
                playAudio();
                options.onRew();
            });

            //stop click 
            $('.mp-stop').click(function (e) {
                e.preventDefault();

                stopAudio();
                
                var currentTrack = $('.mp-playlist li.active');
                loadNewSong(currentTrack);

                options.onStop();
            });

            // Play clicked Playlist song. 
            $('.mp-playlist li').click(function (e) {
                e.preventDefault();

                stopAudio();
                loadNewSong($(this));
                playAudio();
                options.trackClicked();
            });

        return this;
    };

})( jQuery, window, document );