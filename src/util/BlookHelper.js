class Blook {
	constructor(name, rarity, image) {
		this.name = name;
		this.rarity = rarity;
		this.image = image;
	}
}

class BlookList {
	constructor() {
		this.blooks = [];

		// Mystical
		this.addBlook('Spooky Ghost', 'Mystical');
		this.addBlook('Tim the Alien', 'Mystical');
		this.addBlook('Phantom King', 'Mystical');
		this.addBlook('Rainbow Astronaut', 'Mystical');

		// Chroma
		// this.addBlook('Blue Astronaut', 'Chroma');
		this.addBlook('Orange Astronaut', 'Chroma');
		this.addBlook('Brown Astronaut', 'Chroma');
		this.addBlook('Yellow Astronaut', 'Chroma');
		this.addBlook('Lime Astronaut', 'Chroma');
		this.addBlook('Green Astronaut', 'Chroma');
		this.addBlook('Pink Astronaut', 'Chroma');
		this.addBlook('Cyan Astronaut', 'Chroma');
		this.addBlook('Red Astronaut', 'Chroma');
		// this.addBlook('Purple Astronaut', 'Chroma');
		this.addBlook('Black Astronaut', 'Chroma');
		this.addBlook('Tropical Globe', 'Chroma');
		this.addBlook('Frost Wreath', 'Chroma');
		this.addBlook('Spooky Pumpkin', 'Chroma');
		this.addBlook('Spooky Mummy', 'Chroma');
		this.addBlook('Haunted Pumpkin', 'Chroma');
		this.addBlook('Agent Owl', 'Chroma');
		this.addBlook('Master Elf', 'Chroma');
		this.addBlook('Rainbow Panda', 'Chroma');
		this.addBlook('White Peacock', 'Chroma');
		this.addBlook('Tiger Zebra', 'Chroma');
		this.addBlook('Lovely Frog', 'Chroma');
		this.addBlook('Lucky Frog', 'Chroma');
		this.addBlook('Spring Frog', 'Chroma');

		// Legendary
		this.addBlook('King', 'Legendary');
		this.addBlook('King of Hearts', 'Legendary');
		this.addBlook('Astronaut', 'Legendary');
		this.addBlook('Mega Bot', 'Legendary');
		this.addBlook('Tyrannosaurus Rex', 'Legendary');
		this.addBlook('Baby Shark', 'Legendary');
		this.addBlook('Megalodon', 'Legendary');
		this.addBlook('Santa Claus', 'Legendary');
		this.addBlook('Ghost', 'Legendary');
		this.addBlook('Lion', 'Legendary');

		// Epic
		this.addBlook('Snowman', 'Epic');
		this.addBlook('Unicorn', 'Epic');
		this.addBlook('French Toast', 'Epic');
		this.addBlook('Werewolf', 'Epic');
		this.addBlook('Spaceship', 'Epic');
		this.addBlook('Narwhal', 'Epic');
		this.addBlook('Brainy Bot', 'Epic');
		this.addBlook('Triceratops', 'Epic');
		this.addBlook('Chameleon', 'Epic');
		this.addBlook('Mad Hatter', 'Epic');
		this.addBlook('Caterpillar', 'Epic');
		this.addBlook('Pizza', 'Epic');

		// Rare
		this.addBlook('Jester', 'Rare');
		this.addBlook('Dragon', 'Rare');
		this.addBlook('Queen', 'Rare');
		this.addBlook('Waffle', 'Rare');
		this.addBlook('Pancakes', 'Rare');
		this.addBlook('Dormouse', 'Rare');
		this.addBlook('White Rabbit', 'Rare');
		this.addBlook('Cheshire Cat', 'Rare');
		this.addBlook('Planet', 'Rare');
		this.addBlook('UFO', 'Rare');
		this.addBlook('Velociraptor', 'Rare');
		this.addBlook('Brontosaurus', 'Rare');
		this.addBlook('Watson', 'Rare');
		this.addBlook('Buddy Bot', 'Rare');
		this.addBlook('Pufferfish', 'Rare');
		this.addBlook('Blobfish', 'Rare');
		this.addBlook('Octopus', 'Rare');
		this.addBlook('Elephant', 'Rare');
		this.addBlook('Lemur', 'Rare');
		this.addBlook('Peacock', 'Rare');
		this.addBlook('Zombie', 'Rare');
		this.addBlook('Mummy', 'Rare');
		this.addBlook('Gingerbread Man', 'Rare');
		this.addBlook('Gingerbread House', 'Rare');

		// Uncommon
		this.addBlook('Witch', 'Uncommon');
		this.addBlook('Wizard', 'Uncommon');
		this.addBlook('Elf', 'Uncommon');
		this.addBlook('Fairy', 'Uncommon');
		this.addBlook('Slime Monster', 'Uncommon');
		this.addBlook('Two of Spades', 'Uncommon');
		this.addBlook('Eat Me', 'Uncommon');
		this.addBlook('Drink Me', 'Uncommon');
		this.addBlook('Alice', 'Uncommon');
		this.addBlook('Queen of Hearts', 'Uncommon');
		this.addBlook('Toast', 'Uncommon');
		this.addBlook('Cereal', 'Uncommon');
		this.addBlook('Yogurt', 'Uncommon');
		this.addBlook('Breakfast Combo', 'Uncommon');
		this.addBlook('Orange Juice', 'Uncommon');
		this.addBlook('Milk', 'Uncommon');
		this.addBlook('Earth', 'Uncommon');
		this.addBlook('Meteor', 'Uncommon');
		this.addBlook('Stars', 'Uncommon');
		this.addBlook('Alien', 'Uncommon');
		this.addBlook('Amber', 'Uncommon');
		this.addBlook('Dino Egg', 'Uncommon');
		this.addBlook('Dino Fossil', 'Uncommon');
		this.addBlook('Stegosaurus', 'Uncommon');
		this.addBlook('Lil Bot', 'Uncommon');
		this.addBlook('Lovely Bot', 'Uncommon');
		this.addBlook('Angry Bot', 'Uncommon');
		this.addBlook('Happy Bot', 'Uncommon');
		this.addBlook('Panda', 'Uncommon');
		this.addBlook('Sloth', 'Uncommon');
		this.addBlook('Tenrec', 'Uncommon');
		this.addBlook('Flamingo', 'Uncommon');
		this.addBlook('Zebra', 'Uncommon');
		this.addBlook('Pumpkin', 'Uncommon');
		this.addBlook('Swamp Monster', 'Uncommon');
		this.addBlook('Frankenstein', 'Uncommon');
		this.addBlook('Vampire', 'Uncommon');
		this.addBlook('Old Boot', 'Uncommon');
		this.addBlook('Jellyfish', 'Uncommon');
		this.addBlook('Clownfish', 'Uncommon');
		this.addBlook('Frog', 'Uncommon');
		this.addBlook('Crab', 'Uncommon');
		this.addBlook('Snow Globe', 'Uncommon');
		this.addBlook('Holiday Gift', 'Uncommon');
		this.addBlook('Hot Chocolate', 'Uncommon');
		this.addBlook('Holiday Wreath', 'Uncommon');
	}

	addBlook(name, rarity, image) {
		this.blooks.push(new Blook(name, rarity, image));
	}

	getBlooks() {
		return this.blooks;
	}

	getBlooksByRarity(rarity) {
		return this.blooks.filter(blook => blook.rarity === rarity);
	}
}

module.exports = new BlookList();