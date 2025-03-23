import { useState } from "react";


export default function Model() {
  const [response, setResponse] = useState('');
  const [query, setQuery] = useState('');

  const fetchData = async () => {
    try {
      const results = await fetch('/api/tourist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!results.ok) {
        throw new Error(`HTTP error! status: ${results.status}`);
      }

      const data = await results.json();
      setResponse(data.Answer);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse("An error occurred while fetching the response.");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const handClick = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (

    <div>
      
      <div className="flex flex-col h-screen justify-center ml-40 ">
        <div className="bg-gray/80 max-w-[500px] w-full p-6 rounded-lg shadow-lg backdrop-blur-md">
          <h1 className="text-2xl font-bold text-center mb-4">Moroccan Tour Guide</h1>
          <input
            type="text"
            placeholder="Ask something..."
            value={query}
            onChange={handleChange}
            className=""
          />
          <button
            onClick={handClick}
            type="submit"
            className="p-5"
          >
            ASK
          </button>
          <p className="">{response.content}</p>
        </div>
      </div>

    </div>
  );
}
