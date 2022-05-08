const randomColor = () => {
  var letters = "2323456789ABCDCD";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

module.exports.randomColor = randomColor;

