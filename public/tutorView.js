

if($(".hasAddress").val() == 'false'){
  console.log("DOESNT HAVE ADDRESS");
  doesNotHaveAddress();
}

function doesNotHaveAddress(zLink) {
  $.confirm({
      title: 'Hello!',
      columnClass: "col-md-12",
      content: '' +
      '<form action="/addAddress" method="post" class="formName">' +
      '<div class="form-group">' +
      "<label>Tut-Tut has rolled out a new incentive program, that will require us to mail certain prizes and awards to your house! If you don't mind, please input your address below!</label>" +
      '<input type="text" name="address" placeholder="Address" class="name form-control" required />' +

      '</div>' +
      '</form>',
      buttons: {
          formSubmit: {
              text: 'Submit',
              btnClass: 'btn-blue',
              action: function () {
                  var name = this.$content.find('.name').val();
                  if(!name){
                      alert('provide a valid address');
                      return false;
                  }
                  if(name){
                    $('.formName').submit();
                    console.log("SUBMITTED");
                  }

              }
          }
      }
  });
}

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

    if(inputOn == true){
      console.log("INPUT ON TRUE");
      $('#subTopicFormText').append('<select class="formField1" id="subTopic" name="subTopic"><option disabled selected>Select your option</option><option id="subTopic1"></option><option id="subTopic2"></option><option id="subTopic3"></option><option id="subTopic4"></option><option id="subTopic5"></option></select>')
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

    if(inputOn == true){
      console.log("INPUT ON TRUE");
      $('#subTopicFormText').append('<select class="formField1" id="subTopic" name="subTopic"><option disabled selected>Select your option</option><option id="subTopic1"></option><option id="subTopic2"></option><option id="subTopic3"></option><option id="subTopic4"></option><option id="subTopic5"></option></select>')
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



$('#tutorSubmit').click(function(){
  setTimeout(function(){
      $('#tutorSubmit').attr("disabled", true);
}, 100);
});

if(navigator.vendor ==  "Apple Computer, Inc." && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
  alert("At this time Safari on Desktop is not yet supported. Sorry for the inconvenience!")
  window.location.href = "https://www.tut-tut.org/";
}

  // alert("At this time Safari on Desktop is not yet supported. Sorry for the inconvenience!")
  // window.location.href = "https://www.tut-tut.org/login";


var amDeleted = false;
var pmSelected = false;
  $("#startTimeAmPmDD").change(function () {

    $("#endTimeDD").empty();

    if($(this).val() == "AM"){
      pmSelected = false;
      if(amDeleted === true){
        amDeleted = false;
        $('.endTimeAmPmDD').append($('<option>', {value:"AM",
          text: "AM", id: "endTimeAm"
          }));
      }
      for (var i = 0; i < 12; i++) {
        $('#endTimeDD').append($('<option>', {value:i+1,
          text: i+1
          }));
      }
    };
    if($(this).val() == "PM"){
      pmSelected = true;
      amDeleted = true;
      $("#endTimeAm").remove();
      populatePM();
    }

  });


  $("#startTimeDD").change(function () {
    if(pmSelected == true){
      $("#endTimeDD").empty();
      populatePM();
    }
  });


  function populatePM(){
    var startTime = parseInt($("#startTimeDD").val());
    var differenceBtwnTimes = 12 - startTime
    console.log(startTime);
    for (var i = 0; i < differenceBtwnTimes; i++) {
      var time = i+startTime+1
      $('#endTimeDD').append($('<option>', {value:time,
        text: time
        }));
    }
  }
