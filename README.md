# space-battle-game
### summary:
This is a fully functional but incomplete mmo .io style game in which you must attempt to take control of the galaxy.
drag links from allied to enemy planets to launch attacks or drag links between your planets to reinforce their strength.
Remove a link by redragging it.

The opening screen will appear like:

![alt text](https://github.com/joshp-f/space-server2/blob/master/readme_img/open_screen.png "Title Screen")


Once you have entered a name, you will enter the galaxy view screen. your planet will be green, enemies red.

![alt text](https://github.com/joshp-f/space-server2/blob/master/readme_img/gameplay.png "Gameplay Screen")

### config:
This server is setup to work on localhost:80 (tested on AWS). 
To get it running on your personal server:
in public/sketch.js, change the line with 'localhost:80' to the address of whatever server you are hosting on.
begin the server with 'node server.js' command.

To change the number of planets generated, change the third argument to var universe = new universe();

There is no limit of how many people may connect to a game, however, unoccupied planets must exist for each new member to join

Good luck on dominating the galaxy.
