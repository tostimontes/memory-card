# Museum Memory Game

## Overview

The Memory Card Game is a project developed as part of The Odin Project's React curriculum. It challenges players to test their memory by matching cards based on images from various museum collections.

## Features

- **Dynamic Image Fetching**: Integrates APIs from Cooper Hewitt, Europeana, and Harvard Art Museum to fetch images dynamically.
- **Difficulty Levels**: Players can choose between Easy (10 images), Medium (20 images), and Hard (30 images) levels.
- **Score Tracking**: The game tracks the current and best scores for each combination of image source and difficulty level.
- **Responsive Design**: Implements a user-friendly interface with modals and a dynamic grid layout.
- **Image Info Mode**: The Image Info Mode serves as an educational tool, enhancing the user's experience by providing context and background about each image when hovering over any image, as well as a link to the image's source to explore further.

## Technical Implementation

- **React Hooks**: Utilizes `useState`, `useEffect`, and `useRef` for efficient state management and handling side effects.
- **API Integration**: Fetches data from different museum APIs based on user selection.
- **Custom Hooks and Helper Functions**: Organizes logic with custom hooks and helper functions for readability and reusability.

## Gameplay

The game begins by prompting the user to select an image source and difficulty level. Players click on cards to find matches, aiming to remember each card's position. The game ends when all pairs are matched or the same card is clicked more than once.

_Feel free to play at [**Museum Memory Game**](https://memory-card-omega-five.vercel.app/) by_ [tostimontes](https://github.com/tostimontes)
![example-usage](./src/assets/usage-example.gif)

## Additional Features (Planned)

- **More Image Sources**: Adding more museums and artwork types to diversify the game experience.

## Credits and Image Sources

- [**Cooper Hewitt Smithsonian Design Museum**](https://www.cooperhewitt.org/): Posters.
- [**Europeana API**](https://www.europeana.eu/): Paintings.
- [**Harvard Art Museums**](https://harvardartmuseums.org/): Prints.
