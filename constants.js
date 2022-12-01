const patternUrl = /(https?:\/\/)(w{3}\.)?([\w\-\.]{1,})\.(ru|com|net|su|org)(\/\w{1}([\w\-\/]{1,}))?(\.jpg|\.png)?$/;
const patternEmail = /([\w\-\.]{1,})@([\w\-\.]{1,})\.(ru|com)/;
const productionSecurityKey = 'some-key';

module.exports = {patternUrl, patternEmail, productionSecurityKey};