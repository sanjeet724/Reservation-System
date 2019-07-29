import React, { Component } from 'react';
import Seat from './components/seat';
import PubNub from 'pubnub';
import { httpService } from './services/httpService';
import './App.css';

const API_URL = 'https://reservation-system-api.herokuapp.com/state';
// const API_URL = 'http://localhost:8002/state';
class App extends Component {
  state = {
    rows: 0,
    cols: 0,
    seats: [],
    pubnubUUID: '',
    selected: null
  };

  fetchConfigfromDb = async () => {
    const resourceUrl = API_URL + '/seatMap';
    const { data } = await httpService.get(resourceUrl);
    const { config } = data;
    this.setState({ rows: config.rows });
    this.setState({ cols: config.cols });
  };

  fetchSeatDataFromDb = async () => {
    const response = await httpService.get(API_URL);
    const { data } = response;
    this.setState({ seats: data.seats });
  };

  // helper to setup the db
  setupDb = async () => {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        await httpService.post(API_URL, {
          row_id: row,
          col_id: col
        });
      }
    }
  };

  componentDidMount = async () => {
    // await this.setupDb();
    await this.fetchConfigfromDb();
    await this.fetchSeatDataFromDb();

    const uuid = PubNub.generateUUID();
    this.setState({ pubnubUUID: uuid });
    this.pubnub = new PubNub({
      publishKey: 'pub-c-9ebdb0f1-0529-40ae-a4c6-07fffa4c96d6',
      subscribeKey: 'sub-c-dc3fc97e-9d09-11e9-9cd2-86061a909544',
      uuid: uuid
    });

    this.pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory') {
        }
      },
      message: async msg => {
        const { message } = msg;
        const { id, type } = message;
        switch (type) {
          case 'seat-selected':
            await this.updateSeatSelection(true, id);
            break;
          case 'seat-de-selected':
            await this.updateSeatSelection(false, id);
            break;
          default:
            break;
        }
      },
      presence: presenceEvt => {
        const { action, uuid } = presenceEvt;
        if (action === 'join') {
          console.log(`${uuid} has joined`);
        }
      }
    });

    this.pubnub.subscribe({
      channels: ['reserve-channel']
      // withPresence: true
    });
  };

  updateSeatSelection = async (selection, id) => {
    // update the db
    try {
      await httpService.put(API_URL, {
        seat_id: id,
        status: selection
      });
    } catch (e) {
      console.error(e);
    }
    // update the state
    const { seats } = this.state;
    const updatedSeat = seats.find(s => s.seat_id === id);
    updatedSeat.booked = selection;
    this.setState({ seats: seats });
    this.setState({ selected: selection });
  };

  handleSeatBeingSelected = id => {
    this.pubnub.publish({
      channel: 'reserve-channel',
      message: {
        type: 'selection-in-progress',
        id: id
      }
    });
  };

  handleSeatSelected = async id => {
    this.pubnub.publish({
      channel: 'reserve-channel',
      message: {
        type: 'seat-selected',
        id: id
      }
    });
  };

  // when we deselect a selected seat
  handleSeatDeSelected = async id => {
    this.pubnub.publish({
      channel: 'reserve-channel',
      message: {
        type: 'seat-de-selected',
        id: id
      }
    });
  };

  // when we hover but don't select
  handleSeatNotSelected = async id => {
    this.pubnub.publish({
      channel: 'reserve-channel',
      message: {
        type: 'seat-not-selected',
        id: id
      }
    });
  };

  isSeatSelected = id => {
    const { seats } = this.state;
    const seat = seats.find(s => s.seat_id === id);
    return seat ? seat.booked : undefined;
  };

  render = () => {
    let { rows, cols, seats } = this.state;
    rows = [...Array(rows).keys()];
    cols = [...Array(cols).keys()];
    return (
      <div className="App">
        <div className="seat-container">
          {rows.map((row, i) => (
            <div key={row + 'x'} className="row">
              {cols.map((col, j) => (
                <Seat
                  key={col + 'y'}
                  id={'seat-' + i + '-' + j}
                  selected={this.isSeatSelected('seat-' + i + '-' + j)}
                  seats={seats}
                  handleSeatBeingSelected={this.handleSeatBeingSelected}
                  handleSeatNotSelected={this.handleSeatNotSelected}
                  handleSeatSelected={this.handleSeatSelected}
                  handleSeatDeSelected={this.handleSeatDeSelected}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
}

export default App;
