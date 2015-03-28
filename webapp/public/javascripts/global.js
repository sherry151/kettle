  
  var boardURL = 'http://192.168.1.52';

  // Userlist data array for filling in info box
  var recipeListData = [];
  
  // DOM Ready =============================================================
  $(document).ready(function() {
  
    // Populate the user table on initial page load
    populateTable();
 
    // Start Cooking button click
    $('#btnStartCooking').on('click', startCooking);

    // Stop Cooking button click
    $('#btnStopCooking').on('click', stopCooking);

    // Username link click
    $('#recipeList table tbody').on('click', 'td a.linkUseRecipe', useRecipe);

    // Add User button click
    $('#btnAddRecipe').on('click', addRecipe);

    // Delete User link click
    $('#recipeList table tbody').on('click', 'td a.linkdeleteuser', deleteRecipe);


  });
  
  // Functions =============================================================
  
  // Fill table with data
  function populateTable() {
  
      // Empty content string
      var tableContent = '';
      
      // jQuery AJAX call for JSON
      $.getJSON( '/recipes/recipelist', function( data ) {
      
          // Stick our user data array into a userlist variable in the global object
          recipeListData = data;

          // For each item in our JSON, add a table row and cells to the content string
          $.each(data, function(){
          tableContent += '<tr>';
          tableContent += '<td><a href="#" class="linkUseRecipe" rel="' + this.recipename + '">' + this.recipename + '</a></td>';
          tableContent += '<td>' + this.temperature + '</td>';
          tableContent += '<td>' + this.time + '</td>';
          tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
          tableContent += '</tr>';
          });
          
          // Inject the whole content string into our existing HTML table
          $('#recipeList table tbody').html(tableContent);
      });
  };

  // Use a certain recipe to set the controller
  function useRecipe(event) {
  
        // Prevent Link from Firing
        event.preventDefault();
  
        // Retrieve username from link rel attribute
        var thisRecipeName = $(this).attr('rel');
  
        // Get Index of object based on id value
        var arrayPosition = recipeListData.map(function(arrayItem) { return arrayItem.recipename; }).indexOf(thisRecipeName);

        // Get our User Object
        var thisRecipeObject = recipeListData[arrayPosition];

        console.log("Trying to chage value");
        //TODO
        //Update the knob values according to the recipe

        $('.temp').val(thisRecipeObject.temperature).trigger("change");
        $('.time').val(thisRecipeObject.temperature).trigger("change");
        //$('#knobs input#temperature').setAttribute("value",thisRecipeObject.temperature);

        //$('#knobs input#time').setAttribute("value",thisRecipeObject.time);
        ////Populate Info Box
        //$('#userInfoName').text(thisUserObject.fullname);
        //$('#userInfoAge').text(thisUserObject.age);
        //$('#userInfoGender').text(thisUserObject.gender);
        //$('#userInfoLocation').text(thisUserObject.location);

  };

// Start Cooking
function startCooking(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    //$('#addUser input').each(function(index, val) {
    //    if($(this).val() === '') { errorCount++; }
    //});

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var settings = {
            'temperature': $('.temp').val(),
            'time': $('.time').val(),
        }

        console.log("Starting with temp: "+settings.temperature+" time: "+settings.time);

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: startCooking,
            url: boardURL+'/startCooking',
            dataType: 'JSON'
        }).done(function( response ) {

            //// Check for successful (blank) response
            //if (response.msg === '') {

            //    //// Clear the form inputs
            //    //$('#addRecipe fieldset input').val('');

            //    //// Update the table
            //    //populateTable();

            //}
            //else {

            //    // If something goes wrong, alert the error message that our service returned
            //    alert('Error: ' + response.msg);

            //}
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Start Cooking
function stopCooking(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    //$('#addUser input').each(function(index, val) {
    //    if($(this).val() === '') { errorCount++; }
    //});

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        console.log("Stopping");

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'GET',
            data: '',
            url: boardURL+'/stopCooking',
            dataType: 'JSON'
        }).done(function( response ) {

            //// Check for successful (blank) response
            //if (response.msg === '') {

            //    //// Clear the form inputs
            //    //$('#addRecipe fieldset input').val('');

            //    //// Update the table
            //    //populateTable();

            //}
            //else {

            //    // If something goes wrong, alert the error message that our service returned
            //    alert('Error: ' + response.msg);

            //}
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Add Recipe
function addRecipe(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newRecipe = {
            'recipename': $('#addRecipe fieldset input#inputRecipeName').val(),
            'temperature': $('#addRecipe fieldset input#inputRecipeTemp').val(),
            'time': $('#addRecipe fieldset input#inputRecipeTime').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newRecipe,
            url: '/recipes/addrecipe',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addRecipe fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Recipe
function deleteRecipe(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this recipe?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/recipes/deleterecipe/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};



$(function($) {

    $(".knob").knob({
        change : function (value) {
            console.log("change : " + value);
        },
        release : function (value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);
        },
        cancel : function () {
            console.log("cancel : ", this);
        },
        /*format : function (value) {
            return value + '%';
        },*/
        draw : function () {

            // "tron" case
            if(this.$.data('skin') == 'tron') {

                this.cursorExt = 0.3;

                var a = this.arc(this.cv)  // Arc
                    , pa                   // Previous arc
                    , r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    });

    // Example of infinite knob, iPod click wheel
    var v, up=0,down=0,i=0
        ,$idir = $("div.idir")
        ,$ival = $("div.ival")
        ,incr = function() { i++; $idir.show().html("+").fadeOut(); $ival.html(i); }
        ,decr = function() { i--; $idir.show().html("-").fadeOut(); $ival.html(i); };
    $("input.infinite").knob(
                        {
                        min : 0
                        , max : 20
                        , stopper : false
                        , change : function () {
                                        if(v > this.cv){
                                            if(up){
                                                decr();
                                                up=0;
                                            }else{up=1;down=0;}
                                        } else {
                                            if(v < this.cv){
                                                if(down){
                                                    incr();
                                                    down=0;
                                                }else{down=1;up=0;}
                                            }
                                        }
                                        v = this.cv;
                                    }
                        });
});



//$('.knob').animate({
//    value: 100
//}, {
//    duration: 1000,
//    easing: 'swing',
//    progress: function () {
//    $(this).val(Math.round(this.value/100*$(this).data('targetValue'))).trigger('change')
//    }
//})
