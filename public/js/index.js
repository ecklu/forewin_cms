function initMap() {
  fetch('http://localhost:3000/api/test/connect')
     .then((response) => response.json())
     .then((data) =>{ 
   
    var options ={
      zoom:12,
      center:{lat:5.6037,lng:-0.1870},
      mapTypeId: "roadmap",

     }
     const map = new google.maps.Map(document.getElementById("map"), options);

     
    console.log("this is the data",data.answers)

     /*var markers = [
      {
        cords:{lat:5.6506,lng:-0.1871},
        content:'<h6>New Outlet</h6>'
       // iconImage:"https://cdn3.vectorstock.com/i/1000x1000/60/47/beach-icon-set-vector-8746047.jpg"
      },
      {
        cords:{lat:5.6128,lng:-0.2343}
      }
     ]

     for(var i = 0; i < markers.length;i++){
      addMarker(markers[i])
     }*/

    
                   
                            
      for(let i = 0; i < data.answers.length; i++){
      console.log("these are the items",data.answers[i].shopName)
      console.log("the values call",data.answers[i])
     
       
      var marker = new google.maps.Marker({
        position:{lat:data.answers[i].lat,lng:data.answers[i].long},
        map:map,
       // icon:props.iconImage
       })
       console.log("this is the marker call ",marker)

    
    addInfoWindow(marker, data.answers[i].shopName);

       //checking for undefine value for image before creating the icon
       /*if(props.iconImage){
        marker.setIcon(props.iconImage)
       }*/
       
       //checking for undefine value for info window content before creating the icon
      /* console.log(data.answers[i].outlet)
        var infoWindow = new google.maps.InfoWindow({
          content:data.answers[i].shopName
         })
         console.log("Window information call",infoWindow)
    
         marker.addListener('click',function(){
          infoWindow.open({
          anchor: marker,
          map,
         })
         })*/
       
       
      }

      
    })
    }
 

    function addInfoWindow(marker, message) {

                var infoWindow = new google.maps.InfoWindow({
                    content: message
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open(map, marker);
                });
            }
    
  
  
  
  window.initMap = initMap;


  