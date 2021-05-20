<?php
/**
 * Template Name: Single Page
 */

$context = Timber::context();

$timber_post     = new Timber\Post();
$context['post'] = $timber_post;
Timber::render( 'single.twig' , $context );
