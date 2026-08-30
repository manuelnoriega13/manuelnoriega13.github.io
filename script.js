function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    let tablinks = document.getElementsByClassName("tab");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.className += " active";
}

function setText(id, value) {
    document.getElementById(id).textContent = value;
}

function renderSite(data) {
    const { site, profile, projects, contact } = data;
    document.title = `${site.name} | ${site.domain}`;
    setText('window-title', `${site.username}@${site.host}:~ — ${site.terminal}`);
    setText('profile-username', site.username);
    setText('profile-host', site.host);
    setText('profile-os', profile.os);
    setText('profile-role', profile.role);
    setText('profile-shell', profile.shell);
    setText('profile-terminal', site.terminal);

    const about = document.getElementById('about-content');
    about.replaceChildren();
    profile.about.forEach((paragraph, index) => {
        if (index) about.appendChild(document.createElement('br'));
        about.append(paragraph);
    });

    const projectList = document.getElementById('projects-list');
    projectList.replaceChildren();
    projects.forEach((project) => {
        const row = document.createElement('tr');
        [
            ['perms', project.permissions],
            ['owner', site.username],
            ['size', project.size],
            ['date', project.date],
            ['filename', project.filename]
        ].forEach(([className, value]) => {
            const cell = document.createElement('td');
            cell.className = className;
            cell.textContent = value;
            row.appendChild(cell);
        });
        const description = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.className = 'tree-branch';
        cell.textContent = `└── ${project.description}`;
        description.appendChild(cell);
        projectList.append(row, description);
    });

    const contactList = document.getElementById('contact-list');
    contactList.replaceChildren();
    contact.forEach((link) => {
        const line = document.createElement('div');
        const label = document.createElement('span');
        label.className = `contact-label ${link.color}`;
        label.textContent = `[${link.label}]`;
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.display;
        if (link.url.startsWith('http')) anchor.target = '_blank';
        line.append(label, ' -> ', anchor);
        contactList.appendChild(line);
    });
}

fetch('data.json')
    .then((response) => {
        if (!response.ok) throw new Error(`Could not load data.json (${response.status})`);
        return response.json();
    })
    .then(renderSite)
    .catch((error) => console.error('Site content could not be loaded:', error));
