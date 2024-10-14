document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    let query = document.getElementById('query').value;
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'query': query
        })
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data);
        displayChart(data);
    });
});

function displayResults(data) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Results</h2>';
    for (let i = 0; i < data.documents.length; i++) {
        let docDiv = document.createElement('div');
        docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong><p>${data.documents[i]}</p><br><strong>Similarity: ${data.similarities[i]}</strong>`;
        resultsDiv.appendChild(docDiv);
    }
}
function displayChart(data) {
    let ctx = document.getElementById('similarity-chart').getContext('2d');
    
    if (window.similarityChart) {
        window.similarityChart.destroy();
    }

    window.similarityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.indices.map(idx => `Doc ${idx}`),
            datasets: [{
                label: 'Cosine Similarity', 
                data: data.similarities, 
                backgroundColor: 'rgba(0, 123, 255, 0.2)', 
                borderColor: 'rgba(0, 123, 255, 1)', 
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true, 
                    max: 1 
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Cosine Similarity: ${tooltipItem.raw.toFixed(3)}`; 
                        }
                    }
                }
            }
        }
    });
}
