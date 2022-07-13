# Interstellar Generation Ship Feasibility Calculator

## Check out the [deployed app](https://lshillman.github.io/generation-ship-calculator/)

This is a calculator that you, a government representative can use to determine whether an offworld colony ship is feasible, given your GDP and space program budget.

Or that you, a wealthy private individual with disproportionate access to planetary resources, can use to determine whether you could fund such an endeavor out of your personal coffers.

This is ~~based on~~ _inspired by_ work by Project Hyperion, a two-year study on the feasibility of a crewed interstellar flight. Project Hyperion's math was not entirely grokkable for us given our timeframe to develop this, so we have greatly simplified the calculations.


## Technologies used:

* HTML
* CSS
* JS
* jQuery
* Tailwind CSS
* GOV.UK's accessible autocomplete widget

## APIs consumed:
* global-warming.org (polar ice info)
* REST countries
* World Bank Indicators (for GDP)
* NASA Exoplanet Archive
* Rich Assholes

## User stories

Our calculator supports two main use cases: a government user calculating feasibility based on a % of their GDP over time, and a wealthy individual making the same calculation based on their net worth. For the former, we fetch GDP from the World Bank Indicators api. For the latter, we fetch net worths from the Rich Assholes api.

### As a government user, I want to enter my country into a form, so that I can make calculations based on my country's GDP.
![a demo of the completed story](./assets/readme/gs-country.gif)

### As a private individual with disproportionate access to planetary resources, I want to retrieve a list of possible worlds to colonize with my vanity space program, so I can prove to the world it wasn't a vanity space program.
![a demo of the completed story](./assets/readme/gs-individual.gif)

### As any type of user, I want to be able to learn more about the possible candidate worlds, so I can make an informed decision.
![a demo of the completed story](./assets/readme/gs-learnmore.gif)

## CSS framework

We used Tailwind CSS. It's great.

![a demo of the completed story](./assets/readme/gs-responsive-behavior.gif)


## Code snippet

The following is _ and it's interesting/significant because _

````javascript
// JS snippet goes here
````

## UX wires/prototype

Here are the layouts/functionality I was going for...
![wireframe/mockup](./assets/images/readme/design.jpg)

## Screenshot of the live page and/or demo gif

![a screenshot of the live site](./assets/images/readme/screenshot.jpg)


## Credits

List collaborators and roles, and resources consulted:
https://www.w3.org/WAI/


## License

Talk to me if you want to use this.
