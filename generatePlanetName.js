//many thanks to https://j11y.io/javascript/random-word-generator/
function generatePlanetName(length){
    var consonants = 'bcdfghjklmnpqrstvwxyz',
    	vowels = 'aeiou',
    	rand = function(limit) {
            return Math.floor(Math.random()*limit);
        },
        word='', length = parseInt(length,10),
        consonants = consonants.split(''),
        vowels = vowels.split('');
    for (var i = 0; i < length/2; i++) {
        var randConsonant = consonants[rand(consonants.length)],
            randVowel = vowels[rand(vowels.length)];
        word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
        word += i*2<length-1 ? randVowel : '';
    }
    return word;
}
module.exports = generatePlanetName;