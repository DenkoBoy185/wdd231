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

gridBtn.addEventListener('click', () => {
    membersContainer.classList.add('grid');
    membersContainer.classList.remove('list');
});

listBtn.addEventListener('click', () => {
    membersContainer.classList.add('list');
    membersContainer.classList.remove('grid');
});

// Initiate data fetch
getMembersData();
