#jQuery.toMap - plugin for simple creating google map with markers on web-page.

See demo there: [tomap.staheev.com](http://tomap.staheev.com)

##Main feauters
- Displaying google map on a site
- Dinamically adding markers on your map. The scale of the map will be changed automatically
- Displaying a window with plain text or html on click the marker
- Ability to assign your event handlers via callbacks on key events

##Installation and Use
###1 step: Link required libraries
We need Google API, jQuery. Add this code to <head> part of the site:

```html
<!-- Google API --->
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>

<!-- jQuery library (served from Google) -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>

<!-- jQuery.toMap (change if required path to the jquery.tomap.js) -->
<script src="js/jquery.toMap.js" />
```

###2 step: Adding map container
Add div block to body section. If you not assign width and height to container, size of map will be 200x150, but you can change it via css.

```javascript
<div id="map"></div>
```

###3 step: Call the plugin
To plugin work correctly put your code inside this:
```javascript
$(document).ready (function() {
    // put your code there
});
```

Init plugin:

```javascript
var map = $('#map').toMap();
```

Adding a marker to map:

```javascript
map.toMap('add_marker', '33.000,11.00', 'Text about');
```

For more information see documentation: [tomap](http://tomap.staheev.com/documentation)
