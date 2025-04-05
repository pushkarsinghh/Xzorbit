document.addEventListener('DOMContentLoaded', () => {
  const userData = JSON.parse(localStorage.getItem('pravaah_user') || sessionStorage.getItem('pravaah_user') || '{}');
  
  if (!document.querySelector('.profile-btn')) {
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      const profileBtn = document.createElement('button');
      profileBtn.className = 'profile-btn';
      profileBtn.innerHTML = '<i class="fas fa-user-circle"></i> Profile';
      headerActions.insertBefore(profileBtn, headerActions.firstChild);
    }
  }
  
  if (!document.querySelector('.profile-card')) {
    const profileCard = document.createElement('div');
    profileCard.className = 'profile-card';
    profileCard.innerHTML = `
      <h2>Student Profile</h2>
      <ul class="profile-info">
        <li>
          <span class="label">Student ID:</span>
          <span class="value">${userData.id || 'N/A'}</span>
        </li>
        <li>
          <span class="label">Name:</span>
          <span class="value">${userData.fullName || 'N/A'}</span>
        </li>
        <li>
          <span class="label">Email:</span>
          <span class="value">${userData.email || 'N/A'}</span>
        </li>
        <li>
          <span class="label">Role:</span>
          <span class="value">${userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'N/A'}</span>
        </li>
      </ul>
    `;
    document.body.appendChild(profileCard);
  }
  
  const profileBtn = document.querySelector('.profile-btn');
  const profileCard = document.querySelector('.profile-card');
  
  if (profileBtn && profileCard) {
    profileBtn.addEventListener('click', () => {
      profileCard.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
      if (!profileBtn.contains(e.target) && !profileCard.contains(e.target)) {
        profileCard.classList.remove('show');
      }
    });
  }
  
  const header = document.querySelector('header');
  if (header) {
    if (!header.querySelector('.header-container')) {
      const headerContent = header.innerHTML;
      const headerContainer = document.createElement('div');
      headerContainer.className = 'header-container';
      header.innerHTML = '';
      headerContainer.innerHTML = headerContent;
      header.appendChild(headerContainer);
    }
    
    const headerTitle = header.querySelector('h1');
    if (headerTitle) {
      headerTitle.classList.add('header-title');
    }
  }
}); 