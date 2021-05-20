<?php
/**
 * Search results page
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

$templates = 'search.twig';
$context = Timber::get_context();

$context['title'] = 'Search results for '. get_search_query();
$context['search_query'] = get_search_query();
$context['posts'] = Timber::get_posts();
$context['pagination'] = Timber::get_pagination();
// Set sidebar
$context['sidebar'] = Timber::get_widgets( 'sidebar-1' );

Timber::render( $templates, $context );