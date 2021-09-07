import fs from "fs";
import _ from "lodash";

//SETTINGS
const MAX_RATE = 2.0;
const MIN_RATE = 0.2;

//updating new fake rates between the setting values (keep the rates between same country as 1.00 )
export const updateRates = () => {
  const json = fs.readFileSync("mock.json");
  const oldRates = JSON.parse(json);
  const updatedRates = oldRates.map((object) => {
    if (!(object.originCountry === object.destinationCountry)) {
      return {
        ...object,
        rate: Math.random() * (MAX_RATE - MIN_RATE) + MIN_RATE,
      };
    }

    return object;
  });

  fs.writeFileSync("mock.json", JSON.stringify(updatedRates));
};

//calculating the best rage for origin and destination countries (linked with middleware country)
const calculateBestRate = (origin, dest, rates) => {
  const allPossibleRates = [];

  for (let i = 0; i < rates.length; i++) {
    const middleware = rates[i].destinationCountry;

    for (let j = 0; j < rates.length; j++) {
      if (
        middleware === rates[j].originCountry &&
        rates[j].destinationCountry === dest
      ) {
        allPossibleRates.push(rates[i].rate * rates[j].rate);
      }
    }
  }

  return allPossibleRates.sort()[allPossibleRates.length - 1];
};

//adding missing pair of countries (if missing) and for each match of countries without direct link find the best rate
export const getBestRatesForAll = () => {
  const json = fs.readFileSync("mock.json");
  let rates = JSON.parse(json);
  const countries = _.uniq(
    rates.reduce((acc, item) => {
      acc.push(item.originCountry);
      acc.push(item.destinationCountry);
      return acc;
    }, [])
  );

  //adding object with same origin and destination with rate of 1
  for (let i = 0; i < countries.length; i++) {
    if (
      rates.filter(
        (object) =>
          object.originCountry === countries[i] &&
          object.destinationCountry === countries[i]
      ).length === 0
    ) {
      rates.push({
        originCountry: countries[i],
        destinationCountry: countries[i],
        rate: 1,
      });
    }
  }

  //finding for each pair the best rate for the one without direct route
  for (let i = 0; i < countries.length; i++) {
    for (let j = 0; j < countries.length; j++) {
      if (
        rates.filter(
          (object) =>
            object.originCountry === countries[i] &&
            object.destinationCountry === countries[j]
        ).length === 0
      ) {
        const rate = calculateBestRate(countries[i], countries[j], rates);
        rates.push({
          originCountry: countries[i],
          destinationCountry: countries[j],
          rate: rate,
        });
      }
    }
  }

  return rates;
};
