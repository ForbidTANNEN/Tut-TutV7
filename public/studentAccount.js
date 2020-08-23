
var coll = document.getElementsByClassName("collapsible");
var i;
var clicked = 0;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");

    //Clicked
    if(clicked === 0){
      clicked = 1;
      $(".content").css("border-style", "solid")
      $(".collapsableDiv").animate({height: "auto"});
    }
    //Not Clicked
    else{
      clicked = 0;
      $(".content").css("border-style", "none")
      $(".collapsableDiv").animate({height: "auto"});
    }

    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

//Calender handler

var rows = $('.formTableRow')

rows.on('click', function(e) {


   var row = $(this);
   rows.removeClass('highlight');
   row.addClass('highlight');

   $(".tableInput").val(row.attr('name'));

   console.log($('tableInput').val())
});


//SearchBar


var $rows = $('.formTableRow');
var inputOn = false;
$("#ddl").change(function () {


  if($(this).val() === "Math"){
    $('#addedSubtopicField').remove();

    if(inputOn == true){
      console.log("INPUT ON TRUE");
      $('#subTopicFormText').append('<select class="formField1" id="subTopic" name="subTopic"><option value="" disabled selected>Select your option</option><option id="subTopic1"></option><option id="subTopic2"></option><option id="subTopic3"></option><option id="subTopic4"></option><option id="subTopic5"></option><option value="Other">Other</option></select>')
      $('#subTopicInputAdded').remove();
      inputOn = false;
    }


    $('#subTopic1').html("Operations & Algebraic Thinking");
    $('#subTopic1').val("Operations & Algebraic Thinking");

    $('#subTopic2').html("Number & Operations in Base Ten");
    $('#subTopic2').val("Number & Operations in Base Ten");

    $('#subTopic3').html("Number & Operations—Fractions");
    $('#subTopic3').val("Number & Operations—Fractions");

    $('#subTopic4').html("Measurement & Data");
    $('#subTopic4').val("Measurement & Data");

    $('#subTopic5').html("Geometry");
    $('#subTopic5').val("Geometry");
  }

  if($(this).val() === "English"){
    $('#addedSubtopicField').remove();

    if(inputOn == true){
      console.log("INPUT ON TRUE");
      $('#subTopicFormText').append('<select class="formField1" id="subTopic" name="subTopic"><option value="" disabled selected>Select your option</option><option id="subTopic1"></option><option id="subTopic2"></option><option id="subTopic3"></option><option id="subTopic4"></option><option id="subTopic5"></option><option value="Other">Other</option></select>')
      $('#subTopicInputAdded').remove();
      inputOn = false;
    }

    $('#subTopic1').html("Reading");
    $('#subTopic1').val("Reading");

    $('#subTopic2').html("Writing");
    $('#subTopic2').val("Writing");

    $('#subTopic3').html("Speaking & Listening");
    $('#subTopic3').val("Speaking & Listening");

    $('#subTopic4').html("Language");
    $('#subTopic4').val("Language");

    $('#subTopic5').html("Grammar");
    $('#subTopic5').val("Grammar");
  }

  if($(this).val() === "Science" || $(this).val() === "History"){
    $('#addedSubtopicField').remove();
    if(inputOn == true){return;}
    $('#subTopicFormText').append('<input id="subTopicInputAdded" class="formField1" type="text" name="subTopic" maxlength="20" required>')
    $('#subTopic').remove();
    inputOn = true;
  }

$( "#ddl" ).change(function() {
  var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
  $rows.show().filter(function() {
    console.log($(this).attr('id'));
      var text = $(this).attr('id').replace(/\s+/g, ' ').toLowerCase();
      text = text.replace(/,/g, ' ');
      console.log(text);
      return !~text.search(val);
  }).hide();
});

var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
$rows.show().filter(function() {
  console.log($(this).attr('id'));
    var text = $(this).attr('id').replace(/\s+/g, ' ').toLowerCase();
    text = text.replace(/,/g, ' ');
    console.log(text);
    return !~text.search(val);
}).hide();



 });

 // $("#subTopic").change(function(){
 //   console.log("CHANGE: ");
 //   console.log($(this).val());
 //   // if($(this).val() === "Other"){
 //   //   $('#SubtopicDiv').append('<div class="form-border2" id="addedSubtopicField"><div class="formTextInput"><p class="formText" id="subTopicFormText">Sub-topic:</p><input type="formField1" name="" value=""><hr class="invHr"></div></div>')
 //   // }
 //   // else {
 //   //   $('#addedSubtopicField').remove();
 //   // }
 // });

 $(document.body).on('change','#subTopic',function(){
   console.log("CHANGE: ");
   console.log($(this).val());
   if($(this).val() === "Other"){
     $('<div class="form-border2" id="addedSubtopicField"><div class="formTextInput"><p class="formText" id="subTopicFormText describeTopicText" pattern="^[a-zA-Z ][a-zA-Z0-9-_\.- ]{1,117}$">Subtopic Description:</p><input type="formField1" id="describeTopic" name="subTopic" value=""><hr class="invHr"></div></div>').insertAfter("#SubtopicDiv")
// <div class="form-border"><div class="formTextInput"><p class="formText" id="subTopicFormText describeTopicText">Describe The topic:</p><input type="text" class="formField1" id="describeTopic" name="subTopic" value=""><hr class="invHr"></div></div>
     $('#subTopic').attr('name', "");
   }
   else {
     $('#addedSubtopicField').remove();
     $('#subTopic').attr('name', "subTopic");
   }
});

// $(document.body).on('change paste keyup','#describeTopic',function(){
//   $('#subTopic').val($(this).val());
// });




 //Set equal table equal to inputs

 $( window ).resize(function() {
   console.log("table width: " + $('.wholeTable').width());
   console.log("table width ADD: " + $('.wholeTable').width() + 10);
   var wid = $('#noteInput').width() + 3
  $('.tbl-header').width(wid)
  $('.tbl-content-form').width(wid)
  $('.tbl-header').width($('.tbl-content-form').width() + 3)
});

//Onload

$('.wholeTable').width($('#noteInput').width());

$('#noteInput').on('input', function(){
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});

$( document ).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

var requestTutorClick = false;
$(".dropDownButtonText").click(function(){
  if(requestTutorClick === false){
    setTimeout(function(){
        $('.content').css("max-height", "1000px")
        requestTutorClick = true;
  }, 500);
  }
});


$('.submitRequestTutor').click(function(event){
  console.log($('.tableInput').val());
  if($('.tableInput').val() == null || $('.tableInput').val() === ""){
    alert("Please Select A time Slot");
    console.log("CALLED IF");
    event.preventDefault();
  }
  console.log("CALLED CLICK");
})
