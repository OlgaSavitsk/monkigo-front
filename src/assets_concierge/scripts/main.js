document.addEventListener('DOMContentLoaded', function () {
    //Modal
    const modals = document.querySelectorAll('[data-modal]');
    modals.forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        const modal = document.getElementById(trigger.dataset.modal);
        modal.classList.add('show');
        const exits = modal.querySelectorAll('.modal-close');
        exits.forEach(function (exit) {
          exit.addEventListener('click', function (event) {
            event.preventDefault();
            modal.classList.remove('show');
          });
        });
      });
    });
  
    if (document.querySelector('.chat-messenger')) {
      //Scroll Top Function
      function updateScroll() {
        var element = document.getElementById('chatBody');
        element.scrollTop = element.scrollHeight;
      }
      updateScroll();
    }
  
    if (document.querySelector('.dashboard-layout')) {
      // Dashboard Navigation Toggle
      document.querySelector('.chat-messenger__mobile-toggle').onclick = function (e) {
        e.preventDefault();
        var body = document.querySelector('body');
        body.classList.toggle('sidebar-show');
      }
    }
  
    //Quantity Input
    var value,
      quantity = document.getElementsByClassName('quantity-container');
  
    function createBindings(quantityContainer) {
      var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
      var increase = quantityContainer.getElementsByClassName('increase')[0];
      var decrease = quantityContainer.getElementsByClassName('decrease')[0];
      increase.addEventListener('click', function () {
        increaseValue(quantityAmount);
      });
      decrease.addEventListener('click', function () {
        decreaseValue(quantityAmount);
      });
    }
  
    function init() {
      for (var i = 0; i < quantity.length; i++) {
        createBindings(quantity[i]);
      }
    };
  
    function increaseValue(quantityAmount) {
      value = parseInt(quantityAmount.value, 10);
      value = isNaN(value) ? 0 : value;
      value++;
      quantityAmount.value = value;
    }
  
    function decreaseValue(quantityAmount) {
      value = parseInt(quantityAmount.value, 10);
      value = isNaN(value) ? 0 : value;
      if (value > 1) value--;
      quantityAmount.value = value;
    }
    init();
    //Gallery
    var galleryThumbnail = new Swiper(".gallery-thumbnail", {
      loop: true,
      spaceBetween: 10,
      slidesPerView: 5,
      freeMode: true,
      watchSlidesProgress: true,
    });
    var galleryMain = new Swiper(".gallery-main", {
      loop: true,
      spaceBetween: 10,
      pagination: {
        el: ".swiper-fraction",
        type: "fraction",
      },
      thumbs: {
        swiper: galleryThumbnail,
      },
    });
  });