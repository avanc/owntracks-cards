OwnTracks Cards
===============

This webapp can be used to create [OwnTracks cards](https://owntracks.org/booklet/features/card/). Cards are used in OwnTracks clients like the Android and iOS apps to display fancy images with corresponding nicknames.

This webapp can be either used to just create the JSON representation of the card, which has to be published to the MQTT broker manually. Or it can directly publish the card to a MQTT broker connected using websockets. Websockets are supported by e.g. [mosquitto](https://mosquitto.org/).


Demo
----
Just head over to https://avanc.github.io/owntracks-cards, and create a card. By clicking the connection state, you can connect to your MQTT broker to publish created cards. For testing, a public MQTT broker is preconfigured (don't publish sensible data).

Note: As the github.io page is provided encrypted using https, the websocket also has to be encrypted using SSL/TLS. If your MQTT server does not allow secure connections, just install OwnTracks Cards locally (see below).


Privacy
-------
Creating the card is soley done in your browser. Thus, neither the name nor the image is send to the server. Only if you configure an MQTT broker and publish card, data leaves your browser. But again, the data is directly send to the broker and not via the server serving the webapp. 


Installation
------------
OwnTracks Cards is _just_ a plain web page. Thus, it can be served by any webserver (or even locally from the filesystem). Following is an example on how to use moqsuitto to serve the webpages:

Clone OwnTracks Cards:

    cd /my/path/to
    git clone https://github.com/avanc/owntracks-cards

Configure mosquitto in mosquitto.conf to allow websocket connections and serve the webpage from /my/path/to/owntracks-cards:

    listener 9001
    protocol websockets
    http_dir /my/path/to/owntracks-cards

Now you can access OwnTracks Cards by browsing http://yourserver:9001.

