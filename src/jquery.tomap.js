/**
 * jQuery.reMap
 *
 * Copyright (c) 2015 Ilya R. Staheev <ilya@staheev.com>
 *
 * License
 * The MIT License (MIT)
 *
 **/

(function ($) {
    var methods = {
        init: function (settings) {
            var defaultSettings = {
                defaultZoom: 3,
                defaultCenter: '35.337023,25.124880',
                isOnlyOneWindow: true
            };

            settings = $.extend({}, defaultSettings, settings);

            var el = this,
                private_fn = {
                    create_location: function (str) {
                        var c = str.split(',');
                        return new google.maps.LatLng(c[0], c[1]);
                    },

                    create_map: function () {
                        var create_location = this.create_location;
                        options = {
                            zoom: settings.defaultZoom,
                            center: create_location(settings.defaultCenter)
                        };

                        el.each(function () {
                            var $this = $(this);
                            $this.data('map', new google.maps.Map(this, options));
                        });
                    },

                    add_marker: function (coord, text) {
                        var markers = [];
                        var create_location = this.create_location;
                        el.each(function () {
                            var $this = $(this),
                                map = $this.data('map'),
                                location = create_location(coord);

                            markers.push({
                                obj: new google.maps.Marker({
                                    position: location,
                                    map: map
                                }),
                                text: text,
                                map: map
                            });
                        });

                        return markers;
                    },

                    refresh: function () {
                        el.each(function () {
                            var $this = $(this),
                                data = $this.data('reMap'),
                                map = $this.data('map');

                            var markersBounds = new google.maps.LatLngBounds();

                            for (var i = 0; i < data.markers.length; i++) {
                                var position = data.markers[i].outputs[0].obj.position;
                                markersBounds.extend(position);
                            }

                            map.setCenter(markersBounds.getCenter());
                            map.fitBounds(markersBounds);
                        });
                    },

                    get_marker_by_id: function (id) {
                        var $el = $(el),
                            data = $el.data('reMap'),
                            markers = data.markers;

                        for (var i = 0; i < markers.length; i++)
                            if (markers[i].id == id)
                                return markers[i].outputs;

                        return false;
                    },

                    get_content_window: function (text) {
                        var $el = $(el),
                            data = $el.data('reMap');

                        if (typeof(data.callbacks.win_theme) == 'function')
                            text = data.callbacks.win_theme(text); // Callback themisation of window content

                        return new google.maps.InfoWindow({
                            content: text
                        });
                    },

                    pass_throw_markers: function (id, callback) {
                        var ouputs = this.get_marker_by_id(id);
                        ouputs.forEach(function (marker, i, arr) {
                            callback(marker, i, arr);
                        });
                    },

                    register_listener: function (id, callback) {
                        var $el = $(el),
                            data = $el.data('reMap');
                        this.pass_throw_markers(id, function (marker) {
                            google.maps.event.addListener(marker.obj, 'click', function () {
                                if (typeof(data.callbacks.marker_click) == 'function') {
                                    data.callbacks.marker_click(callback, marker.map, marker.obj);
                                } else {
                                    callback(marker.map, marker.obj);
                                }
                            });
                        });
                    },

                    open_window: function (text, map, marker_obj) {
                        var $el = $(el),
                            data = $el.data('reMap');

                        var window = this.get_content_window(text);
                        data.windows.push(window);
                        window.open(map, marker_obj);
                    },

                    close_all_win: function () {
                        var $el = $(el),
                            data = $el.data('reMap');

                        data.windows.forEach(function (window, i, arr) {
                            window.close();
                            arr.splice(i, 1);
                        });
                    }
                };

            el.each(function () {
                var $this = $(this);

                if (!$this.data('reMap'))
                    $this.data('reMap', {
                        target: $this,
                        fn: private_fn,
                        settings: settings,
                        markers: [],
                        windows: [],
                        callbacks: {}
                    });
            });

            private_fn.create_map();

            return el;
        },
        destroy: function () {
            return this.each(function () {

                var $this = $(this),
                    data = $this.data('reMap');

                data.reMap.remove();
                $this.removeData('reMap');
            })

        },

        add_marker: function (coord, text, marker_id) {
            var $this = $(this),
                data = $this.data('reMap');

            if (!coord) coord = data.settings.defaultCenter;
            if (!data.markers) data.markers = [];
            if (!marker_id) marker_id = 'marker_' + data.markers.length + 1;
            if (!text) text = '';

            data.markers.push({
                id: marker_id,
                outputs: data.fn.add_marker(coord, text)
            });

            if (text)
                data.fn.register_listener(marker_id, function (map, marker_obj) {
                    if (data.settings.isOnlyOneWindow)
                        data.fn.close_all_win();

                    data.fn.open_window(text, map, marker_obj);
                });

            data.fn.refresh();

            return marker_id;
        },

        open_win: function (marker_id) {
            var $this = $(this),
                data = $this.data('reMap');

            if (data.settings.isOnlyOneWindow)
                data.fn.close_all_win();

            data.fn.pass_throw_markers(marker_id, function (marker) {
                data.fn.open_window(marker.text, marker.map, marker.obj);
            });
        },

        close_all_win: function () {
            var $this = $(this),
                data = $this.data('reMap');

            if (typeof(data.callback.all_window_close) == 'undefined') {
                data.callback.all_window_close();
            }

            if (data.windows.length != 0)
                data.fn.close_all_win();

        },

        callback_win_theme: function (fun) {
            var $this = $(this),
                data = $this.data('reMap');

            data.callbacks.win_theme = fun;
        },

        callback_marker_click: function (fun) {
            var $this = $(this),
                data = $this.data('reMap');

            data.callbacks.marker_click = fun;
        },

        callback_window_close: function (fun) {
            var $this = $(this),
                data = $this.data('reMap');

            data.callback.window_close = fun
        },

        callback_all_window_close: function (fun) {
            var $this = $(this),
                data = $this.data('reMap');

            data.callback.all_window_close = fun
        }
    };

    jQuery.fn.reMap = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.reMap');
        }
    }
})(jQuery);