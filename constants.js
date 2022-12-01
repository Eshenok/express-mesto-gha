const patternUrl = /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/;
const productionSecurityKey = 'some-key';

module.exports = { patternUrl, productionSecurityKey };
