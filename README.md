# MINImusic-Player

Free and Open-Source Jquery music player Plugin.

The following features are available free of charge :

* Playlist support;
* Ability to Customise the Controllers - to show/hide & reorder ;
* Callbacks for almost every single function;
* Autoplay and loop support
* Supports Multiple Instance on the Same Page. 

## Screenshots

![default musicplayer](http://digital.akauk.com/utils/musicPlayer/screenshot.jpg)

## Demo

http://digital.akauk.com/utils/musicPlayer

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="dist/musicplayer-min.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").musicPlayer({
		propertyName: "custom value"
	});
	```

# Playback Events

MINImusic-Player provides some useful events that you can subscribe to when implementing your music player.

``onPlay``
  fires when the Music starts to play.

``onPause``
  fires when the Music is paused.

``onStop``
  fires when the Music is stopped.

``onFwd``
  fires when the Music has been Forwarded by the user.

``onRew``
  fires when the Music has been Rewind by the user.

``volumeChanged``
  fires when the Music volume is altered by the user.

``seeked``
  fires when the Music has been seeked by the user.

``trackClicked``
  fires when a playlist track is clicked by the user.

``onMute``
  fires when the Music volume is muted by the user.

### Example Code:

``$(".example").musicPlayer({
    elements: ['artwork', 'information', 'controls', 'progress', 'time', 'volume'],
    onPlay: function() {
       $('body').css('background', 'black');
    }
 });``


# Credits

The included MP3 and Ogg files are Creative Commons licensed tracks from [Bensound.com](http://www.bensound.com/)


## License

(The MIT License)

Copyright (c) 2016 Sam Johnson samasonj@yahoo.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
