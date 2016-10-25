/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

    "use strict";

        // undefined is used here as the undefined global variable in ECMAScript 3 is
        // mutable (ie. it can be changed by someone else). undefined isn't really being
        // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
        // can no longer be modified.

        // window and document are passed through as local variable rather than global
        // as this (slightly) quickens the resolution process and can be more efficiently
        // minified (especially when both are regularly referenced in your plugin).

        // Create the defaults once
        var pluginName = "musicPlayer",
            defaults = {
                autoPlay: false , 
                volume: 80, 
                loop: false, 
                timeSeparator: ' / ',  
                infoElements: ['title' , 'artist'] , 
                elements: ['artwork', 'information', 'controls', 'progress', 'time', 'volume'],  
                timeElements: ['current', 'duration'],  
                controlElements: ['backward', 'play', 'forward', 'stop'], 
                onLoad: function() {}, 
                onPlay: function() {}, 
                onPause: function() {}, 
                onStop: function() {}, 
                onFwd: function() {}, 
                onRew: function() {}, 
                volumeChanged: function() {}, 
                progressChanged: function() {} , 
                trackClicked: function() {}
            };

        //Setup Touch Events
        var isTouch           = 'ontouchstart' in window,
            eStart            = isTouch ? 'touchstart'  : 'mousedown',
            eMove             = isTouch ? 'touchmove'   : 'mousemove',
            eEnd              = isTouch ? 'touchend'    : 'mouseup',
            eCancel           = isTouch ? 'touchcancel' : 'mouseup',
           // song              = "",
            controlInnerElem  = "",
            timeInnerElem     = "",
            infoElem          = "",  
            infoInnerElem     = "",
            fullPlayerElem    = "", 
            volumeElem        = "",
            progressElem      = "",
            artworkElem       = "",
            timeElem          = "",
            controlElem       = "", 
            titleElem         = "", 
            artistElem        = "",
            backwardElem      = "",
            forwardElem       = "",
            stopElem          = "",
            playElem          = "",
            curTimeElem       = "",
            durTimeElem       = "",
            timeSeparator     = "",
            playerElem        = "";
            //container         = this, //users selector
            //uniqueID          = generateID();

        // The actual plugin constructor
        function Plugin ( element, options ) {
            this.element = element;

            // jQuery has an extend method which merges the contents of two or
            // more objects, storing the result in the first object. The first object
            // is generally empty as we don't want to alter the default options for
            // future instances of the plugin
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }

        // Avoid Plugin.prototype conflicts
        $.extend( Plugin.prototype, {
            init: function() {
                console.log(this.element);

                // Place initialization logic here
                // You already have access to the DOM element and
                // the options via the instance, e.g. this.element
                // and this.settings
                // you can add more functions like the one below and
                // call them like the example bellow
                //this.yourOtherFunction( "jQuery Boilerplate" );
                for( var elemItem in this.settings.elements ) 
                { 
                    
                    //PREPARE VOLUME
                    if (this.settings.elements[elemItem] == "volume" ) {

                        volumeElem   = "<div class='volume'><div class='volume-btn' title='Volume'></div><div class=' volume-adjust'><div><div></div></div></div></div>" ;
                        fullPlayerElem  += volumeElem; 
                    }
                    //PREPARE PROGRESS
                    else if (this.settings.elements[elemItem] == "progress" ) {
                        progressElem = "<div class='progressbar'><div class='bar-loaded' ></div><div class='bar-played'></div></div>";
                        fullPlayerElem  += progressElem; 
                    }
                    //PREPARE ARTWORK
                    else if (this.settings.elements[elemItem] == "artwork" ) {
                       artworkElem = "<div class='cover'></div>";
                       fullPlayerElem  += artworkElem; 
                    }
                    //PREPARE INFORMATION displayed by the player in  the given order
                    else if (this.settings.elements[elemItem] == "information" ) {
                        
                        $.inArray("title", this.settings.infoElements ) != '-1'   ? titleElem     = "<div class='title'></div>"  : titleElem = " " ;
                        $.inArray("artist", this.settings.infoElements ) != '-1'  ? artistElem    = "<div class='artist'></div>" : artistElem = " " ;
                        
                        for( var item in this.settings.infoElements ) {  
                            if (this.settings.infoElements[item] == "title" ) {    infoInnerElem += titleElem;  }
                            else if ( this.settings.infoElements[item]  == "artist" ) {   infoInnerElem += artistElem ;  }
                        }
                        infoElem = "<div class='info' >" + infoInnerElem + "</div>";
                        fullPlayerElem  += infoElem; 
                    }
                    //PREPARE TIME (current & Duration) in the given order
                    else if (this.settings.elements[elemItem] == "time" ) {
                    
                        $.inArray("current", this.settings.timeElements) != '-1'  ? curTimeElem = "<div class='time-current'></div>" : curTimeElem = " " ;                    
                        $.inArray("duration", this.settings.timeElements) != '-1' ? durTimeElem = "<div class='time-duration'></div>" : durTimeElem = " " ;
                        timeSeparator =  "<div class='time-separator'>" + this.settings.timeSeparator.replace(/\s/g, '&nbsp;') + "</div>" ;  
                        
                        for( var item in this.settings.timeElements ) {  
                            if( item == 1 ) { timeInnerElem +=  timeSeparator; }
                            if (this.settings.timeElements[item] == "current" ) {    timeInnerElem += curTimeElem ;  }
                            else if ( this.settings.timeElements[item]  == "duration" ) {   timeInnerElem += durTimeElem;  }
                        }
                        timeElem = "<div class='timeHolder'>" + timeInnerElem + "</div>";
                        fullPlayerElem  += timeElem; 
                    }
                    //PREPARE CONTROLS inner elements to display [play, stop, forward or backward] in the given order
                    else if (this.settings.elements[elemItem] == "controls" ) {

                        $.inArray("backward", this.settings.controlElements) != '-1'  ? backwardElem   = "<div class='rew'></div>"      : backwardElem  = " " ;
                        $.inArray("forward", this.settings.controlElements)  != '-1'  ? forwardElem  = "<div class='fwd'></div>"        : forwardElem   = " " ;
                        $.inArray("stop", this.settings.controlElements) != '-1'      ? stopElem     = "<div class='stop'></div>"       : stopElem      = " " ;
                        $.inArray("play", this.settings.controlElements) != '-1'      ? playElem     = "<div class='play'></div><div class='pause'></div>" : playElem  = " " ;

                        for( var item in this.settings.controlElements ) {  
                            if (this.settings.controlElements[item] == "backward" ) {       controlInnerElem  +=  backwardElem ;  }
                            else if (this.settings.controlElements[item] == "play" ) {      controlInnerElem +=  playElem;  }
                            else if (this.settings.controlElements[item] == "forward" ) {   controlInnerElem +=  forwardElem;  }
                            else if (this.settings.controlElements[item] == "stop" ) {   controlInnerElem +=  stopElem;  }
                        }
                        controlElem   = "<div class='controls'>" + controlInnerElem + "</div>";
                        fullPlayerElem  += controlElem; 
                    }
                }

                //ADD THE PREPARED ELEMENT SORTED IN THEIR RIGHT ORDER TO THE PLAYER ELEMENT
                playerElem = $("<div class='player' >" + fullPlayerElem + "</div>");
                $(playerElem).insertBefore($(this.element).children(".playlist"));


                var playlistHolder    = $(this.element).children(".playlist"),
                    playerHolder      = $(this.element).children(".player"),
                   song              = "",
                    theBar            = playerHolder.find('.progressbar'),
                    barPlayed         = playerHolder.find('.bar-played'),
                    barLoaded         = playerHolder.find('.bar-loaded' ),
                    timeCurrent       = playerHolder.find('.time-current'),
                    timeDuration      = playerHolder.find('.time-duration' ),
                    timeSeparator     = this.settings.timeSeparator,
                    volumeInfo        = playerHolder.find('.volume'),
                    volumeButton      = playerHolder.find('.volume-btn'),
                    volumeAdjuster    = playerHolder.find('.volume-adjust' + ' > div' ),
                    volumeValue       = this.settings.volume / 100,
                    volumeDefault     = 0,
                    trackInfo         = playerHolder.find('.info'),
                    //tracker           = playerHolder.find('.progressbar'),
                    //volume            = playerHolder.find('.volume'),
                    coverInfo         = playerHolder.find('.cover'), 
                    controlsInfo      = playerHolder.find('.controls'),
                    controlPlay       = $(controlsInfo).find('.play'),
                    controlPause      = $(controlsInfo).find('.pause'),
                    controlStop       = $(controlsInfo).find('.stop'),
                    controlFwd        = $(controlsInfo).find('.fwd'),
                    controlRew        = $(controlsInfo).find('.rew'), 
                    cssClass          = 
                    {
                        playing:        'playing',
                        mute:           'mute'
                    };


                //Volume cannot be set using JavaScript, so the volumechange event will never be fired. 
                //Even if the user changes the volume on their device while mobile Safari is open, this event will not fire
                //source: https://www.ibm.com/developerworks/library/wa-ioshtml5/
                //Hide Volume control on IOS devices. 
                if (/iPad|iPhone|iPod/.test(navigator.userAgent)) $(volumeInfo).hide();

                // initialization - first element in playlist
                this.initAudio( $(playlistHolder.children("li:first-child") ) );

                // set volume  
                //song.volume = volumeValue;

                //set default time Current and duration time
                timeDuration.html( '&hellip;' );
                timeCurrent.text( this.secondsToTime( 0 ) );  


            },
            
            secondsToTime: function( secs ) 
            {
                var hours = Math.floor( secs / 3600 ), 
                minutes = Math.floor( secs % 3600 / 60 ), 
                seconds = Math.ceil( secs % 3600 % 60 );

                return ( hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0'+hours+':' : hours+':' ) + ( minutes.toString().length < 2 ? '0'+minutes : minutes ) + ':' + ( seconds.toString().length < 2 ? '0'+seconds : seconds );
            },

            adjustCurrentTime: function( e )
            {
                theRealEvent        = isTouch ? e.originalEvent.touches[ 0 ] : e;
                song.currentTime    = Math.round( ( song.duration * ( theRealEvent.pageX - theBar.offset().left ) ) / theBar.width() );
            },

            adjustVolume: function( e )
            {  
               // volElemClicked  = e.toElement.parentElement;
               // volElemClicked  = $(volElemClicked).parent().parent().parent().parent();
               // console.log(e);

                theRealEvent    = isTouch ? e.originalEvent.touches[ 0 ] : e; 
                song.volume     = Math.abs( ( theRealEvent.pageX - ( volumeAdjuster.offset().left ) ) / volumeAdjuster.width() );
            },

            initAudio: function(elem) 
            {

                var url     = elem.children("a:first-child").attr("href"),
                    title   = elem.text(),
                    cover   = elem.attr('data-cover'),
                    artist  = elem.attr('data-artist');


                //Set the title of the song  on the player  
                //$('.player .title').text(title);
                $(this.trackInfo).children('.title').text(title);
                //Set the artist name on the player
                $(this.trackInfo).children('.artist').text(artist);

                //Set the cover image for the player 
                $(this.coverInfo).css('background-image','url('+ cover +')');

                this.song = new Audio(url); 

                //Force load
                this.song.load();

                //set the song time duration on player
                this.song.addEventListener('loadeddata', function()
                {
                    var timesec = secondsToTime(this.duration);
                    //timeDuration.html( timeSeparator  + secondsToTime(song.duration) );
                    $(this.timeDuration).html( );
                    volumeAdjuster.find( 'div' ).width( song.volume * 100 + '%' );
                    volumeDefault = song.volume;

                }, false);

             
                //update bar loader 
                this.song.addEventListener('progress', function()
                {
                    barLoaded.width( ( song.buffered.end( 0 ) / song.duration ) * 100 + '%' );
                });

                //timeupdate event listener (timeupdate used together with the current Time Property to return
                // the current position of the audio playback in seconds)   
                this.song.addEventListener('timeupdate',function ()
                {
                    timeCurrent.text( secondsToTime(song.currentTime ) ); 
                    barPlayed.width( (song.currentTime / song.duration ) * 100 + '%' );
                });

                this.song.addEventListener('volumechange', function()
                {
                   //console.log(volumeAdjuster);
                    volumeAdjuster.find( 'div' ).width( song.volume * 100 + '%' );
                    if( song.volume > 0 && playerHolder.hasClass( cssClass.mute ) ) playerHolder.removeClass( cssClass.mute );
                    if( song.volume <= 0 && !playerHolder.hasClass( cssClass.mute ) ) playerHolder.addClass( cssClass.mute );
                    volumeValue  = song.volume;
                });

                this.song.addEventListener('ended', function()
                {   
                     //Play the loaded song when autoplay is activated
                      //$('.fwd').click(); 
                    if (this.settings.autoPlay){ autoPlayNext(); } 
                    else {
                        //Hide playing class
                        playerHolder.removeClass( cssClass.playing );
                        //Hide pause Icon and show play
                        $(controlPlay).removeClass('hidden');
                        $(controlPause).removeClass('visible');
                    }

                });

                //Toggle Mute icon and reset Volume   
                $(this.volumeButton).on('click', function()
                {
                    if( playerHolder.hasClass( cssClass.mute ) )
                    {
                        playerHolder.removeClass( cssClass.mute );
                        song.volume = volumeDefault;
                    }
                    else
                    {
                        playerHolder.addClass( cssClass.mute );
                        volumeDefault = song.volume;
                        song.volume = 0;
                    }
                    return false;
                });

                //when volume bar is clicked
                $(this.volumeAdjuster).on( eStart, function( e )
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
                $(this.theBar).on( eStart, function( e )
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
                $(this.playlistHolder).children('li').removeClass('active');
                elem.addClass('active');


                //issue Callback
                this.settings.onLoad();

                //Play the loaded song when autoplay is activated
                if (this.settings.autoPlay) playAudio();  
  
            },
            playAudio: function() 
            { 
                song.play();

                //Add playing class
                playerHolder.addClass(cssClass.playing);

                //Hide pause Icon and show play if they exist 
                if ( $.inArray("controls", this.settings.elements ) != '-1' && $.inArray("play", this.settings.controlElements ) != '-1'  ) {
                    $(controlPlay).addClass('hidden');
                    $(controlPause).addClass('visible');
                }

                this.settings.onPlay();
            }

            // yourOtherFunction: function( text ) {
            //     // some logic
            //     $( this.element ).text( text );
            // }

        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function( options ) {
            return this.each( function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" +
                        pluginName, new Plugin( this, options ) );
                }
            } );
        };

} )( jQuery, window, document );