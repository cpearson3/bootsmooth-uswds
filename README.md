# US Web Design System (USWDS) Wordpress Starter Theme

An accessilble Wordpress Theme based on the [Timber Starter Theme](https://github.com/timber/starter-theme).
[Timber](https://github.com/timber/timber) is a plugin that allows you to "write your HTML using the Twig Template Engine separate from your PHP files".

## Features

* Built using [US Web Design System](https://designsystem.digital.gov/) components and design tokens for accessibility and responsiveness
* WooCommerce support
* Custom Gutenburg blocks for cards and hero components
* Options page with theme settings

* This theme requires [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/) for custom blocks and options

## Installation and setup

Download the [zip file](https://github.com/cpearson3/wordpress-uswds-starter/archive/refs/heads/master.zip) and install it using in the WordPress Admin.

Or...

1. Open a terminal and change to your wp-content/themes folder
2. Clone the repository: git clone https://github.com/cpearson3/wordpress-uswds-starter.git
3. Install project dependencies: npm install
4. Build stylesheet: npm run watch:sass
5. Build javascript: npm run watch:js

### Activating the theme

1. Login to the WordPress admin panel
2. Go to Appearance > Themes
3. Select Bootsmooth WordPress
4. Click Activate and reload the site

## Customizing the stylesheet

The main stylesheet source lives in **scss/style.scss** and is compiled to **style.css**.

## License

MIT License

Copyright (c) 2021 Clarence B Pearson III

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.