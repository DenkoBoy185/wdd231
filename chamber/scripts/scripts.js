// Output current year and last modified date in footer
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Responsive Hamburger Menu
const menuBtn = document.getElementById('menu-btn');
const primaryNav = document.getElementById('primary-nav');

menuBtn.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    if(primaryNav.classList.contains('open')) {
        menuBtn.innerHTML = '&#10005;'; // X symbol
    } else {
        menuBtn.innerHTML = '&#9776;'; // Hamburger symbol
    }
});

// Dynamic Member Rendering
const membersContainer = document.getElementById('members-container');
const membersDataUrl = 'data/members.json';

async function getMembersData() {
    try {
        const response = await fetch(membersDataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Failed to fetch members data:', error);
        membersContainer.innerHTML = '<p>Unable to load local business data at this time.</p>';
    }
}

function displayMembers(members) {
    membersContainer.innerHTML = ''; // Clear container

    members.forEach(member => {
        // Create card element
        const card = document.createElement('section');
        card.classList.add('member-card');

        // Create image
        const img = document.createElement('img');
        img.setAttribute('src', `images/${member.imageFileName}`);
        img.setAttribute('alt', `Logo of ${member.name}`);
        img.setAttribute('loading', 'lazy');
        // A placeholder for the image src if it fails to load
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/150?text=No+Image';
        };

        // Create elements for business details
        const h3 = document.createElement('h3');
        h3.textContent = member.name;

        const address = document.createElement('p');
        address.textContent = member.address;

        const phone = document.createElement('p');
        phone.textContent = member.phone;

        const website = document.createElement('a');
        website.setAttribute('href', member.websiteUrl);
        website.setAttribute('target', '_blank');
        website.textContent = 'Website';

        const membership = document.createElement('p');
        let levelName = 'Member';
        if (member.membershipLevel === 2) levelName = 'Silver';
        if (member.membershipLevel === 3) levelName = 'Gold';
        membership.innerHTML = `<strong>Level:</strong> ${levelName}`;

        // Append elements to card
        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(membership);

        // Append card to container
        membersContainer.appendChild(card);
    });
}

// Toggle Grid and List Views
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');

if (gridBtn && listBtn && membersContainer) {
    gridBtn.addEventListener('click', () => {
        membersContainer.classList.add('grid');
        membersContainer.classList.remove('list');
    });

    listBtn.addEventListener('click', () => {
        membersContainer.classList.add('list');
        membersContainer.classList.remove('grid');
    });

    // Initiate data fetch for directory page
    getMembersData();
}

// -----------------------------------------
// Home Page Specific Logic
// -----------------------------------------

const weatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('weather-forecast');
const spotlightContainer = document.getElementById('spotlight-container');

if (weatherContainer && forecastContainer) {
    const apiKey = 'YOUR_API_KEY_HERE'; // User needs to replace this
    const lat = 43.8231; // Rexburg, ID
    const lon = -111.7924;
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    async function fetchWeather() {
        try {
            const response = await fetch(weatherUrl);
            if (!response.ok) throw new Error('Weather fetch failed. Invalid API Key?');
            const data = await response.json();
            
            const temp = Math.round(data.main.temp);
            const desc = data.weather[0].description;
            
            weatherContainer.innerHTML = `
                <p><strong>${temp}&deg;F</strong></p>
                <p>${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
            `;
        } catch (error) {
            console.error(error);
            weatherContainer.innerHTML = `
                <p><strong>72&deg;F</strong> (Mock)</p>
                <p>Sunny</p>
            `;
        }
    }

    async function fetchForecast() {
        try {
            const response = await fetch(forecastUrl);
            if (!response.ok) throw new Error('Forecast fetch failed. Invalid API Key?');
            const data = await response.json();
            
            // Extract the next 3 days at 12:00:00 or a specific time index
            // Forecast returns data every 3 hours. We can pick indices like 8, 16, 24 for approx next 3 days.
            const days = [data.list[8], data.list[16], data.list[24]];
            
            forecastContainer.innerHTML = '';
            days.forEach((day, index) => {
                if(day) {
                    const temp = Math.round(day.main.temp);
                    const date = new Date(day.dt * 1000);
                    const dayString = date.toLocaleDateString('en-US', { weekday: 'short' });
                    forecastContainer.innerHTML += `<p><strong>${dayString}:</strong> ${temp}&deg;F</p>`;
                }
            });
            
        } catch (error) {
            console.error(error);
            // Mock forecast
            const today = new Date();
            let html = '';
            for(let i = 1; i <= 3; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dayString = date.toLocaleDateString('en-US', { weekday: 'short' });
                html += `<p><strong>${dayString}:</strong> ${70 + i}&deg;F</p>`;
            }
            forecastContainer.innerHTML = html;
        }
    }

    fetchWeather();
    fetchForecast();
}

if (spotlightContainer) {
    async function getSpotlights() {
        try {
            const response = await fetch(membersDataUrl);
            const members = await response.json();
            
            // Filter gold (3) and silver (2)
            const qualifiedMembers = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
            
            // Shuffle and pick 3
            const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3); // 2 to 3 members
            
            displaySpotlights(selected);
        } catch (error) {
            console.error('Error fetching members for spotlight:', error);
            spotlightContainer.innerHTML = '<p>Unable to load spotlights.</p>';
        }
    }
    
    function displaySpotlights(members) {
        spotlightContainer.innerHTML = '';
        members.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('spotlight-item');
            
            const h3 = document.createElement('h3');
            h3.textContent = member.name;
            
            const img = document.createElement('img');
            img.setAttribute('src', `images/${member.imageFileName}`);
            img.setAttribute('alt', `Logo of ${member.name}`);
            img.setAttribute('loading', 'lazy');
            img.onerror = function() { this.src = 'https://via.placeholder.com/150?text=No+Image'; };
            
            const details = document.createElement('div');
            details.innerHTML = `
                <p>Phone: ${member.phone}</p>
                <p><a href="${member.websiteUrl}" target="_blank">Website</a></p>
                <p>Membership Level: ${member.membershipLevel === 3 ? 'Gold' : 'Silver'}</p>
            `;
            
            card.appendChild(h3);
            card.appendChild(img);
            card.appendChild(details);
            
            spotlightContainer.appendChild(card);
        });
    }
    
    getSpotlights();
}
