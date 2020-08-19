$(function(){
    $(".header-sp-icon-wrap").click(function(){
         if($(".header-sp-icon-wrap").hasClass("is-open")){
             $(".media-header-sp-nav").css("display","none");
             $(".header-sp-icon-wrap").removeClass("is-open");
         } else{
             $(".media-header-sp-nav").css("display","block");
             $(".header-sp-icon-wrap").addClass("is-open");
         }
    });
 });