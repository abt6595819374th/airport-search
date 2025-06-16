import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import type { AirportDto } from '../types/airport.ts';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [results, setResults] = useState<AirportDto[]>([]);
  const [selectedResult, setSelectedResult] = useState<AirportDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/airports?search=${encodeURIComponent(searchTerm)}`,
      );
      const data: AirportDto[] = await response.json();
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchResults(query);
  };

  const handleSelect = (item: AirportDto) => {
    setSelectedResult(item);
    setQuery('');
    setResults([]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="bg-gradient-to-br from-stone-50 to-slate-100 max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg p-8 space-y-4 border border-slate-300"
      >
        <h1 className="text-2xl font-semibold text-center text-slate-800">
          Search airports
        </h1>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Type your search..."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-0 focus:border-slate-500 text-slate-900 placeholder-slate-400"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-slate-500"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
          {results.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-stone-50 border border-slate-300 rounded-xl shadow-md max-h-60 overflow-y-auto">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-stone-200 cursor-pointer text-slate-800"
                  onClick={() => handleSelect(result)}
                >
                  {result.name} {result.iata} ({result.unlocode}){' '}
                  {result.country}
                  {', '}
                  {result.city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && (
          <p className="text-sm text-slate-500 text-center">Loading...</p>
        )}
        {selectedResult && (
          <div className="mt-4 p-4 border border-stone-300 bg-stone-200 text-slate-900">
            <p>
              {selectedResult.name} {selectedResult.iata} (
              {selectedResult.unlocode}) {selectedResult.country}
              {', '}
              {selectedResult.city}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
