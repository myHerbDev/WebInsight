interface ResultsSectionProps {
  results: any[] // Replace 'any' with a more specific type if possible
}

function ResultsSection({ data }: ResultsSectionProps) {
  return (
    <div>
      <h2>Results</h2>
      {data.length > 0 ? (
        <ul>
          {data.map((result, index) => (
            <li key={index}>{JSON.stringify(result)}</li> // Adjust rendering based on your result structure
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  )
}

export default ResultsSection
