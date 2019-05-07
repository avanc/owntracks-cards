

var vue_card = Vue.extend({
  props: ["data", "mqtt_state"],
  data: function () {
    return {
      edit: false,
      error: {
        title: "",
        text: ""
      }
    }
  },
  watch: {
    "data": function(val){
    }
  },
  computed: {
    dataurl : function()
    {
      return "data:image/png;base64," + this.data.face;
    }
  },
  created: function() {
  },
  methods: {
    deleteCard: function(){
      client.send(this.data.topic, "", 0, true);
    },
    processFile: function(event) {
      var file = event.target.files[0]; 
      // Only process image files.
      if (file.type.match('image.*')) {
        var reader = new FileReader();
        var vue=this;

        // Closure to capture the file information.
        reader.onload = function(e) {
            vue.scaleImage(e.target.result);
          };

        // Read in the image file as a data URL.
          reader.readAsDataURL(file);
      }

    },
    scaleImage: function(strDataURI) {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      canvas.width = 40; // target width
      canvas.height = 40; // target height

      var img = new Image;
      var vue=this;
      img.onload = function(){
        ctx.drawImage(img, 
          0, 0, img.width, img.height, 
          0, 0, canvas.width, canvas.height
        );

        // create a new base64 encoding
        Vue.set(vue.data, "face", canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, ""))
      };
      
      img.src = strDataURI;      
    },
    send: function() {
      var message={};
      message["_type"]="card";
      message["name"]=this.data.name;
      message["face"]=this.data.face;
      console.log(message);
      client.send(this.data.topic, JSON.stringify(message, null, 2), 0, true);
      this.edit=false;
    },
    save: function() {
      // Based on https://stackoverflow.com/a/50358691
      var message={};
      message["_type"]="card";
      message["name"]=this.data.name;
      message["face"]=this.data.face;
      var filename="card.json"
      var data=JSON.stringify(message, null, 2);
 
      var blob = new Blob([data], {type:'octet/stream'});

      //IE 10+
      if (window.navigator.msSaveBlob) {
          window.navigator.msSaveBlob(blob, filename);
      }
      else {
          //Everything else
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = filename;

          setTimeout(() => {
              //setTimeout hack is required for older versions of Safari

              a.click();

              //Cleanup
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
          }, 1);
      }
    }
  },
  template: `
    <li>
      <div v-show="edit == false">
        <div class="w3-bar">
          <img class="w3-bar-item w3-circle" v-bind:src="dataurl"/>
          <div class="w3-bar-item">
            <span class="w3-large">{{data.name}}</span><br>
            <span>{{data.topic}}</span>
          </div>
        </div>
        <button v-on:click="edit=true">Edit</button>
        <button v-on:click="deleteCard">Delete</button>
      </div>

      <div v-show="edit == true">
        <label class="w3-text-gray">Topic</label>
        <input class="w3-input w3-border" type="text" v-model="data.topic" placeholder="Topic">
        
        <label class="w3-text-gray">Name</label>
        <input class="w3-input w3-border" type="text" v-model="data.name" placeholder="Name">
        
        <img v-bind:src="dataurl"/>
        <input type="file" @change="processFile($event)" />
        <br>
        <button v-on:click="send">Send</button>
        <button v-on:click="save">Save JSON</button>
        <button v-on:click="edit=false">Cancel</button>
      </div>
    </li>`
});
Vue.component('card', vue_card)

