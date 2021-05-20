<?php

/* Enqueue the site's stylesheet */
// function uswds_theme_block_editor_style() {
//     wp_enqueue_style(
//         'uswds_theme_block_editor_css',
//         get_template_directory_uri() . '/style.css'
//     );
// }

// add_action( 'enqueue_block_assets', 'uswds_theme_block_editor_style' );

/* Register Gutenburg Blocks with ACF */
function uswds_theme_register_blocks() {

    // Hero Section
    acf_register_block( array(
        'name'            => 'hero_section',
        'title'           => 'Hero Section',
        'description'     => 'USDWS Hero Section',
        'render_callback' => 'hero_section_render_callback',
        'category'        => 'formatting',
        'icon'            => 'admin-comments',
        'keywords'        => array( 'hero' ),
    ) );

    // Card
    acf_register_block( array(
        'name'            => 'card',
        'title'           => 'Card',
        'description'     => 'USWDS Card',
        'render_callback' => 'card_section_render_callback',
        'category'        => 'formatting',
        'icon'            => 'admin-comments',
        'keywords'        => array( 'hero' ),
    ) );

}

/**
 *  Hero Section Callback
 *
 * @param   array  $block      The block settings and attributes.
 * @param   string $content    The block content (emtpy string).
 * @param   bool   $is_preview True during AJAX preview.
 */
function hero_section_render_callback( $block, $content = '', $is_preview = false ) {
    $context = Timber::context();

    // Store block values.
    $context['block'] = $block;

    // Store field values.
    $context['fields'] = get_fields();

    // Store $is_preview value.
    $context['is_preview'] = $is_preview;

    // Render the block.
    Timber::render( 'block/hero-section.twig', $context );
}

/**
 *  Card Section Callback
 *
 * @param   array  $block      The block settings and attributes.
 * @param   string $content    The block content (emtpy string).
 * @param   bool   $is_preview True during AJAX preview.
 */
function card_section_render_callback( $block, $content = '', $is_preview = false ) {
    $context = Timber::context();

    // Store block values.
    $context['block'] = $block;

    // Store field values.
    $context['fields'] = get_fields();

    // Store $is_preview value.
    $context['is_preview'] = $is_preview;

    // Render the block.
    Timber::render( 'block/card.twig', $context );
}
?>