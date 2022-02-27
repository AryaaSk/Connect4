# Connect4

## I am writing this in AngularJS instead of Angular so I can have the ability to work on this at school, since terminal is blocked there.

This is basically just a regular Connect4 game, where users can create profiles and keep a rating. There is also an embeded mode, so other people can just add this to their website for games and things.

## Game Ideas:
Users can have a specific colour counter when they join, and they can change it (maybe every week or something).
There can be more than 2 people, for example you can have 4 people playing on a bigger board.

## Hosting
Using firebase to host, use this to deploy:
```
firebase deploy
```
URL: https://connect4-863d1.web.app

## Embeded:
Use this URL to access the embed mode: https://connect4-863d1.web.app/game.html?embed=true

The minimum width and height is: 740px X 1000px
If this is too large or too small for you, you can also add an optional scale parameter, 0.5 will apply a 50% scale, 2 will apply a 200% scale.
Here is an example of a URL with scale: https://connect4-863d1.web.app/game.html?embed=true&&scale=0.5

Here is an example to just add to your HTML:
```
<iframe  style="height: 1000px; width: 740px" src="https://connect4-863d1.web.app/game.html?embed=true&&scale=1"></iframe>
```