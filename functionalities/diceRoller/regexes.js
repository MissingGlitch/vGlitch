const repetitionNotation = /^(\d+)#/i;
const diceDetector = /(\d*)d(\d+|f)((kh|kl|dh|dl|k|d)(\d*))?/ig;
const diceDestructurator = /(\d*)d(\d+|f)((kh|kl|dh|dl|k|d)(\d*))?/i;
const rollCommandRegex = /^(\d+#)?(-?([\d\(\)\s]+\s*[\-+*\/]\s*)*)[\(\)\s]*((\d*)d(\d+|f))((k|kh|kl|d|dh|dl)(\d*))?[\(\)\s]*((\s*[\-+*\/]\s*[\d\(\)\s]+)*)((\s*[\-+*\/]*\s*[\(\)\s]*\d*d(\d+|f)((k|kh|kl|d|dh|dl)\d*)?[\(\)\s]*(\s*[\-+*\/]\s*[\d\(\)\s]+)*)*)(?=[\s\n]|$)/i;

const dnd5eAdvantageTypeDetector = /(?<=\s|^)\-\-(desventaja|ventaja|vent|ven|desv|des|disadvantage|advantage|adv|dis)(?=\s|$)/i;
const dnd5eAdvantage = /(?<=\s|^)(advantage|ventaja|vent|ven|adv)(?=\s|$)/i;
const dnd5eDisadvantage = /(?<=\s|^)(disadvantage|desventaja|desv|des|dis)(?=\s|$)/i;

module.exports = { diceDetector, diceDestructurator, repetitionNotation, rollCommandRegex, dnd5eAdvantageTypeDetector, dnd5eAdvantage, dnd5eDisadvantage }