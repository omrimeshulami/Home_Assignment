# Home_Assignment
![logo](https://user-images.githubusercontent.com/40535014/132389276-eb9ee4ec-c680-4307-ba17-b20bc4c6f6dd.jpg)

## Installation
For both 'frontend' and 'backend' directories run the next command in the terminal
```bash
npm install
```

## Running Assignment

### Backend
Run the next command in the terminal
```bash
npm start
```
### Frontend
1. Run the next command in the terminal
```bash
npm run start:clean
```
2. Press on 'run on IOS simulator' in the browser


##Testing
### Info
* The server update its rate every 10 second.
* The server print the message 'LAST RATE UPDATE + {DATE}'
* The app update its rate every 30 second.

### Actual Testing

To get the model that says: 'the rate has been updated please take a look again'
1. See that the server updated its rate while the rate didnt change in the UI of the app
2. Select amounts and press submit

To get the model that says: 'The request has been successful'
1. Try to time the moment that both of them have the same rate
2. Select amounts and press submit

Life Hack for this model: 
1. Press submit to get the 'the rate has been updated please take a look again' 
2. Then press again to get the successful message (since the fail submit retrive the updated rates)
