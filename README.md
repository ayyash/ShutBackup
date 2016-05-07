# Shut
> An unobtrusive UI Framework, and CSS framework

Documentation is work in progress. Find here <a href="http://vinepaper.com/">Shut Framework</a>

The idea of this framework, is to sepearte UI behavior from business behavior whenever possible. 


## Styles

In order to use styles as included from the framework, use css/sh.min.css

```
<link rel="stylesheet" href="css/sh.min.css" />
```

This stylesheet is a compilation of the LESS files in **dev** folder, and **uidev** folder. 

- [ ] *TODO*: include C# code the for style generator (Gulp can handle it just fine).

The sequence is as follows, in case you want to recreated:

1. uidev/sh.vars.less
2. dev/sh.functions.less
3. dev/sh.less (this contains imports of all other dev/sh.*.less)
4. uidev/sh.framework.less
5. dev/rtl.sh.less (of RTL is required)
6. dev/sh.media.(\d){1}.\*.less (media queiries wrapped inside `media only screen and (min-width: {0}px)`) where {0} is the \* in the filename
7. dev/sh.print.less (if exists)
8. uidev/ui.*.less
9. uidev/rtl.*.less (if required and exists)

The dev folder contains the major definitions of styles that any UI designer need not bother about creating, while uidev folder contains the variables, framework overrides, and extensions. It was made on purpose like that to allow for maximum customization (because let's face it, Bootstrap websites look almost the same).

### RTL support

- [ ] *TODO* : section about: dev/rtl.js files that mirrors on run time during development.

The stylesheet for RTL is generated and added to css folder, you can use it alone to produce the same interface, mirrored. 

```
<link rel="stylesheet" href="css/sh.rtl.min.css" />
```

## Scripts

- [ ] *TODO*