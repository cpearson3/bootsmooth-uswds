<?php

if ( ! class_exists( 'Timber' ) ) {
    echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';

    return;
}

$context            = Timber::context();

if ( is_singular( 'product' ) ) {
    $context['post']    = Timber::get_post();
    $product            = wc_get_product( $context['post']->ID );
    $context['product'] = $product;
    // Set sidebar
    $context['sidebar'] = Timber::get_widgets( 'sidebar-1' );

    // Get related products
    $related_limit = wc_get_loop_prop( 'columns' );
    $subcategories_array = array(0);
    $all_categories = wp_get_post_terms($product->id, 'product_cat');

    foreach ($all_categories as $category) {
        $children = get_term_children($category->term_id, 'product_cat');
        if (!sizeof($children)) {
            $subcategories_array[] = $category->term_id;
        }
    }

    $related_args = array(
        'orderby' => 'rand',
        'posts_per_page' => 4,
        'post_type' => 'product',
        'post__not_in' => array($product->id),
        'fields' => 'ids',
        'tax_query' => array(
            array(
                'taxonomy' => 'product_cat',
                'field' => 'id',
                'terms' => $subcategories_array
            )
        )
    );
    
    // $related_ids                 = wc_get_related_products( $context['post']->id, $related_limit );
    // $context['related_products'] =  Timber::get_posts( $related_ids );
    $context['related_products'] = Timber::get_posts( $related_args );

    // Restore the context and loop back to the main query loop.
    wp_reset_postdata();

    Timber::render( 'woo/single-product.twig', $context );
} else {
    $posts = Timber::get_posts();
    $context['products'] = $posts;
    $cat_args = array(
        'taxonomy'   => "product_cat",
        'hide_empty' => "true"
    );
    $context['product_categories'] = get_terms( $cat_args );
    
    if ( is_product_category() ) {
        $queried_object = get_queried_object();
        $term_id = $queried_object->term_id;
        $context['category'] = get_term( $term_id, 'product_cat' );
        $context['title'] = single_term_title( '', false );
    }

    Timber::render( 'woo/archive.twig', $context );
}