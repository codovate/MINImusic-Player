/*
 *  Author Sam Johnson
 *  Under MIT License
 */
(function($, window, document, undefined) {
  "use strict";
  // Create the defaults once
  var pluginName = "musicPlayer",
    defaults = {
      playlistItemSelector: "li",
      autoPlay: false,
      volume: 80,
      loop: false,
      timeSeparator: " / ",
      playerAbovePlaylist: true,
      infoElements: ["title", "artist"],
      elements: [
        "artwork",
        "information",
        "controls",
        "progress",
        "time",
        "volume"
      ],
      timeElements: ["current", "duration"],
      controlElements: ["backward", "play", "forward", "stop"],
      onLoad: function() {},
      onPlay: function() {},
      onPause: function() {},
      onStop: function() {},
      onFwd: function() {},
      onRew: function() {},
      volumeChanged: function() {},
      seeked: function() {},
      trackClicked: function() {},
      onMute: function() {}
    };

  //Setup Touch Events
  var isTouch = "ontouchstart" in window,
    eStart = isTouch ? "touchstart" : "mousedown",
    eMove = isTouch ? "touchmove" : "mousemove",
    eEnd = isTouch ? "touchend" : "mouseup",
    eCancel = isTouch ? "touchcancel" : "mouseup";

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function() {
      var controlInnerElem = "",
        timeInnerElem = "",
        infoElem = "",
        infoInnerElem = "",
        fullPlayerElem = "",
        volumeElem = "",
        progressElem = "",
        artworkElem = "",
        timeElem = "",
        controlElem = "",
        titleElem = "",
        artistElem = "",
        backwardElem = "",
        forwardElem = "",
        stopElem = "",
        playElem = "",
        curTimeElem = "",
        durTimeElem = "",
        timeSeparator = "",
        playerElem = "",
        playerThis = this;

      for (var elemItem in this.settings.elements) {
        //PREPARE VOLUME
        if (this.settings.elements[elemItem] == "volume") {
          volumeElem =
            "<div class='volume'><div class='volume-btn' title='Volume'></div><div class=' volume-adjust'><div><div></div></div></div></div>";
          fullPlayerElem += volumeElem;
        }
        //PREPARE PROGRESS
        else if (this.settings.elements[elemItem] == "progress") {
          progressElem =
            "<div class='progressbar'><div class='bar-loaded' ></div><div class='bar-played'></div></div>";
          fullPlayerElem += progressElem;
        }
        //PREPARE ARTWORK
        else if (this.settings.elements[elemItem] == "artwork") {
          artworkElem = "<div class='cover'></div>";
          fullPlayerElem += artworkElem;
        }
        //PREPARE INFORMATION displayed by the player in  the given order
        else if (this.settings.elements[elemItem] == "information") {
          $.inArray("title", this.settings.infoElements) != "-1"
            ? (titleElem = "<div class='title'></div>")
            : (titleElem = " ");
          $.inArray("artist", this.settings.infoElements) != "-1"
            ? (artistElem = "<div class='artist'></div>")
            : (artistElem = " ");

          for (var item in this.settings.infoElements) {
            if (this.settings.infoElements[item] == "title") {
              infoInnerElem += titleElem;
            } else if (this.settings.infoElements[item] == "artist") {
              infoInnerElem += artistElem;
            }
          }
          infoElem = "<div class='info' >" + infoInnerElem + "</div>";
          fullPlayerElem += infoElem;
        }
        //PREPARE TIME (current & Duration) in the given order
        else if (this.settings.elements[elemItem] == "time") {
          $.inArray("current", this.settings.timeElements) != "-1"
            ? (curTimeElem = "<div class='time-current'></div>")
            : (curTimeElem = " ");
          $.inArray("duration", this.settings.timeElements) != "-1"
            ? (durTimeElem = "<div class='time-duration'></div>")
            : (durTimeElem = " ");
          timeSeparator =
            "<div class='time-separator'>" +
            this.settings.timeSeparator.replace(/\s/g, "&nbsp;") +
            "</div>";

          for (var item in this.settings.timeElements) {
            if (item == 1) {
              timeInnerElem += timeSeparator;
            }
            if (this.settings.timeElements[item] == "current") {
              timeInnerElem += curTimeElem;
            } else if (this.settings.timeElements[item] == "duration") {
              timeInnerElem += durTimeElem;
            }
          }
          timeElem = "<div class='timeHolder'>" + timeInnerElem + "</div>";
          fullPlayerElem += timeElem;
        }
        //PREPARE CONTROLS inner elements to display [play, stop, forward or backward] in the given order
        else if (this.settings.elements[elemItem] == "controls") {
          $.inArray("backward", this.settings.controlElements) != "-1"
            ? (backwardElem = "<div class='rew'></div>")
            : (backwardElem = " ");
          $.inArray("forward", this.settings.controlElements) != "-1"
            ? (forwardElem = "<div class='fwd'></div>")
            : (forwardElem = " ");
          $.inArray("stop", this.settings.controlElements) != "-1"
            ? (stopElem = "<div class='stop'></div>")
            : (stopElem = " ");
          $.inArray("play", this.settings.controlElements) != "-1"
            ? (playElem = "<div class='play'></div><div class='pause'></div>")
            : (playElem = " ");

          for (var item in this.settings.controlElements) {
            if (this.settings.controlElements[item] == "backward") {
              controlInnerElem += backwardElem;
            } else if (this.settings.controlElements[item] == "play") {
              controlInnerElem += playElem;
            } else if (this.settings.controlElements[item] == "forward") {
              controlInnerElem += forwardElem;
            } else if (this.settings.controlElements[item] == "stop") {
              controlInnerElem += stopElem;
            }
          }
          controlElem = "<div class='controls'>" + controlInnerElem + "</div>";
          fullPlayerElem += controlElem;
        }
      }

      //ADD THE PREPARED ELEMENT SORTED IN THEIR RIGHT ORDER TO THE PLAYER ELEMENT
      playerElem = $("<div class='player' >" + fullPlayerElem + "</div>");
      //console.log(this.element);
      if (this.settings.playerAbovePlaylist) {
        $(playerElem).insertBefore($(this.element).find(".playlist"));
      } else {
        $(playerElem).insertAfter($(this.element).find(".playlist"));
      }

      this.playlistItemSelector = this.settings.playlistItemSelector;
      (this.playlistHolder = $(this.element).children(".playlist")),
        (this.playerHolder = $(this.element).children(".player"));
      this.song = "";
      this.theBar = this.playerHolder.find(".progressbar");
      this.barPlayed = this.playerHolder.find(".bar-played");
      this.barLoaded = this.playerHolder.find(".bar-loaded");
      this.timeCurrent = this.playerHolder.find(".time-current");
      this.timeDuration = this.playerHolder.find(".time-duration");
      this.timeSeparator = this.settings.timeSeparator;
      this.volumeInfo = this.playerHolder.find(".volume");
      this.volumeButton = this.playerHolder.find(".volume-btn");
      this.volumeAdjuster = this.playerHolder.find(".volume-adjust" + " > div");
      this.volumeValue = this.settings.volume / 100;
      this.volumeDefault = 0;
      this.trackInfo = this.playerHolder.find(".info");
      //tracker           = playerHolder.find('.progressbar'),
      //volume            = playerHolder.find('.volume'),
      this.coverInfo = this.playerHolder.find(".cover");
      this.controlsInfo = this.playerHolder.find(".controls");
      this.controlPlay = $(this.controlsInfo).find(".play");
      this.controlPause = $(this.controlsInfo).find(".pause");
      this.controlStop = $(this.controlsInfo).find(".stop");
      this.controlFwd = $(this.controlsInfo).find(".fwd");
      this.controlRew = $(this.controlsInfo).find(".rew");
      this.cssClass = {
        playing: "playing",
        mute: "mute"
      };

      //Volume cannot be set using JavaScript, so the volumechange event will never be fired.
      //Even if the user changes the volume on their device while mobile Safari is open, this event will not fire
      //source: https://www.ibm.com/developerworks/library/wa-ioshtml5/
      //Hide Volume control on IOS devices.
      if (/iPad|iPhone|iPod/.test(navigator.userAgent))
        $(this.volumeInfo).hide();

      // initialization - first element in playlist
      this.initAudio(
        $(this.playlistHolder.find(this.playlistItemSelector + ":first"))
      );

      // set volume
      this.song.volume = this.volumeValue;

      //set default time Current and duration time
      this.timeDuration.html("&hellip;");
      this.timeCurrent.text(this.secondsToTime(0));

      // play click
      $(this.controlPlay).click(function(e) {
        e.preventDefault();

        playerThis.playAudio();
      });

      // pause click
      $(this.controlPause).click(function(e) {
        e.preventDefault();

        playerThis.stopAudio();

        //issue pause callback
        playerThis.settings.onPause();
      });

      // forward click
      $(this.controlFwd).click(function(e) {
        e.preventDefault();

        playerThis.stopAudio();

        var next = playerThis.getSong(true);

        //Looping Activated : play the first item on the playlist if there is no next item with(looping)
        if (next.length == 0) {
          next = $(playerThis.playlistHolder).find(
            playerThis.playlistItemSelector + ":first"
          );
        }

        playerThis.loadNewSong(next);
        playerThis.playAudio();

        //issue forward callback
        playerThis.settings.onFwd();
      });

      // rewind click
      $(this.controlRew).click(function(e) {
        e.preventDefault();

        playerThis.stopAudio();

        var prev = playerThis.getSong(false);

        //play the last item on the playlist if there is no previous item (looping)
        if (prev.length == 0) {
          prev = $(playerThis.playlistHolder).find(
            playerThis.playlistItemSelector + ":last"
          );
        }

        playerThis.loadNewSong(prev);
        playerThis.playAudio();

        //issue backward callback
        playerThis.settings.onRew();
      });

      //stop click
      $(this.controlStop).click(function(e) {
        e.preventDefault();

        playerThis.stopAudio();
        playerThis.song.currentTime = 0;

        //issue stop callback
        playerThis.settings.onStop();
      });

      // Play clicked Playlist song.
      $(this.playlistHolder)
        .find(this.playlistItemSelector)
        .click(function(e) {
          e.preventDefault();

          playerThis.stopAudio();
          playerThis.loadNewSong($(this));
          playerThis.playAudio();

          //issue track clicked callback
          playerThis.settings.trackClicked();
        });
    },

    secondsToTime: function(secs) {
      var hours = Math.floor(secs / 3600),
        minutes = Math.floor((secs % 3600) / 60),
        seconds = Math.ceil((secs % 3600) % 60);

      return (
        (hours == 0
          ? ""
          : hours > 0 && hours.toString().length < 2
            ? "0" + hours + ":"
            : hours + ":") +
        (minutes.toString().length < 2 ? "0" + minutes : minutes) +
        ":" +
        (seconds.toString().length < 2 ? "0" + seconds : seconds)
      );
    },
    adjustVolume: function(e) {
      var theRealEvent = isTouch ? e.originalEvent.touches[0] : e;
      this.song.volume = Math.abs(
        (theRealEvent.pageX - this.volumeAdjuster.offset().left) /
          this.volumeAdjuster.width()
      );
    },
    adjustCurrentTime: function(e) {
      var theRealEvent = isTouch ? e.originalEvent.touches[0] : e;
      this.song.currentTime = Math.round(
        (this.song.duration *
          (theRealEvent.pageX - this.theBar.offset().left)) /
          this.theBar.width()
      );
    },

    initAudio: function(elem) {
      var url = elem.children("a:first-child").attr("href"),
        title = elem.text(),
        cover = elem.attr("data-cover"),
        artist = elem.attr("data-artist"),
        playerInstance = this;

      //Set the title of the song  on the player
      $(this.trackInfo)
        .children(".title")
        .text(title);
      //Set the artist name on the player
      $(this.trackInfo)
        .children(".artist")
        .text(artist);

      //Set the cover image for the player
      $(this.coverInfo).css("background-image", "url(" + cover + ")");

      this.song = new Audio(url);

      //Force load
      this.song.load();

      //set the song time duration on player
      this.song.addEventListener(
        "loadeddata",
        function() {
          $(playerInstance.timeDuration).html(
            playerInstance.secondsToTime(this.duration)
          );
          $(playerInstance.volumeAdjuster)
            .find("div")
            .width(this.volume * 100 + "%");
          playerInstance.volumeDefault = this.volume;
        },
        false
      );

      //update bar loader
      this.song.addEventListener("progress", function() {
        $(playerInstance.barLoaded).width(
          (this.buffered.end(0) / this.duration) * 100 + "%"
        );
      });

      //timeupdate event listener (timeupdate used together with the current Time Property to return
      // the current position of the audio playback in seconds)
      this.song.addEventListener("timeupdate", function() {
        $(playerInstance.timeCurrent).text(
          playerInstance.secondsToTime(this.currentTime)
        );
        $(playerInstance.barPlayed).width(
          (this.currentTime / this.duration) * 100 + "%"
        );
      });

      this.song.addEventListener("volumechange", function() {
        if (Number(Math.round(this.volume * 100 + "e" + 1) + "e-" + 1) <= 0.4) {
          this.volume = 0;
        }
        $(playerInstance.volumeAdjuster)
          .find("div")
          .width(this.volume * 100 + "%");
        if (
          this.volume > 0 &&
          playerInstance.playerHolder.hasClass(playerInstance.cssClass.mute)
        )
          playerInstance.playerHolder.removeClass(playerInstance.cssClass.mute);
        if (
          this.volume <= 0 &&
          !playerInstance.playerHolder.hasClass(playerInstance.cssClass.mute)
        )
          playerInstance.playerHolder.addClass(playerInstance.cssClass.mute);

        playerInstance.volumeValue = this.volume;
      });

      this.song.addEventListener("ended", function() {
        //Play the loaded song when autoplay is activated
        //$('.fwd').click();
        if (playerInstance.settings.autoPlay) {
          playerInstance.autoPlayNext();
        } else {
          //Hide playing class
          playerInstance.playerHolder.removeClass(
            playerInstance.cssClass.playing
          );
          //Hide pause Icon and show play
          $(playerInstance.controlPlay).removeClass("hidden");
          $(playerInstance.controlPause).removeClass("visible");
        }
      });

      //Toggle Mute icon and reset Volume
      $(this.volumeButton).on("click", function() {
        if (
          $(playerInstance.playerHolder).hasClass(playerInstance.cssClass.mute)
        ) {
          $(playerInstance.playerHolder).removeClass(
            playerInstance.cssClass.mute
          );
          playerInstance.song.volume = playerInstance.volumeDefault;
        } else {
          $(playerInstance.playerHolder).addClass(playerInstance.cssClass.mute);
          playerInstance.volumeDefault = playerInstance.song.volume;
          playerInstance.song.volume = 0;
          //issue callback to track mute action.
          playerInstance.settings.onMute();
        }
        return false;
      });

      //when volume bar is clicked
      $(this.volumeAdjuster)
        .on(eStart, function(e) {
          playerInstance.adjustVolume(e);
          playerInstance.volumeAdjuster.on(eMove, function(e) {
            playerInstance.adjustVolume(e);
          });
          //issue callback
          playerInstance.settings.volumeChanged();
        })
        .on(eCancel, function() {
          playerInstance.volumeAdjuster.unbind(eMove);
        });

      //when trackbar is click
      $(this.theBar)
        .on(eStart, function(e) {
          playerInstance.adjustCurrentTime(e);
          playerInstance.theBar.on(eMove, function(e) {
            playerInstance.adjustCurrentTime(e);
          });
        })
        .on(eCancel, function() {
          playerInstance.theBar.unbind(eMove);
          //issue callback
          playerInstance.settings.seeked();
        });

      $(this.playlistHolder)
        .find(playerInstance.playlistItemSelector)
        .removeClass("active");
      elem.addClass("active");

      //issue Callback
      this.settings.onLoad();

      //Play the loaded song when autoplay is activated
      if (this.settings.autoPlay) this.playAudio();
    },

    playAudio: function() {
      this.song.play();

      //Add playing class
      this.playerHolder.addClass(this.cssClass.playing);

      //Hide pause Icon and show play if they exist
      if (
        $.inArray("controls", this.settings.elements) != "-1" &&
        $.inArray("play", this.settings.controlElements) != "-1"
      ) {
        $(this.controlPlay).addClass("hidden");
        $(this.controlPause).addClass("visible");
      }
      this.settings.onPlay();
    },

    stopAudio: function() {
      this.song.pause();
      //Remove playing class
      this.playerHolder.removeClass(this.cssClass.playing);

      //Hide pause Icon and show play if they exist
      if (
        $.inArray("controls", this.settings.elements) != "-1" &&
        $.inArray("play", this.settings.controlElements) != "-1"
      ) {
        $(this.controlPlay).removeClass("hidden");
        $(this.controlPause).removeClass("visible");
      }
    },
    // Auto Play the next track and loop if loop is activated
    autoPlayNext: function() {
      this.stopAudio();
      var next = this.getSong(true);
      //Looping Activated : play the first item on the playlist if there is no next item with(looping)
      if (next.length == 0 && this.settings.loop) {
        next = $(this.playlistHolder).find(
          this.playlistItemSelector + ":first"
        );
        this.loadNewSong(next);
        this.playAudio();
      } else if (!next.length == 0) {
        this.loadNewSong(next);
        this.playAudio();
      }
    },
    //nextSong: is Boolean to get next or previous song.
    getSong: function(nextSong) {
      var $x = $(this.playlistHolder).find(this.playlistItemSelector);
      var curSong = $(this.playlistItemSelector + ".active");
      if (nextSong) {
        return $x.eq($x.index(curSong) + 1);
      } else {
        return $x.eq($x.index(curSong) - 1);
      }
    },
    //initiate the give song maintaining current settings
    loadNewSong: function(elem) {
      //save current volume  level
      this.volumeValue = this.song.volume;
      //set up the next song to be played
      this.initAudio(elem);
      //set song volume to the previous track's volume to ensure consistency
      this.song.volume = this.volumeValue;
      this.volumeAdjuster.find("div").width(this.volumeValue * 100 + "%");
      //reset progress & loaded bar indicator to begin
      this.barPlayed.width(0);
      this.barLoaded.width(0);
    }
  });

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
