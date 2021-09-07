import React from "react";
import { useEffect, useReducer, useState } from "react";
import { StyleSheet, View, Picker, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, Input, Text, Overlay } from "react-native-elements";
import _ from "lodash";
import { reducer } from "./reducer";

const INTERVAL_TIME = 30000;

const initialState = {
  originAmount: 0,
  originCountry: "Israel (₪)",
  destinationAmount: 0,
  destinationCountry: "Spain (€)",
  rate: 0,
  mock: [],
  lastAmountChanged: "originAmount",
  rateUpdateDate: null,
};

export default function App() {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const [countries, setCountries] = useState([]);

  const [isButtonDisabled, setSButtonDisabled] = useState(false);

  const [visibleText, setVisibleText] = useState(false);
  const [textOverLay, setTextOverLay] = useState("");

  const [visibleOriginPicker, setVisibleOriginPicker] = useState(false);
  const [visibleDestinationPicker, setVisibleDestinationPicker] =
    useState(false);

  const toggleOverlayText = () => {
    setVisibleText(!visibleText);
  };
  const toggleOverlayOriginPicker = () => {
    setVisibleOriginPicker(!visibleOriginPicker);
  };
  const toggleOverlayDestinationPicker = () => {
    setVisibleDestinationPicker(!visibleDestinationPicker);
  };

  const createTextRate = () => {
    const originCurrencySymbol = appState.originCountry.charAt(
      appState.originCountry.indexOf("(") + 1
    );
    const destCurrencySymbol = appState.destinationCountry.charAt(
      appState.destinationCountry.indexOf("(") + 1
    );

    return `1${originCurrencySymbol} = ${destCurrencySymbol} ${Number(
      appState.rate
    ).toFixed(2)}`;
  };
  useEffect(() => {
    const {
      originCountry,
      destinationCountry,
      destinationAmount,
      originAmount,
    } = appState;

    if (
      originCountry === destinationCountry ||
      destinationAmount === 0 ||
      originAmount === 0
    ) {
      setSButtonDisabled(true);
    } else {
      setSButtonDisabled(false);
    }
  }, [appState]);

  // when to app is starting fetch the mock,update the state and start interval to fetch new rates every INTERVAL_TIME seconds
  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: "mock", payload: result });
        setCountries(
          _.uniq(
            result.reduce((acc, item) => {
              acc.push(item.originCountry);
              acc.push(item.destinationCountry);
              return acc;
            }, [])
          )
        );
      });

    const id = setInterval(() => {
      fetch("http://localhost:3000/")
        .then((res) => res.json())
        .then((result) => {
          if (JSON.stringify(result) !== JSON.stringify(appState.mock))
            dispatch({ type: "mock", payload: result });
        });
    }, INTERVAL_TIME);

    return () => {
      clearInterval(id);
    };
  }, []);

  const submit = () => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((result) => {
        if (JSON.stringify(result) !== JSON.stringify(appState.mock)) {
          dispatch({ type: "mock", payload: result });
          setTextOverLay("the rate has been updated please check again");
          toggleOverlayText();
        } else {
          setTextOverLay("The request has been successful");
          toggleOverlayText();
        }
      });
  };

  return (
    <SafeAreaProvider>
      <View style={[styles.container]}>
        <View
          style={[
            {
              backgroundColor: "white",
              width: "100%",
              alignItems: "center",
              borderRadius: 20,
            },
          ]}
        >
          <View>
            <Text style={{ padding: 20 }} h4>
              {createTextRate()}
            </Text>
          </View>
          <View>
            <Text style={{ padding: 20 }} h7>
              Rate last update: {appState.rateUpdateDate}
            </Text>
          </View>
          <View>
            <Text style={{ padding: 20 }} h4>
              Origin Country
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Input
                value={appState.originAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
                style={{ fontSize: 25 }}
                keyboardType={"numeric"}
                onChangeText={(text) =>
                  !isNaN(Number(text.replace(",", ""))) &&
                  dispatch({
                    type: "originAmount",
                    payload: Number(text.replace(",", "")),
                  })
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.button]}
                onPress={toggleOverlayOriginPicker}
              >
                <Text style={{ fontSize: 25, color: "blue" }}>
                  {appState.originCountry}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={{ padding: 20 }} h4>
              Destination Country
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Input
                value={appState.destinationAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
                style={{ fontSize: 25 }}
                keyboardType={"numeric"}
                onChangeText={(text) =>
                  !isNaN(Number(text.replace(",", ""))) &&
                  dispatch({
                    type: "destinationAmount",
                    payload: Number(text.replace(",", "")),
                  })
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleOverlayDestinationPicker}
              >
                <Text style={{ fontSize: 25, color: "blue" }}>
                  {appState.destinationCountry}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Button
            style={{ padding: 30, width: 200 }}
            title={"submit"}
            disabled={isButtonDisabled}
            onPress={submit}
          />
          <Overlay
            overlayStyle={{
              width: "75%",
              borderRadius: 20,
              alignItems: "center",
            }}
            isVisible={visibleText}
          >
            <Text style={{ paddingBottom: 10 }}>{textOverLay}</Text>
            <Button
              style={{ width: 50 }}
              title={"OK"}
              onPress={toggleOverlayText}
            />
          </Overlay>
          <Overlay
            overlayStyle={{ width: "75%" }}
            isVisible={visibleOriginPicker}
          >
            <Text h4>Select Origin Country:</Text>
            <Picker
              selectedValue={appState.originCountry}
              onValueChange={(itemValue, itemIndex) => {
                dispatch({ type: "originCountry", payload: itemValue });
              }}
            >
              {countries.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
            <Button title={"accept"} onPress={toggleOverlayOriginPicker} />
          </Overlay>
          <Overlay
            overlayStyle={{ width: "75%" }}
            isVisible={visibleDestinationPicker}
          >
            <Text h4>Select Destination Country:</Text>
            <Picker
              selectedValue={appState.destinationCountry}
              onValueChange={(itemValue, itemIndex) => {
                dispatch({ type: "destinationCountry", payload: itemValue });
              }}
            >
              {countries.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
            <Button title={"accept"} onPress={toggleOverlayDestinationPicker} />
          </Overlay>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "indigo",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
