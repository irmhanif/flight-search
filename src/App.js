import React, { useState, useEffect } from 'react';
import moment from 'moment';
import SearchForm from './components/SearchForm';
import SearchResult from './components/SearchResult';
import useIsMobile from './hooks/useIsMobile';
import Filter from './components/Filter';
import flightsData from './data/flights.json';
import FilterIcon from './assets/panel.png'
import './styles/styles.scss';

const App = () => {
  const isMobile = useIsMobile()
  const [results, setResults] = useState([]);
  const [showFiter, setShowFiter] = useState(true)
  const [filters, setFilters] = useState({
    tripType: 'oneway',
    from: 'DEL',
    to: 'BOM',
    departureDate: '2024-06-17',
    returnDate: '',
    passengers: 1,
    departureTime: '',
    arrivalTime: '',
    airlines: '',
    priceRange: 0
  });

  useEffect(() => {
    if (isMobile) setShowFiter(false)
    else setShowFiter(true)
  }, [isMobile])

  useEffect(() => {
    if (filters.from || filters.to || filters.departureDate || filters.returnDate ||
      filters.departureTime?.length > 0 || filters.arrivalTime?.length > 0 || filters.airlines || filters.priceRange) {
      const outboundFilteredResults = flightsData.filter((flight) => {
        const matchesFrom = filters.from ? flight.from.toLowerCase() === filters.from.toLowerCase() : true;
        const matchesTo = filters.to ? flight.to.toLowerCase() === filters.to.toLowerCase() : true;
        const matchesDepartureDate = filters.departureDate ? moment(flight.departure).isSame(filters.departureDate, 'day') : true;
        const matchesDepartureTime = filters.departureTime?.length > 0 ? filters.departureTime.some(time => checkTimeOfDay(time, moment(flight.departure).format('HH:mm'))) : true;
        const matchesArrivalTime = filters.arrivalTime?.length > 0 ? filters.arrivalTime.some(time => checkTimeOfDay(time, moment(flight.arrival).format('HH:mm'))) : true;
        const matchesAirlines = filters.airlines ? flight.airline.toLowerCase().includes(filters.airlines.toLowerCase()) : true;
        const matchesPriceRange = filters.priceRange ? flight.price <= filters.priceRange : true;

        if (filters.tripType === 'oneway') {
          return matchesFrom && matchesTo && matchesDepartureDate &&
            matchesDepartureTime && matchesArrivalTime &&
            matchesAirlines && matchesPriceRange;
        } else if (filters.tripType === 'roundtrip') {
          return matchesFrom && matchesTo && matchesDepartureDate &&
            matchesDepartureTime && matchesArrivalTime &&
            matchesAirlines && matchesPriceRange;
        }

        return false;
      });

      const returnFilteredResults = flightsData.filter((flight) => {
        const matchesFromReturn = filters.to ? flight.from.toLowerCase() === filters.to.toLowerCase() : true;
        const matchesToReturn = filters.from ? flight.to.toLowerCase() === filters.from.toLowerCase() : true;
        const matchesReturnDate = filters.returnDate ? moment(flight.departure).isSame(filters.returnDate, 'day') : true;

        return matchesFromReturn && matchesToReturn && matchesReturnDate;
      });

      const combinedResults = filters.tripType === 'roundtrip'
        ? outboundFilteredResults.concat(returnFilteredResults)
        : outboundFilteredResults;

      setResults(combinedResults);
    } else {
      setResults(flightsData);
    }
  }, [filters]);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };

  const checkTimeOfDay = (timeOfDay, flightTime) => {
    switch (timeOfDay) {
      case 'morning':
        return moment(flightTime, 'HH:mm').isBetween(moment('06:00', 'HH:mm'), moment('12:00', 'HH:mm'), 'minute');
      case 'afternoon':
        return moment(flightTime, 'HH:mm').isBetween(moment('12:00', 'HH:mm'), moment('18:00', 'HH:mm'), 'minute');
      case 'evening':
        return moment(flightTime, 'HH:mm').isBetween(moment('18:00', 'HH:mm'), moment('23:59', 'HH:mm'), 'minute') ||
          moment(flightTime, 'HH:mm').isBetween(moment('00:00', 'HH:mm'), moment('06:00', 'HH:mm'), 'minute');
      default:
        return true;
    }
  };

  const handleFilterIcon = () => {
    if (isMobile) {
      setShowFiter(!showFiter)
    }
  }


  return (
    <div className="app">
      <header className="header">
        <h1>Flight Search Engine</h1>
      </header>
      <div className="container">
        <SearchForm onSearch={handleSearch} />
        <section className={`${isMobile && 'mobile'} main-content`}>
          <aside className={`${isMobile && 'mobile'} sidebar`}>
            <h4 onClick={handleFilterIcon}>Filter <span><img className='filterIcon' src={FilterIcon} alt={'icon'} /></span></h4>
            {showFiter &&
              <Filter filters={filters} onFilterChange={setFilters} isMobile={isMobile} />
            }
          </aside>
          <main className="result-content">
            <SearchResult results={results} />
          </main>
        </section>

      </div>
    </div>
  );
};

export default App;