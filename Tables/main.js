// var epoc = Date.now();
// console.log(epoc);

// var d = Date(epoc);
// d = Date.parse(d)
// console.log(typeof d);
// console.log(d)

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

const players = [
    { name: "Antoine Griezmann", team: "France" },
    { name: "Luka Modrić", team: "Croatia" },
    { name: "Ivan Rakitić", team: "Croatia" },
    { name: "Paul Pogba", team: "France" },
  ];

  const cars = [
    { brand: 'Audi', color: 'black' },
    { brand: 'Audi', color: 'white' },
    { brand: 'Ferarri', color: 'red' },
    { brand: 'Ford', color: 'white' },
    { brand: 'Peugot', color: 'white' }
  ];
  
//   const groupByColor = groupBy('color');
  const groupByTeam = groupBy('team');
  
  console.log(
    JSON.stringify({
      playersByTeam: groupByTeam(players),
    //   carsByColor: groupByColor(cars)
    }, null, 1)
  );