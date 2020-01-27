const configurations = {
    en: [
        ['Qu','B','Z','J','X','K'], 
        ['T','O','U','O','T','O'], 
        ['O','V','W','R','G','R'], 
        ['A','A','A','F','S','R'], 
        ['A','U','M','E','E','G'],
        ['H','H','L','R','D','O'], 
        ['N', 'H', 'O', 'T', 'H', 'D'], 
        ['L', 'H', 'N', 'R', 'O', 'D'], 
        ['A', 'F', 'A', 'I', 'S', 'R'], 
        ['Y', 'I', 'F', 'A', 'S', 'R'],
        ['T', 'E', 'L', 'P', 'C', 'I'], 
        ['S', 'S', 'N', 'S', 'E', 'U'], 
        ['R', 'I', 'Y', 'P', 'R', 'H'], 
        ['D', 'O', 'R', 'D', 'L', 'N'], 
        ['C', 'C', 'W', 'N', 'S', 'T'],
        ['T', 'O', 'T', 'E', 'T', 'M'], 
        ['C', 'I', 'T', 'E', 'P', 'S'], 
        ['N', 'A', 'N', 'D', 'E', 'N'], 
        ['M', 'E', 'A', 'N', 'N', 'G'], 
        ['O', 'U', 'T', 'O', 'W', 'N'],
        ['E', 'E', 'E', 'E', 'A', 'A'], 
        ['Y', 'I', 'F', 'P', 'S', 'R'], 
        ['E', 'E', 'E', 'E', 'M', 'A'], 
        ['I', 'T', 'I', 'T', 'I', 'E'], 
        ['C', 'I', 'L', 'I', 'T', 'E']
    ],
}

function getRandIndex(length: number) {
    return Math.floor(Math.random() * Math.floor(length))
}

function getOrientation() {
    const start = [0, 90, 180, 270][getRandIndex(4)];
    const offset = getRandIndex(8) - 4;
    return start + offset;
}

function getLetter(letters: string[]) {
    return letters[getRandIndex(6)];
}

function shuffle<T = any>(array: T[]): T[] {
    const copy = [...array];

    let currentIndex = copy.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = copy[currentIndex];
      copy[currentIndex] = copy[randomIndex];
      copy[randomIndex] = temporaryValue;
    }
  
    return copy;
}

function getNewLayout() {
    return shuffle(configurations['en']).map((letters) => {
        const letter = getLetter(letters);
        const angle = getOrientation();
        return { 
            letter,
            angle,
        }
    });
}

export { getNewLayout };