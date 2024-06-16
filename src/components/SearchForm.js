import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SWAP from '../assets/swap.png';
import flightData from '../data/flights.json';
import { cityNames } from '../data/constants';

const SearchForm = ({ onSearch }) => {
    const [from, setFrom] = useState('DEL');
    const [to, setTo] = useState('BOM');
    const [departureDate, setDepartureDate] = useState();
    const [tripType, setTripType] = useState('oneway');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [options, setOptions] = useState({
        fromOptions: [],
        toOptions: []
    })

    useEffect(() => {
        const fromOptions = [];
        const toOptions = [];
        const fromSet = new Set();
        const toSet = new Set();

        flightData.forEach(flight => {
            if (!fromSet.has(flight.from)) {
                fromOptions.push({
                    cityName: cityNames[flight.from],
                    code: flight.from
                })
                fromSet.add(flight.from);
            }
            if (!toSet.has(flight.to)) {
                toOptions.push({
                    cityName: cityNames[flight.to],
                    code: flight.to
                })
                toSet.add(flight.to);
            }
        });
        setOptions({
            fromOptions,
            toOptions
        })
        const departureDate = moment('2024-06-17').format('YYYY-MM-DD');
        setDepartureDate(departureDate);
        const nextDay = moment(departureDate).add(1, 'day').format('YYYY-MM-DD');
        setReturnDate(nextDay);
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ from, to, departureDate, passengers, returnDate, tripType });
    };

    const handleDepartureDateChange = (e) => {
        const selectedDate = e.target.value;
        setDepartureDate(selectedDate);

        const minReturnDate = moment(selectedDate).add(1, 'day').format('YYYY-MM-DD');
        if (moment(returnDate).isBefore(minReturnDate)) {
            setReturnDate(minReturnDate);
        }
    };

    const swapFromTo = () => {
        setFrom(to)
        setTo(from)
    }

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group-radio">
                <label>
                    <input
                        type="radio"
                        name="tripType"
                        value="oneway"
                        checked={tripType === 'oneway'}
                        onChange={() => setTripType('oneway')}
                    />
                    One way
                </label>
                <label>
                    <input
                        type="radio"
                        name="tripType"
                        value="roundtrip"
                        checked={tripType === 'roundtrip'}
                        onChange={() => setTripType('roundtrip')}
                    />
                    Round trip
                </label>
            </div>
            <div className='form-group-search'>
                <div className="form-group">
                    <label htmlFor="from">Enter Origin</label>
                    <input
                        type="text"
                        placeholder='From'
                        list='fromCities'
                        id="from"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                    <datalist id="fromCities">
                        {options.fromOptions?.map((option, index) => (
                            <option key={index} value={option?.code} >{option?.cityName}</option>
                        ))}
                    </datalist>
                </div>
                <span className='arrowIcon'>
                    <img src={SWAP} alt='Swap' onClick={swapFromTo} />
                </span>
                <div className="form-group">
                    <label htmlFor="to">Enter Destination</label>
                    <input
                        type="text"
                        list='toCities'
                        id="to"
                        placeholder='To'
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                    <datalist id="toCities">
                        {options.toOptions?.map((option, index) => (
                            <option key={index} value={option?.code} >{option?.cityName}</option>
                        ))}
                    </datalist>
                </div>
                <div className="form-group">
                    <label htmlFor="departureDate">Departure Date</label>
                    <input
                        type="date"
                        placeholder='Depart'
                        id="departureDate"
                        value={departureDate}
                        onChange={handleDepartureDateChange}
                        min={moment().format('YYYY-MM-DD')}
                    />
                </div>
                {tripType === 'roundtrip' && (
                    <div className="form-group">
                        <label htmlFor="returnDate">Return Date</label>
                        <input
                            type="date"
                            id="returnDate"
                            value={returnDate}
                            min={moment(departureDate).add(1, 'day').format('YYYY-MM-DD')}
                            onChange={(e) => setReturnDate(e.target.value)}
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="passengers">Passengers</label>
                    <input
                        type="number"
                        id="passengers"
                        placeholder='Passengers'
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                    />
                </div>
                <button type="submit" className="search-button">Search</button>
            </div>
        </form>
    );
};

export default SearchForm;
