# Sound Effects for Operation Rising Lion

This directory contains audio files for the game. 

## Required Sound Files:

- `missile-launch.mp3` - Played when launching missiles
- `explosion.mp3` - Played when targets are hit/destroyed
- `aircraft-deploy.mp3` - Played when deploying aircraft
- `iranian-attack.mp3` - Played when Iranian forces attack
- `level-advance.mp3` - Played when advancing to next level
- `facility-destroyed.mp3` - Played when a facility is completely destroyed
- `victory.mp3` - Played when game is won
- `defeat.mp3` - Played when game is lost
- `warning.mp3` - Played for incoming missile warnings and Israeli base hits
- `button-click.mp3` - Played for UI button clicks and weapon selection
- `hit.mp3` - Played when targets are hit but not destroyed
- `intercept.mp3` - Played when missiles are intercepted

## Sound Implementation Details:

### Combat Sounds:
- **missile-launch.mp3**: Triggered when launching any missile from the Israeli platform
- **aircraft-deploy.mp3**: Triggered when deploying aircraft for attacks
- **explosion.mp3**: Triggered on various explosions throughout the game
- **hit.mp3**: Triggered when a facility is damaged but not destroyed
- **intercept.mp3**: Triggered when Israeli missiles intercept Iranian missiles or aircraft

### Strategic Sounds:
- **iranian-attack.mp3**: Triggered when Iranian missiles are launched toward Israel
- **warning.mp3**: Triggered when Iranian missiles get close to the Israeli base (proximity warning) and when the base is hit
- **facility-destroyed.mp3**: Triggered when any facility is completely destroyed (including the Israeli base)

### UI Sounds:
- **button-click.mp3**: Triggered for all UI interactions (start game, play again, back to menu, weapon selection)
- **level-advance.mp3**: Triggered when advancing to the next level

### Game State Sounds:
- **victory.mp3**: Triggered when the player completes all levels successfully
- **defeat.mp3**: Triggered when the game ends unsuccessfully (time runs out, base destroyed)

## Audio Format:
- Format: MP3
- Quality: 44.1kHz, 128kbps recommended
- Length: 1-3 seconds for effects, longer for victory/defeat

## Implementation:
The game uses a SoundManager class that handles audio playback with proper error handling for browsers that block autoplay. Sounds are volume-controlled and can be muted via the SoundManager toggle function.
