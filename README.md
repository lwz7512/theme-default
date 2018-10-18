# GitBook Default Theme - Optimized for Dynamic Use

@2018/09/20


### Goal

* Seperate articles from SUMMARY.md file
* Reduce compiliation time
* Support large number of article organization
* Minimize network traffic

### Requirement for gitbook file organization

* SUMMARY.md contains only ./xxx/README.md reference list
* README.md write only markdown list for each articles
* Directory xxx contains html segment

### Demo

...

### Development Flow

* clone this into working directory
* create your gitbook project in the same directory as this repository
* $ npm install
* edit js/less files in this project for specific function
* MODIFY package.json line: 25, change prepublish script 'yan' to your gitbook project name
* npm run prepublish
* refresh http://localhost:4000


This is the default theme for GitBook since version `3.0.0`.

It can be used as a template for theming books or can be extended.

![Image](https://raw.github.com/GitbookIO/theme-default/master/preview.png)
