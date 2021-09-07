import moment from "moment/moment";

export const reducer = (state, action) => {
  let rate = 0;
  let destinationAmount = 0;
  let originAmount = 0;
  let lastAmountChanged = "";
  switch (action.type) {
    //origin country changed:
    //1) getting the new rate
    //2) calculate the new destination amount
    //3) updating the state
    case "originCountry":
      rate = getRate(action.payload, state.destinationCountry, state);
      destinationAmount = state.originAmount * rate;

      return {
        ...state,
        rate: rate,
        originCountry: action.payload,
        destinationAmount: destinationAmount,
      };

    //destination country changed:
    //1) getting the new rate
    //2) calculate the new destination amount
    //3) updating the state
    case "destinationCountry":
      rate = getRate(state.originCountry, action.payload, state);
      destinationAmount = state.originAmount * rate;

      return {
        ...state,
        rate: rate,
        destinationCountry: action.payload,
        destinationAmount: destinationAmount,
      };

    //origin amount changed:
    //1) calculate the new destination amount
    //2) updating the state
    case "originAmount":
      destinationAmount = action.payload * state.rate;
      lastAmountChanged = "originAmount";
      return {
        ...state,
        originAmount: action.payload,
        destinationAmount: destinationAmount,
        lastAmountChanged: lastAmountChanged,
      };
    //destination amount changed:
    //1) calculate the new destination amount
    //2) updating the state
    case "destinationAmount":
      originAmount = action.payload / state.rate;
      lastAmountChanged = "destinationAmount";

      return {
        ...state,
        originAmount: originAmount,
        destinationAmount: action.payload,
        lastAmountChanged: lastAmountChanged,
      };
    //mock changed:
    //1) getting the new rate
    //2) calculate the new destination amount
    //3) updating the state
    case "mock":
      rate = getRate(state.originCountry, state.destinationCountry, {
        ...state,
        mock: action.payload,
      });
      if (state.lastAmountChanged === "originAmount") {
        destinationAmount = state.originAmount * rate;
        originAmount = state.originAmount;
      } else {
        originAmount = state.destinationAmount / rate;
        destinationAmount = state.destinationAmount;
      }

      return {
        ...state,
        originAmount: originAmount,
        mock: action.payload,
        rate: rate,
        destinationAmount: destinationAmount,
        rateUpdateDate: moment().format("MMM Do YYYY, h:mm:ss a"),
      };
    default:
      return state;
  }
};
const getRate = (origin, dest, state) => {
  const correctObject = state.mock.filter(
    (object) =>
      object.originCountry === origin && object.destinationCountry === dest
  )[0];
  return Number(correctObject.rate);
};
