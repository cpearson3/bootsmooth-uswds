import USWDS from "../node_modules/uswds/dist/js/uswds";
import jquery from "../node_modules/jquery/dist/jquery";
import lity from "../node_modules/lity/dist/lity";

jQuery( function() {
   // global code here
   console.log('Start your engines...');    
});

// attach lightbox to product image
jQuery(document).on('click', '.woocommerce-product-gallery__image a', lity);