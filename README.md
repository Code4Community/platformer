# Platforming Game

## Getting Started

1. Clone this repository onto your computer.

: git clone https://github.com/Code4Community/platformer.git

2. Install [npm](https://www.npmjs.com/package/npm "npm")
3. Navigate to this project and run =npm install=.
4. View the project with =npm run start=.

For more details, read <https://github.com/Code4Community/platformer/blob/master/doc/developing/01-getting-started.org>

## Current Game Idea

The player controls normally. Each level has a puzzle involving reprogrammable objects, and the player can interact with those objects to change their properties and behavior. The solution to the puzzle requires the player to use basic programming and puzzle solving skills to reach the end of the level.
    
### One Level Example:
    
The Puzzle:

The player needs to move through a door, which is opened when a button is pressed. The button is in a location not accessible to the player, but accessible to a smaller creature (maybe a monster). A nearby monster isn't doing anything and is a re-programmable element, so the player can change the monster's behavior.
    
The Solution:

The player changes the monster's behavior so that it moves through the section of the level that the player can't access, and then it presses the button. Maybe its like a maze that the monster has to move through based on certain conditions. Once the monster reaches and presses the button, the player can move through the door and beat the level.

## More Resources

Learn more about webpack, phaser, and this project's architecture here:
<https://github.com/Code4Community/platformer/tree/master/doc/developing> 
