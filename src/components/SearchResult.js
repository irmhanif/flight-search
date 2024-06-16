import React, { useState } from 'react';
import moment from 'moment';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Logo from '../assets/IG.jpg';
import { cityNames } from '../data/constants';
const SearchResult = ({ results }) => {
    const [sortOption, setSortOption] = useState('price');
    const [sortDirection, setSortDirection] = useState('asc');

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortedResults = [...results].sort((a, b) => {
        let comparison = 0;
        if (sortOption === 'price') {
            comparison = a.price - b.price;
        } else if (sortOption === 'departure') {
            comparison = new Date(a.departure) - new Date(b.departure);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });
    const getTimeDifference = (fromDateTime, toDateTime) => {
        const fromDate = moment(fromDateTime);
        const toDate = moment(toDateTime);

        const diffMinutes = toDate.diff(fromDate, 'minutes');

        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}`;

    }

    const isNextDay = (fromDateTime, toDateTime) => {
        const date1 = moment(fromDateTime).startOf('day');
        const date2 = moment(toDateTime).startOf('day');

        const diffDays = date2.diff(date1, 'days');

        return diffDays === 1;
    }
    return (
        <div className="search-result" data-testid="search-results">
            <div className="sort-options">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="price">Price</option>
                    <option value="departure">Departure Time</option>
                </select>
                {sortDirection === 'asc' ? (
                    <FaSortAmountDown className="sort-icon" onClick={toggleSortDirection} />
                ) : (
                    <FaSortAmountUp className="sort-icon" onClick={toggleSortDirection} />
                )}
            </div>
            <ul>
                {sortedResults.map((flight) => (
                    <li key={flight.id} className="flight-item">
                        <div className="flight-details">
                            <div className='flight-airline-container'>
                                <img src={Logo} alt={flight?.flightNumber} />
                                <div className='flight-airline'>
                                    <span className="flight-airlinename">{flight.airline}</span>
                                    <span className="flight-number">{flight.flightNumber}</span>
                                </div>
                            </div>
                            <div className='flight-timeCityContainer'>
                                <div className="flight-timeContainer">
                                    <span className='flight-time'>{moment(flight.departure).format('HH:mm')} </span>
                                    <span className='flight-cityName'>{cityNames[flight.from]}</span>
                                </div>
                                <div className='flight-travelTime'>
                                    <span className='flight-travelHours'>{getTimeDifference(flight.departure, flight.arrival)}</span>
                                    <span className='flight-travelIcon'></span>
                                </div>
                                <div className="flight-timeContainer">
                                    <span className='flight-time'>{moment(flight.arrival).format('HH:mm')} </span>
                                    <span className='flight-cityName'>{cityNames[flight.to]}</span>
                                    {isNextDay(flight.departure, flight.arrival) && <span className='flight-nextDay'>Next Day</span>}
                                </div>
                            </div>
                            <div className="flight-price">₹{flight.price}</div>
                        </div>
                        <button className="book-button">Book flight</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResult;
